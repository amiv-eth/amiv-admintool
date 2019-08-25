import m from 'mithril';
import { Card, Button, ListTile } from 'polythene-mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { loadingScreen } from '../layout';
import { ResourceHandler, getCurrentUser } from '../auth';


class GroupListItem {
  view({ attrs: { name, _id } }) {
    return m(ListTile, {
      title: name,
      hoverable: true,
      rounded: true,
      style: { width: '250px' },
      url: {
        href: `/groups/${_id}`,
        oncreate: m.route.link,
      },
    });
  }
}

class GroupListCard {
  view({ attrs: { title, groups, onAdd = false } }) {
    return m('div.maincontainer', { style: { 'margin-top': '5px' } }, m(Card, {
      content: m('div', [
        m('div', { style: { display: 'flex', 'align-items': 'center' } }, [
          m('div.pe-card__title', title),
          onAdd && m(Button, {
            style: { 'margin-right': '20px' },
            className: 'blue-button',
            extraWide: true,
            label: 'add',
            events: { onclick: () => onAdd() },
          }),
        ]),
        m('div', {
          style: { display: 'flex', 'flex-wrap': 'wrap', margin: '0px 5px 5px 5px' },
        }, groups.map(item => m(GroupListItem, { name: item.name, _id: item._id }))),
      ]),
    }));
  }
}

export default class GroupList {
  constructor() {
    this.handler = new ResourceHandler('groups', ['name']);
    this.ctrl = new DatalistController(
      (query, search) => this.handler.get({ search, ...query }),
      { sort: [['name', 1]] },
    );
    this.groups = [];
    this.moderatedGroups = [];
    this.ctrl.getFullList().then((list) => {
      this.groups = list;
      this.ctrl.setQuery({ where: { moderator: getCurrentUser() } });
      this.ctrl.getFullList().then((moderatedList) => {
        this.moderatedGroups = moderatedList;
        m.redraw();
      });
    });
  }

  view() {
    if (!this.groups) return m(loadingScreen);

    return m('div', [
      // groups moderated by the current user
      this.moderatedGroups.length > 0
      && m(GroupListCard, { title: 'moderated by you', groups: this.moderatedGroups }),
      // all groups
      m(GroupListCard, {
        title: 'all groups',
        groups: this.groups,
        onAdd: () => { m.route.set('/newgroup'); },
      }),
    ]);
  }
}
