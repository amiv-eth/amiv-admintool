import m from 'mithril';
import infinite from 'mithril-infinite';
import { List, ListTile, Toolbar, Search, Button, Icon } from 'polythene-mithril';
import 'polythene-css';
import { styler } from 'polythene-core-css';
import { FilterChip, icons } from './elements';

const tableStyles = [
  {
    '.toolbar': {
      'grid-row': 1,
      display: 'flex',
    },
    '.tableTile': {
      padding: '10px',
      'border-bottom': '1px solid rgba(0, 0, 0, 0.12)',
      'align-items': 'center',
    },
  },
];

styler.add('tableview', tableStyles);

export default class TableView {
  /* Shows a table of objects for a given API resource.
   *
   * Required attributes:
   *   vnode: { attrs: { controller, titles, keys } }
   *   - controller: a listcontroller for some API resource data
   *   - titles: the titles of the table
   *   - keys: Keys of this resource to display as columns, e.g. ['firstname']
   *       Works with embedded resources, i.e. if you add
   *       { embedded: { event: 1 } } to a list of eventsignups,
   *       you can display event.title_de as a table key
   *   - filters: list of list of objects, each inner list is a group of mutual exclusive
   *       filters.
   *       A filter can have properties 'name', 'query' and optionally 'selected' for
   *       the initial selection state.
   */
  constructor({// 62 69 213 220-222
    attrs: {
      keys,
      titles,
      tileContent,
      filters = null,
      clickOnRows = (data) => { m.route.set(`/${data._links.self.href}`); },
      clickOnTitles = (controller, title) => { controller.setSort([[title, 1]]); },
    },
  }) {
    this.search = '';
    this.tableKeys = keys || [];
    this.tableTitles = titles;
    this.tileContent = tileContent;
    this.clickOnRows = clickOnRows;
    this.clickOnTitles = clickOnTitles;
    this.searchValue = '';
    // make a copy of filters so we can toggle the selected status
    this.filters = filters ? filters.map(filterGroup =>
      filterGroup.map(filter => Object.assign({}, filter))) : null;
  }

  /*
   * initFilterIdxs lets you specify the filters that are active at initialization.
   * They are specified as index to the nexted filterGroups array.
   */
  oninit({ attrs: { controller, initFilterIdxs = [] } }) {
    if (this.filters) {
      initFilterIdxs.forEach((filterIdx) => {
        this.filters[filterIdx[0]][filterIdx[1]].selected = true;
      });
      // update filters in controller
      controller.setFilter(this.getSelectedFilterQuery());
    }
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
    return data => m(ListTile, {
      className: 'themed-list-tile',
      hoverable: this.clickOnRows,
      compactFront: true,
      compact: true,
      content: m('div', {
        onclick: () => {
          if (this.clickOnRows) this.clickOnRows(data);
        },
        className: 'tableTile',
        style: { width: '100%', display: 'flex' },
      }, this.tileContent ? this.tileContent(data) : this.getItemData(data)),
    });
  }


  getSelectedFilterQuery() {
    // produce a list of queries from the filters that are currently selected
    const selectedFilters = [].concat(...this.filters.map(filterGroup =>
      filterGroup.filter(filter => filter.selected === true).map(filter => filter.query)));
    // now merge all queries into one new object
    return Object.assign({}, ...selectedFilters);
  }

  arrowOrNot(controller, title) {
    const titleText = title.width ? title.text : title;
    if (!controller.sort) return false;
    let i;
    for (i = 0; i < this.tableTitles.length; i += 1) {
      const tableTitlei = this.tableTitles[i].width ?
        this.tableTitles[i].text : this.tableTitles[i];
      if (tableTitlei === titleText) break;
    }
    return this.tableKeys[i] === controller.sort[0][0];
  }

  view({
    attrs: {
      controller,
      titles,
      onAdd = false,
      tableHeight = false,
    },
  }) {
    return m('div.tabletool', {
      style: {
        display: 'grid',
        height: '100%',
        'grid-template-rows': this.filters ?
          '48px 40px calc(100% - 88px)' : '48px calc(100% - 78px)',
        'background-color': 'white',
      },
    }, [
      m(Toolbar, {
        className: 'toolbar',
        compact: true,
        content: [
          m(Search, {
            textfield: {
              label: 'Search',
              onChange: ({ value }) => {
                // this is called not only if the value changes, but also the focus.
                // we only want to change the search of the value is changed, therefore we
                // have to track changes in the search value
                if (value !== this.searchValue) controller.debouncedSearch(value);
                this.searchValue = value;
              },
            },
            fullWidth: false,
          }),
          onAdd ? m(Button, {
            className: 'blue-button',
            borders: true,
            label: 'Add',
            events: { onclick: () => { onAdd(); } },
          }) : '',
        ],
      }),
      // please beare with this code, it is the only way possible to track the selection
      // status of all the filters of the same group and make sure that they are really
      // mutually exclusive (that way when you click on one filter in the group, the other
      // ones in this group will be deselected)
      this.filters && m('div', {
        style: {
          height: '50px',
          'overflow-x': 'auto',
          'overflow-y': 'hidden',
          'white-space': 'nowrap',
          padding: '0px 5px',
        },
      }, [].concat(['Filters: '], ...[...this.filters.keys()].map(filterGroupIdx =>
        [...this.filters[filterGroupIdx].keys()].map((filterIdx) => {
          const thisFilter = this.filters[filterGroupIdx][filterIdx];
          return m(FilterChip, {
            selected: thisFilter.selected,
            onclick: () => {
              if (!thisFilter.selected) {
                // set all filters in this group to false
                [...this.filters[filterGroupIdx].keys()].forEach((i) => {
                  this.filters[filterGroupIdx][i].selected = false;
                });
                // now set this filter to selected
                this.filters[filterGroupIdx][filterIdx].selected = true;
              } else {
                this.filters[filterGroupIdx][filterIdx].selected = false;
              }
              // update filters in controller
              controller.setFilter(this.getSelectedFilterQuery());
            },
          }, thisFilter.name);
        })))),
      m(List, {
        className: 'scrollTable',
        style: {
          'grid-row': this.filters ? 3 : 2,
          ...tableHeight ? { height: tableHeight } : {},
        },
        tiles: [
          m(ListTile, {
            className: 'tableTile',
            hoverable: this.clickOnTitles,
            content: m(
              'div',
              { style: { width: '100%', display: 'flex' } },
              // Either titles is a list of titles that are distributed equally,
              // or it is a list of objects with text and width
              titles.map((title, i) => m(
                'div', {
                  onclick: () => {
                    if (title.text === 'Files') return;
                    if (this.clickOnTitles) this.clickOnTitles(controller, this.tableKeys[i]);
                  },
                  style: { width: title.width || `${98 / this.tableKeys.length}%` },
                },
                [title.width ? title.text : title,
                  this.arrowOrNot(controller, title) ?
                    m(Icon, { svg: { content: m.trust(icons.sortingArrow) } }) : ''],
              )),
            ),
          }),
          m(infinite, controller.infiniteScrollParams(this.item())),
        ],
      }),
    ]);
  }
}
