import m from 'mithril';
import {
  RaisedButton,
  Dialog,
  Button,
  Toolbar,
  IconButton,
  ToolbarTitle,
} from 'polythene-mithril';
import { ResourceHandler } from '../auth';
import { icons } from './elements';


export default class ItemTool {
  constructor(resource, embedded) {
    this.id = m.route.param('id');
    if (this.id) {
      this.modus = 'view';
    } else {
      this.modus = 'new';
    }
    this.handler = new ResourceHandler(resource, false, (newData) => { this.data = newData; });
    this.embedded = embedded || {};
    // by default, we go to the resource list after deletion of an item
    // this may be overwritten with other behaviour
    this.onDelete = () => { console.log('on delete'); m.route.set(`/${resource}`); };
  }

  oninit() {
    if (this.id) {
      this.handler.getItem(this.id, this.embedded).then((item) => {
        this.data = item;
        m.redraw();
      });
    }
  }

  creationView() {
    console.log(`creation for ${this.resource} not found`);
    return null;
  }

  /*
   * Should display this.data
   */
  detailView() {
    console.log(`detail view for ${this.resource} not found`);
    return null;
  }

  /*
   * To edit an existing item. Has to implement this.onSubmit, which is called
   */
  editView() {
    console.log(`edit view for ${this.resource} not found`);
    return null;
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
              this.handler.delete(this.data).then(this.onDelete);
            },
          },
        })],
    });
  }

  view() {
    if (this.modus === 'new') {
      return this.creationView();
    } else if (this.modus === 'edit') {
      return this.editView();
    }
    if (!this.data) return '';
    return m('div', { style: { height: '100%', 'overflow-y': 'scroll' } }, [
      m('div', { style: { display: 'flex' } }, [
        m(RaisedButton, {
          element: 'div',
          label: 'Edit',
          border: true,
          events: { onclick: () => { this.modus = 'edit'; } },
        }),
        m(RaisedButton, {
          className: 'red-row-button',
          label: 'Delete',
          border: true,
          events: { onclick: () => this.delete() },
        }),
      ]),
      this.detailView(),
    ]);
  }
}
