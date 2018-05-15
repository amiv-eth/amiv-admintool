import m from 'mithril';
import { ResourceHandler } from '../auth';
import { Dialog, Button } from 'polythene-mithril';

export default class ItemView {
  /* Basic class to show a data item
   *
   *  Required:
   *  - call constructor with 'resource'
   *  - either make sure m.route.params('id') exists or set this.id in
   *    constructor
   */
  constructor(resource, embedded) {
    this.data = null;
    this.id = m.route.param('id');
    this.handler = new ResourceHandler(resource);
    this.embedded = embedded || {};
  }

  oninit() {
    this.handler.getItem(this.id, this.embedded).then((item) => {
      this.data = item;
      m.redraw();
    });
  }
}
