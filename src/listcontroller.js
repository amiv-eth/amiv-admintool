import m from 'mithril';
import Stream from 'mithril/stream';
import { ResourceHandler } from './auth';
import { debounce } from './utils';

export default class DatalistController {
  constructor(resource, query = {}, searchKeys = false, onlineSearch = true) {
    this.onlineSearch = onlineSearch;
    if (onlineSearch) {
      this.handler = new ResourceHandler(resource, searchKeys);
    } else {
      this.handler = new ResourceHandler(resource, false);
      this.clientSearchKeys = searchKeys || [];
    }
    this.query = query || {};
    this.search = null;
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

    return new Promise((resolve) => {
      this.handler.get(query).then((data) => {
        // update total number of pages
        this.totalPages = Math.ceil(data._meta.total / 10);
        // If onlineSearch is false, we filter the page-results at the client
        // because the API would not understand the search pattern, e.g. for
        // embedded keys like user.firstname
        if (!this.onlineSearch && this.clientSearchKeys.length > 0 && this.search) {
          const response = [];
          const searchRegex = new RegExp(this.search, 'i');
          // We go through all response items and will add them to response if
          // they match the query.
          data._items.forEach((item) => {
            // Try every search Key seperately, such that any match with any
            // key is sufficient
            this.clientSearchKeys.some((key) => {
              if (key.match(/.*\..*/)) {
                // traverse the key, this is a key pointing to a sub-object
                let intermediateObject = Object.assign({}, item);
                key.split('.').forEach((subKey) => {
                  intermediateObject = intermediateObject[subKey];
                });
                if (intermediateObject.match(searchRegex)) {
                  response.push(item);
                  // return true to end the search of this object, it is already
                  // matched
                  return true;
                }
              } else if (item[key] && item[key].match(searchRegex)) {
                response.push(item);
                // return true to end the search of this object, it is already
                // matched
                return true;
              }
              return false;
            });
          });
          resolve(response);
        } else {
          resolve(data._items);
        }
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
    if (this.onlineSearch) {
      this.search = search;
      this.query.search = search;
    } else if (this.clientSearchKeys.length > 0) {
      this.search = search;
    }
  }

  setFilter(filter) {
    this.filter = filter;
    this.refresh();
  }

  setQuery(query) {
    this.query = query;
    this.query.search = this.search;
    this.refresh();
  }
}

