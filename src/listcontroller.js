import * as m from 'mithril';
import { ResourceHandler } from './auth';

export default class DatalistController {
  constructor(resource, query = {}, searchKeys = false) {
    this.handler = new ResourceHandler(resource, searchKeys);
    this.query = query;
    this.items = [];
    this.refresh();
  }

  addItem(item) {
    this.items.push(item);
    m.redraw();
  }

  refresh() {
    this.handler.get(this.query).then((data) => {
      this.items = data._items;
      m.redraw();
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

