import { getSession } from '../auth';

const m = require('mithril');

export class ItemView {
  /* Basic class show a data item
   *
   *  Required:
   *  - call constructor with 'resource'
   *  - either make sure m.route.params('id') exists or set this.id in
   *    constructor
   *
   *  Provides Methods:
   *  - loadItemData: Loads data specified by resource and id into this.data
   *    (is per default called by oninit)
   */
  constructor(resource, embedded) {
    this.data = null;
    this.id = m.route.param('id');
    this.resource = resource;
    this.embedded = embedded;
  }

  loadItemData(session) {
    let url = `${this.resource}/${this.id}`;
    if (this.embedded) {
      url += `?${m.buildQueryString({ embedded: JSON.stringify(this.embedded) })}`;
      //url += `?embedded=${JSON.stringify(this.embedded)}`;
    }

    m.request({
      url: `https://amiv-api.ethz.ch/${url}`,
      headers: {
        Authorization: "ZF3D6SxEK1TvmcZ9qEGB/VUTo+8Td3UpyOPZJQ+WzgufoAJpmmirIiUTo84QDdCPtzOUiS47OnoXdpXo1jSGWWACjweLABGinKntKMd8QUQ7ESsYA6F4SQZ3nMr6csAP3EBB1MKKPa12i9lvWCOJlt4SwCkZf6MiExeTXsfNldw8z25bXHkivCaXbdD67mogum19w22rj8dNUdafGA51dp146NVpfhXDNtRFHtsHw0jPVETfbt+mN+0QrgQ0LdI6BdeBQhFPVL2zQuHRR6JmnA1m1dMji5DVFzNCRHDm0l2SZfOqrw9nFtkUegd86KooNrT6xoXrfH7q7jaaeRer7Q=="
      }
    }).then((response) => {
      console.log(response)
    })

    console.log(url);
    session.get(url).then((response) => {
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
