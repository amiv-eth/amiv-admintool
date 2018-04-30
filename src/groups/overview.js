import m from 'mithril';
import { Card } from 'polythene-mithril';
import DatalistController from '../listcontroller';


class GroupItem {
  view({ attrs: { name, _id }}) {
    return m('div', {
      style: {
        padding: '20px',
        'max-width': '500px',
      },
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
      'div', { style: { display: 'flex', 'flex-wrap': 'wrap' } },
      this.data.map(item => m(GroupItem, item)),
      m('div', {
        style: {
          padding: '20px',
          'max-width': '500px',
        },
        onclick: () => { m.route.set('/newgroup'); },
      }, m(Card, { content: [{ primary: { title: '+ add' } }] })),
    );
  }
}
