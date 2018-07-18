import m from 'mithril';
import { Card } from 'polythene-mithril';
import DatalistController from '../listcontroller';
import { loadingScreen } from '../layout';


class GroupListItem {
  view({ attrs: { name, _id } }) {
    return m('div', {
      style: { 'max-width': '500px', margin: '5px' },
      onclick: () => {
        m.route.set(`/groups/${_id}`);
      },
    }, m(Card, { content: [{ primary: { title: name } }] }));
  }
}


export default class GroupList {
  constructor() {
    this.ctrl = new DatalistController('groups', {}, ['name']);
    this.data = [];

    this.ctrl.getPageData(1).then((firstPage) => {
      const pages = { 1: firstPage };
      // now fetch all the missing pages
      console.log(this.ctrl.totalPages);
      Array.from(new Array(this.ctrl.totalPages - 1), (x, i) => i + 2).forEach((pageNum) => {
        this.ctrl.getPageData(pageNum).then((newPage) => {
          pages[pageNum] = newPage;
          // collect all the so-far loaded pages in order (sorted keys)
          // and flatten them into 1 array
          this.data = [].concat(...Object.keys(pages).sort().map(key => pages[key]));
          m.redraw();
        });
      });
      // see above
      this.data = [].concat(...Object.keys(pages).sort().map(key => pages[key]));
      m.redraw();
    });
  }

  view() {
    if (!this.data) return m(loadingScreen);

    return m(
      'div.maincontainer', { style: { display: 'flex', 'flex-wrap': 'wrap', 'margin-top': '5px' } },
      this.data.map(item => m(GroupListItem, item)),
      m('div', {
        style: { 'max-width': '500px', margin: '5px' },
        onclick: () => { m.route.set('/newgroup'); },
      }, m(Card, { content: [{ primary: { title: '+ add' } }] })),
    );
  }
}
