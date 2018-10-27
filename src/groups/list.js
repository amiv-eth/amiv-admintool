import m from 'mithril';
import { Card } from 'polythene-mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { loadingScreen } from '../layout';
import { ResourceHandler, getCurrentUser } from '../auth';

class GroupListItem {
  view({ attrs: { name, _id, color = '#ffffff' } }) {
    return m('div', {
      style: { 'max-width': '500px', margin: '5px' },
      onclick: () => {
        m.route.set(`/groups/${_id}`);
      },
    }, m(Card, {
      content: [{ primary: { title: name } }],
      style: { backgroundColor: color },
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
          this.handler.rights.indexOf('POST') > -1 && m('div', {
            style: { 'max-width': '500px', margin: '5px' },
            onclick: () => { m.route.set('/newgroup'); },
          }, m(Card, { content: [{ primary: { title: '+ add' } }] })),
        ]),
      ]),
    ]);
  }
}
