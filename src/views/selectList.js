import { submitButton } from './elements';

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
}

export default class SelectList {
  constructor() {
    this.selected = null;
    this.showList = false;
  }

  view({ attrs: { controller, itemView, onSubmit = () => {} } }) {
    // input search and select field
    const updateList = debounce(() => {
      controller.refresh();
    }, 500);

    let input = m('input.form-control', {
      onfocus: () => { this.showList = true; },
      onblur: debounce(() => { this.showList = false; m.redraw(); }, 100),
      onkeyup: (e) => {
        controller.setSearch(e.target.value);
        updateList();
      },
    });
    if (this.selected !== null) {
      input = m('div.btn-group', [
        m('div.btn.btn-default', m(itemView, this.selected)),
        m('div.btn.btn-primary', {
          onclick: () => {
            this.selected = null;
            controller.setSearch('');
            controller.refresh();
          },
        }, m('span.glyphicon.glyphicon-remove-sign')),
      ]);
    }

    // list of items
    const list = m('ul.list-group', controller.items.map(item =>
      m('button.list-group-item', {
        onclick: () => { this.selected = item; this.showList = false; },
      }, m(itemView, item))));

    return m('div', {
    }, [
      m('div.row', [
        m('div.col-xs-6', [
          input,
          m(submitButton, {
            text: 'Submit',
            active: this.selected !== null,
            args: {
              class: 'btn-primary',
              onclick: () => {
                onSubmit(this.selected);
                this.selected = null;
                controller.setSearch('');
                controller.refresh();
              },
            },
          }),
        ]),
      ]),
      this.showList ? list : '',
    ]);
  }
}
