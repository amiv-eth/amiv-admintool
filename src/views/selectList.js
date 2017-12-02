import TableView from './tableView';

const m = require('mithril');

// as taken from underscore:
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export default class SelectList extends TableView {
  constructor(resource, searchKeys, itemView) {
    super({ attrs: { resource, keys: searchKeys } });
    this.itemView = itemView;
    this.selected = null;
    this.showList = false;
  }

  view() {
    // input search and select field
    const updateList = debounce(() => {
      this.buildList();
    }, 500);

    let input = m('input.form-control', {
      onfocus: () => { this.showList = true; },
      onblur: debounce(() => { this.showList = false; m.redraw(); }, 100),
      onkeyup: (e) => {
        this.query.search = e.target.value;
        updateList();
      },
    });
    if (this.selected !== null) {
      input = m('div.btn-group', [
        m('div.btn.btn-default', m(this.itemView, this.selected)),
        m('div.btn.btn-primary', {
          onclick: () => {
            this.selected = null;
            this.query = {};
            this.buildList();
          },
        }, m('span.glyphicon.glyphicon-remove-sign')),
      ]);
    }

    // list of items
    const list = m('ul.list-group', this.items.map(item =>
      m('button.list-group-item', {
        onclick: () => { this.selected = item; this.showList = false; },
      }, m(this.itemView, item))));

    return m('div', {
    }, [
      m('div.row', m('div.col-xs-6', input)),
      this.showList ? list : '',
    ]);
  }
}
