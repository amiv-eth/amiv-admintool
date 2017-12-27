import { ResourceHandler } from '../auth';

const m = require('mithril');

class TableRow {
  // A row in the Table specified below.
  view({
    attrs: {
      showKeys,
      data,
    },
  }) {
    return m(
      'tr',
      { onclick() { m.route.set(`/${data._links.self.href}`); } },
      showKeys.map((key) => {
        // Access a nested key, indicated by dot-notation
        let nestedData = data;
        key.split('.').forEach((subKey) => { nestedData = nestedData[subKey]; });
        return m('td', nestedData);
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
  constructor({
    attrs: {
      keys,
      titles,
      resource,
      query = false,
      searchKeys = false,
      onAdd = () => {},
    },
  }) {
    this.items = [];
    this.showKeys = keys;
    this.titles = titles || keys;
    this.handler = new ResourceHandler(resource, searchKeys);
    // the querystring is either given or will be parsed from the url
    this.query = query || m.route.param();
    this.onAdd = onAdd;
  }

  buildList() {
    this.handler.get(this.query).then((data) => {
      this.items = data._items;
      console.log(this.items);
      m.redraw();
    });
  }

  oninit() {
    this.buildList();
  }

  view() {
    return m('div', [
      m('div.row', [
        m('div.col-xs-4', [
          m('div.input-group', [
            m('input[name=search].form-control', {
              value: this.query.search,
              onchange: m.withAttr('value', (value) => { this.query.search = value; }),
            }),
            m('span.input-group-btn', m('button.btn.btn-default', {
              onclick: () => { this.buildList(); },
            }, 'Search')),
          ]),
        ]),
        m('div.col-xs-4', [
          m('div.btn.btn-default', {
            onclick: () => { this.onAdd(); },
          }, 'New'),
        ]),
      ]),
      m('table.table.table-hover', [
        m('thead', m('tr', this.titles.map(title => m('th', title)))),
        m('tbody', this.items.map(item =>
          m(TableRow, { showKeys: this.showKeys, data: item }))),
      ]),
    ]);
  }
}

