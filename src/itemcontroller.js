import m from 'mithril';
import { ResourceHandler } from './auth';


export default class ItemController {
  constructor(resource, embedded) {
    this.resource = resource;
    this.id = m.route.param('id');
    if (this.id) {
      this.modus = 'view';
    } else {
      this.modus = 'new';
      this.data = {};
    }
    this.handler = new ResourceHandler(resource, false);
    this.embedded = embedded || {};
    if (this.id) {
      this.handler.getItem(this.id, this.embedded).then((item) => {
        this.data = item;
        m.redraw();
      });
    }
  }

  post(data) {
    return new Promise((resolve, reject) => {
      this.handler.post(data).then((response) => {
        this.id = response._id;
        this.changeModus('view');
      }).catch(reject);
    });
  }

  patch(data) {
    return new Promise((resolve, reject) => {
      this.handler.patch(data).then(() => { this.changeModus('view'); }).catch(reject);
    });
  }

  cancel() {
    if (this.modus === 'edit') this.changeModus('view');
    else m.route.set(`/${this.resource}`);
  }

  changeModus(newModus) {
    this.modus = newModus;
    if (newModus === 'view') {
      // reload item to current state, patches do not return embeddinds...
      this.handler.getItem(this.id, this.embedded).then((item) => {
        this.data = item;
        m.redraw();
      });
    }
  }
}
