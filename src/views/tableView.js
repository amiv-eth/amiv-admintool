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
  constructor() {
    this.search = '';
  }

  view({
    attrs: {
      keys,
      titles,
      controller,
      onAdd = () => {},
    },
  }) {
    return m('div', [
      m('div.row', [
        m('div.col-xs-4', [
          m('div.input-group', [
            m('input[name=search].form-control', {
              value: this.search,
              onchange: m.withAttr('value', (value) => { this.search = value; }),
            }),
            m('span.input-group-btn', m('button.btn.btn-default', {
              onclick: () => { controller.setSearch(this.search); },
            }, 'Search')),
          ]),
        ]),
        m('div.col-xs-4', [
          m('div.btn.btn-default', {
            onclick: () => { onAdd(); },
          }, 'New'),
        ]),
      ]),
      m('table.table.table-hover', [
        m('thead', m('tr', titles.map(title => m('th', title)))),
        m('tbody', controller.items.map(item =>
          m(TableRow, { showKeys: keys, data: item }))),
      ]),
    ]);
  }
}

