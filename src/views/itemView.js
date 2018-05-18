import m from 'mithril';
import { Dialog, Button, RaisedButton } from 'polythene-mithril';

export default class ItemView {
  /* Basic class to show a data item
   *
   *  Required:
   *  - gets attribute 'controller' when rendered
   */
  constructor({ attrs: { controller, onDelete } }) {
    this.controller = controller;
    this.data = this.controller.data;
    this.handler = this.controller.handler;
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
    if (!this.controller || !this.controller.data) return '';
    return m('div', { style: { height: '100%', 'overflow-y': 'scroll' } }, [
      m('div', { style: { display: 'flex' } }, [
        m(RaisedButton, {
          element: 'div',
          label: 'Edit',
          border: true,
          events: { onclick: () => { this.controller.changeModus('edit'); } },
        }),
        m(RaisedButton, {
          className: 'red-row-button',
          label: 'Delete',
          border: true,
          events: { onclick: () => this.delete() },
        }),
      ]),
      children,
    ]);
  }
}
