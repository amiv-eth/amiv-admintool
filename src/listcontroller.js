import Stream from 'mithril/stream';
import { ResourceHandler } from './auth';

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
    // state pointer that is counted up every time the table is refreshed so
    // we can tell infinite scroll that the data-version has changed.
    this.stateCounter = Stream(0);
    this.refresh();
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

    return new Promise((resolve) => {
      this.handler.get(query).then((data) => {
        // If onlineSearch is false, we filter the page-results at the client
        // because the API would not understand the search pattern, e.g. for
        // embedded keys like user.firstname
        if (!this.onlineSearch && this.clientSearchKeys.length > 0 && this.search) {
          const response = [];
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
                if (intermediateObject.includes(this.search)) {
                  response.push(item);
                  // return true to end the search of this object, it is already
                  // matched
                  return true;
                }
              } else if (item[key] && item[key].includes(this.search)) {
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

  setSearch(search) {
    if (this.onlineSearch) {
      this.search = search;
      this.query.search = search;
      this.refresh();
    } else if (this.clientSearchKeys.length > 0) {
      this.search = search;
      this.refresh();
    }
  }

  setQuery(query) {
    this.query = query;
    this.query.search = this.search;
    this.refresh();
  }
}

