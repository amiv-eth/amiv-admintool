import m from 'mithril';
import { Card } from 'polythene-mithril';
import DatalistController from '../listcontroller';


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

    this.ctrl.getPageData(1).then((data) => {
      this.data = data;
      m.redraw();
    });
  }

  view() {
    if (!this.data) return '';

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
