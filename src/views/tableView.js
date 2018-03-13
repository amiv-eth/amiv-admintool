import m from 'mithril';
import infinite from 'mithril-infinite';
import { List, ListTile, Toolbar, Search, Button } from 'polythene-mithril';
import 'polythene-css';
import { styler } from 'polythene-core-css';
import { debounce } from '../utils';

const tableStyles = [
  {
    '.tabletool': {
      display: 'grid',
      height: '100%',
      'grid-template-rows': '48px calc(100% - 48px)',
    },
    '.toolbar': {
      'grid-row': 1,
      display: 'flex',
    },
    '.scrollTable': {
      'grid-row': 2,
      'background-color': 'white',
    },
    '.tableTile': {
      padding: '10px',
      'border-bottom': '1px solid rgba(0, 0, 0, 0.12)',
    },
  },
];

styler.add('tableview', tableStyles);

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
  constructor({ attrs: { keys } }) {
    this.search = '';
    this.tableKeys = keys;
  }

  getItemData(data) {
    return this.tableKeys.map((key) => {
      // Access a nested key, indicated by dot-notation
      let nestedData = data;
      key.split('.').forEach((subKey) => { nestedData = nestedData[subKey]; });
      return m(
        'div',
        { style: { width: `${98 / this.tableKeys.length}%` } },
        nestedData,
      );
    });
  }

  item() {
    return (data, opts) => m(ListTile, {
      className: 'themed-list-tile',
      hoverable: true,
      compactFront: true,
      content: m('div', {
        onclick() { m.route.set(`/${data._links.self.href}`); },
        className: 'tableTile',
        style: { width: '100%', display: 'flex' },
      }, this.getItemData(data)),
    });
  }

  view({
    attrs: {
      controller,
      titles,
      onAdd = () => {},
    },
  }) {
    const updateList = debounce(() => {
      controller.refresh();
    }, 500);

    return m('div.tabletool', [
      m(Toolbar, {
        className: 'toolbar',
        compact: true,
        content: [
          m(Search, {
            textfield: {
              label: 'Search',
              onChange: ({ value }) => {
                controller.setSearch(value);
                updateList();
              },
            },
            fullWidth: true,
          }),
          m(Button, {
            className: 'blue-button',
            borders: true,
            label: 'Add',
            events: { onclick: () => { onAdd(); } },
          }),
        ],
      }),
      m(List, {
        className: 'scrollTable',
        tiles: [
          m(ListTile, {
            className: 'tableTile',
            content: m(
              'div',
              { style: { width: '100%', display: 'flex' } },
              titles.map(title => m('div', {
                style: { width: `${98 / this.tableKeys.length}%` },
              }, title)),
            ),
          }),
          m(infinite, controller.infiniteScrollParams(this.item())),
        ],
      }),
    ]);
  }
}

