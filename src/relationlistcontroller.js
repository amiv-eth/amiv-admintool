import m from 'mithril';
import Stream from 'mithril/stream';
import { ResourceHandler } from './auth';
import { debounce } from './utils';

export default class RelationlistController {
  /*
   * Controller for a list of data embedding a relationship.
   * The secondary api endpoint is embedded into the list items of the primary endpoint results.
   * Searches are applied to both resources, queries and filters need to be specified for each.
   */
  constructor(
    primary,
    secondary,
    query = {},
    searchKeys = false,
    secondaryQuery = {},
    secondarySearchKeys = false,
  ) {
    this.handler = new ResourceHandler(primary, searchKeys);
    this.handler2 = new ResourceHandler(secondary, secondarySearchKeys);
    this.secondaryKey = secondary.slice(0, -1);
    this.query = query || {};
    this.query2 = secondaryQuery || {};
    this.search = null;
    this.filter = null;
    this.filter2 = null;
    // state pointer that is counted up every time the table is refreshed so
    // we can tell infinite scroll that the data-version has changed.
    this.stateCounter = Stream(0);
    this.refresh();
    this.debouncedSearch = debounce((search) => {
      this.setSearch(search);
      this.refresh();
      m.redraw();
    }, 100);
    // keep track of the total number of pages
    this.totalPages = null;
  }

  refresh() {
    this.stateCounter(this.stateCounter() + 1);
  }

  infiniteScrollParams(item) {
    return {
      item,
      pageData: pageNum => this.getPageData(pageNum),
      pageKey: pageNum => `${pageNum}-${this.stateCounter()}`,
    };
  }

  getPageData(pageNum) {
    // We first query the primary resource for a list of items and then query the secondary
    // resource for the items specified by the relation in the primary resource
    // We apply Queries for both resources seperately.
    const query = Object.assign({}, this.query);
    query.max_results = 10;
    query.page = pageNum;
    query.where = { ...this.filter, ...this.query.where };

    console.log(query.search);

    return new Promise((resolve) => {
      this.handler.get(query).then((data) => {
        // update total number of pages
        this.totalPages = Math.ceil(data._meta.total / 10);

        console.log(data._items.map(item => item._id));

        const query2 = Object.assign({}, this.query2);
        query2.where = {
          _id: { $in: data._items.map(item => item[this.secondaryKey]) },
          ...this.filter2,
          ...this.query2.where,
        };
        this.handler2.get(query2).then((secondaryData) => {
          // check which secondary items were filtered out
          const secondaryIds = secondaryData._items.map(item => item._id);
          // filter the primary list to only include those items that have a relation to
          // the queried secondary IDs
          const filteredPrimaries = data._items.filter(item =>
            secondaryIds.includes(item[this.secondaryKey]));
          // now return the list of filteredPrimaries with the secondary data embedded
          resolve(filteredPrimaries.map((item) => {
            const itemCopy = Object.assign({}, item);
            itemCopy[this.secondaryKey] = secondaryData._items.find(relItem =>
              relItem._id === item[this.secondaryKey]);
            return itemCopy;
          }));
        });
      });
    });
  }

  /*
   * Get all available pages
   */
  getFullList() {
    return new Promise((resolve) => {
      // get first page to refresh total page count
      this.getPageData(1).then((firstPage) => {
        const pages = { 1: firstPage };
        // save totalPages as a constant to avoid race condition with pages added during this
        // process
        const { totalPages } = this;
        console.log(totalPages);

        if (totalPages === 1) {
          resolve(firstPage);
        }

        // now fetch all the missing pages
        Array.from(new Array(totalPages - 1), (x, i) => i + 2).forEach((pageNum) => {
          this.getPageData(pageNum).then((newPage) => {
            pages[pageNum] = newPage;
            // look if all pages were collected
            const missingPages = Array.from(new Array(totalPages), (x, i) => i + 1).filter(i =>
              !(i in pages));
            console.log('missingPages', missingPages);
            if (missingPages.length === 0) {
              // collect all the so-far loaded pages in order (sorted keys)
              // and flatten them into 1 array
              resolve([].concat(...Object.keys(pages).sort().map(key => pages[key])));
            }
          });
        });
      });
    });
  }

  setSearch(search) {
    this.search = search;
    this.query.search = search;
    this.query2.search = search;
  }

  setFilter(filter) {
    this.filter = {};
    this.filter2 = {};
    // split up filters between resouce and relation
    Object.keys(filter).forEach((key) => {
      if (key.startsWith(`${this.secondaryKey}.`)) {
        this.filter2[key.slice(this.secondaryKey.length + 1)] = filter[key];
      } else {
        this.filter[key] = filter[key];
      }
    });
    this.refresh();
  }

  setQuery(query) {
    this.query = query;
    this.query.search = this.search;
    this.refresh();
  }
}

