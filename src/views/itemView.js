import m from 'mithril';
import { Toolbar, Dialog, Button } from 'polythene-mithril';
import { ButtonCSS } from 'polythene-css';
import { colors } from '../style';
import { loadingScreen } from '../layout';

ButtonCSS.addStyle('.itemView-edit-button', {
  color_light_background: colors.light_blue,
  color_light_text: 'white',
});

ButtonCSS.addStyle('.itemView-delete-button', {
  color_light_text: colors.amiv_red,
  color_light_border: colors.amiv_red,
});

export default class ItemView {
  /* Basic class to show a data item
   *
   *  Required:
   *  - gets attribute 'controller' when rendered
   */
  constructor({ attrs: { controller, onDelete } }) {
    this.controller = controller;
    this.handler = this.controller.handler;
    this.data = this.controller.data;
    this.resource = this.controller.resource;
    if (!onDelete) this.onDelete = () => { m.route.set(`/${controller.resource}`); };
    else this.onDelete = onDelete;
  }

  delete() {
    Dialog.show({
      body: 'Are you sure you want to delete this item?',
      backdrop: true,
      footerButtons: [
        m(Button, {
          label: 'Cancel',
          events: { onclick: () => Dialog.hide() },
        }),
        m(Button, {
          label: 'Delete',
          events: {
            onclick: () => {
              Dialog.hide();
              this.controller.handler.delete(this.data).then(this.onDelete);
            },
          },
        })],
    });
  }

  layout(children) {
    if (!this.controller || !this.controller.data) return m(loadingScreen);
    return m('div', [
      m(Toolbar, m('div.pe-button-row', [
        m(Button, {
          element: 'div',
          className: 'itemView-edit-button',
          label: `Edit ${this.resource.charAt(0).toUpperCase()}${this.resource.slice(1, -1)}`,
          events: { onclick: () => { this.controller.changeModus('edit'); } },
        }),
        m(Button, {
          label: `Delete ${this.resource.charAt(0).toUpperCase()}${this.resource.slice(1, -1)}`,
          className: 'itemView-delete-button',
          border: true,
          events: { onclick: () => this.delete() },
        }),
      ])),
      m('div', {
        style: { height: 'calc(100vh - 130px)', 'overflow-y': 'scroll' },
      }, children),
    ]);
  }
}
