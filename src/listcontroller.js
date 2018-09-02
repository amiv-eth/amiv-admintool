import m from 'mithril';
import Stream from 'mithril/stream';
import { ResourceHandler } from './auth';
import { debounce } from './utils';

export default class DatalistController {
  constructor(resource, query = {}, searchKeys = false) {
    this.handler = new ResourceHandler(resource, searchKeys);
    this.query = query || {};
    this.filter = null;
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
    // for some reason this is called before the object is instantiated.
    // check this and return nothing
    const query = Object.assign({}, this.query);
    query.max_results = 10;
    query.page = pageNum;
    query.where = { ...this.filter, ...this.query.where };
    // remove where again if it is empty
    if (Object.keys(query.where).length === 0) delete query.where;

    return new Promise((resolve) => {
      this.handler.get(query).then((data) => {
        // update total number of pages
        this.totalPages = Math.ceil(data._meta.total / 10);
        resolve(data._items);
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
    this.query.search = search;
  }

  setFilter(filter) {
    this.filter = filter;
    this.refresh();
  }

  setQuery(query) {
    this.query = Object.assign({}, query, { search: this.query.search });
    this.refresh();
  }
}

