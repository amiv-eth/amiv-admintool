import m from 'mithril';
import { Card } from 'polythene-mithril';
import { DatalistController } from 'amiv-web-ui-components';
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
    this.ctrl = new DatalistController('groups', { sort: [['name', 1]] }, ['name']);
    this.data = [];
    this.ctrl.getFullList().then((list) => { this.data = list; m.redraw(); });
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
