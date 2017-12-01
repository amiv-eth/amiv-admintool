import { getSession } from '../auth';

const m = require('mithril');

class TableRow {
  // A row in the Table specified below.
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
  /* Shows a table of objects for a given API resource.
   *
   * Required attributes:
   *   - resource: a string of the API resource to display, e.g. 'users'
   *   - keys: Keys of this resource to display as columns, e.g. ['firstname']
   *       Works with embedded resources, i.e. if you add
   *       { embedded: { event: 1 } } to a list of eventsignups,
   *       you can display event.title_de as a table key
   * Addutional attirbutes:
   *   - query: A query object that is valid accoring to
   *       http://python-eve.org/features.html#Filtering
   *       https://docs.mongodb.com/v3.2/reference/operator/query/
   *       e.g. : { where: {name: somename } }
   */
  constructor(vnode) {
    this.items = [];
    this.show_keys = vnode.attrs.keys;
    this.titles = vnode.attrs.titles || this.show_keys;
    this.resource = vnode.attrs.resource;
    // the querystring is either given or will be parsed from the url
    if (vnode.attrs.query) {
      this.query = vnode.attrs.query;
    } else {
      this.query = m.route.param();
    }
  }

  // definitions of query parameters in addition to API go here
  buildQuerystring() {
    const queryKeys = Object.keys(this.query);

    if (queryKeys.length === 0) return '';

    const query = {};

    if ('search' in this.query && this.query.search.length > 0) {
      // translate search into where, we just look if any field contains search
      const searchQuery = {
        $or: this.show_keys.map((key) => {
          const fieldQuery = {};
          fieldQuery[key] = this.query.search;
          return fieldQuery;
        }),
      };

      // if there exists already a where-filter, AND them together
      if ('where' in this.query) {
        query.where = JSON.stringify({ $and: [searchQuery, this.query.where] });
      } else {
        query.where = JSON.stringify(searchQuery);
      }
    } else {
      query.where = JSON.stringify(this.query.where);
    }

    // add all other keys
    queryKeys.filter(key => (key !== 'where' && key !== 'search'))
      .forEach((key) => { query[key] = JSON.stringify(this.query[key]); });

    console.log(query);

    // now we can acutally build the query string
    return `?${m.buildQueryString(query)}`;
  }

  buildList() {
    getSession().then((apiSession) => {
      let url = this.resource;
      if (Object.keys(this.query).length > 0) url += this.buildQuerystring();
      apiSession.get(url).then((response) => {
        this.items = response.data._items;
        console.log(this.items);
        m.redraw();
      }).catch((e) => {
        console.log(e);
      });
    }).catch(() => {
      m.route.set('/login');
    });
  }

  oninit() {
    this.buildList();
  }

  view() {
    return m('div', [
      m('div.row', m('div.col-xs-4.input-group', [
        m('input[name=search].form-control', {
          value: this.query.search,
          onchange: m.withAttr('value', (value) => { this.query.search = value; }),
        }),
        m('span.input-group-btn', m('button.btn.btn-default', {
          onclick: () => { this.buildList(); },
        }, 'Search')),
      ])),
      m('table.table.table-hover', [
        m('thead', m('tr', this.titles.map(title => m('th', title)))),
        m('tbody', this.items.map(item =>
          m(TableRow, { show_keys: this.show_keys, data: item }))),
      ]),
    ]);
  }
}

