import Stream from 'mithril/stream';
import { ResourceHandler } from './auth';

export default class DatalistController {
  constructor(resource, query = {}, searchKeys = false) {
    this.handler = new ResourceHandler(resource, searchKeys);
    this.query = query || {};
    this.items = [];
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
    const query = {};
    Object.keys(this.query).forEach((key) => { query[key] = this.query[key]; });
    query.max_results = 5;
    query.page = pageNum;

    return new Promise((resolve, reject) => {
      this.handler.get(query).then((data) => {
        resolve(data._items);
      });
    });
  }

  setSearch(search) {
    this.query.search = search;
    this.refresh();
  }

  setQuery(query) {
    this.query = query;
    this.refresh();
  }
}

