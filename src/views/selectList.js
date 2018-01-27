import { submitButton } from './elements';
import { debounce } from '../utils';

const m = require('mithril');

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
