import m from 'mithril';
import { Card, Button } from 'polythene-mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { styler } from 'polythene-core-css';
import { loadingScreen } from '../layout';
import { ResourceHandler, getCurrentUser } from '../auth';


styler.add('groups', [{
  '.grouplistitem': {
    width: '250px',
    height: '50px',
    padding: '10px',
    margin: '0px 5px',
    'font-size': '18px',
    'line-height': '30px',
    'flex-grow': 1,
  },
  '.grouplistitem:hover': {
    backgroundColor: '#eeeeee',
    cursor: 'pointer',
  },
}]);

class GroupListCard {
  view({ attrs: { title, groups, onAdd = false } }) {
    return m('div.maincontainer', { style: { 'margin-top': '5px' } }, m(Card, {
      content: m('div', [
        m('div', { style: { display: 'flex', 'align-items': 'center' } }, [
          m('div.pe-card__title', title),
          onAdd && m(Button, {
            style: { 'margin-right': '20px' },
            className: 'blue-button',
            label: 'add',
            events: { onclick: () => onAdd() },
          }),
        ]),
        m('div', {
          style: { display: 'flex', 'flex-wrap': 'wrap', 'margin-bottom': '5px' },
        }, groups.map(item => m('div.grouplistitem', {
          onclick: () => { m.route.set(`/groups/${item._id}`); },
        }, item.name))),
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
<<<<<<< HEAD
      // groups moderated by the current user
      this.moderatedGroups.length > 0 &&
        m(GroupListCard, { title: 'moderated by you', groups: this.moderatedGroups }),
      // all groups
      m(GroupListCard, {
        title: 'all groups',
        groups: this.groups,
        onAdd: this.handler.rights.indexOf('POST') > -1 ?
          () => { m.route.set('/newgroup'); } : undefined,
      }),
=======
      this.moderatedGroups.length > 0 && m('div.maincontainer', {
        style: {
          'margin-top': '5px',
          'border-bottom': '1px solid #aaaaaa',
          'padding-bottom': '20px',
        },
      }, [
        m('div', {
          style: {
            'font-size': '20px',
            margin: '10px 5px',
          },
        }, 'moderated by you'),
        m('div', {
          style: { display: 'flex', 'flex-wrap': 'wrap' },
        }, this.moderatedGroups.map(item =>
          m(GroupListItem, { ...item }))),
      ]),
      m('div.maincontainer', {
        style: { display: 'flex', 'flex-wrap': 'wrap', 'margin-top': '5px' },
      }, [
        this.moderatedGroups.length > 0 && m('div', {
          style: {
            'font-size': '20px',
            margin: '10px 5px',
          },
        }, 'all groups'),
        m('div', {
          style: { display: 'flex', 'flex-wrap': 'wrap' },
        }, [
          this.groups.map(item => m(GroupListItem, item)),
          && m('div', {
            style: { 'max-width': '500px', margin: '5px' },
            onclick: () => { m.route.set('/newgroup'); },
          }, m(Card, { content: [{ primary: { title: '+ add' } }] })),
        ]),
      ]),
>>>>>>> master
    ]);
  }
}
