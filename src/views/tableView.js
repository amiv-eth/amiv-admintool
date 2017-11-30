import { getSession } from '../auth';

const m = require('mithril');

class TableRow {
  view(vnode) {
    return m(
      'tr',
      { onclick() { m.route.set(`/${vnode.attrs.data._links.self.href}`); } },
      vnode.attrs.show_keys.map((key) => {
        // Access a nested key, indicated by dot-notation
        let data = vnode.attrs.data;
        key.split('.').forEach((subKey) => { data = data[subKey]; });
        return m('td', data);
      }),
    );
  }
}

export default class TableView {
  constructor(vnode) {
    this.items = [];
    this.show_keys = vnode.attrs.keys;
    this.titles = vnode.attrs.titles || this.show_keys;
    this.resource = vnode.attrs.resource;
    // the querystring is either given or will be parsed from the url
    if (vnode.attrs.querystring) {
      this.querystring = vnode.attrs.querystring;
    } else {
      this.querystring = m.buildQueryString(m.route.param());
    }
  }

  oninit() {
    getSession().then((apiSession) => {
      let url = this.resource;
      if (this.querystring.length > 0) url += `?${this.querystring}`;
      apiSession.get(url).then((response) => {
        this.items = response.data._items;
        console.log(this.items);
        m.redraw();
      });
    }).catch(() => {
      m.route.set('/login');
    });
  }

  view() {
    return m('div', [
      m('table.table.table-hover', [
        m('thead', m('tr', this.titles.map(title => m('th', title)))),
        m('tbody', this.items.map(item =>
          m(TableRow, { show_keys: this.show_keys, data: item }))),
      ]),
    ]);
  }
}

