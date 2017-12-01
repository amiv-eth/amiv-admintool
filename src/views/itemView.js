import { getSession } from '../auth';

const m = require('mithril');

export class ItemView {
  /* Basic class show a data item
   *
   *  Required Arguments:
   *  - call constructor with 'resource'
   *  - either make sure m.route.params('id') exists or set this.id in
   *    constructor
   *
   *  Provides Methods:
   *  - loadItemData: Loads data specified by resource and id into this.data
   *    (is per default called by oninit)
   */
  constructor(resource) {
    this.data = null;
    this.id = m.route.param('id');
    this.resource = resource;
  }

  loadItemData(session) {
    session.get(`${this.resource}/${this.id}`).then((response) => {
      this.data = response.data;
      m.redraw();
    });
  }

  oninit() {
    getSession().then((apiSession) => {
      this.loadItemData(apiSession);
    }).catch(() => {
      m.route.set('/login');
    });
  }
}

export class Title {
  view(vnode) {
    return m('h1', vnode.attrs);
  }
}
