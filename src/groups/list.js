import m from 'mithril';
import { Card } from 'polythene-mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { styler } from 'polythene-core-css';
import { loadingScreen } from '../layout';
import { ResourceHandler, getCurrentUser } from '../auth';


class GroupListItem {
  view({ attrs: { name, _id, color = '#ffffff' } }) {
    return m('div', {
      style: { 'width': '250px', margin: '10px' },
      onclick: () => {
        m.route.set(`/groups/${_id}`);
      },
    }, m(Card, {
      content: [{ primary: { title: name } }],
      style: { backgroundColor: color },
    }));
  }
}


const style = [
  {
    '.grouplistitem': {
      width: '250px',
      height: '50px',
      padding: '10px',
      'margin-left': '7px',
      'font-size': '18px',
      // border: '1px solid black',
    },
    '.grouplistitem:hover': {
      backgroundColor: '#eeeeee',
      cursor: 'pointer',
    },
  },
];
styler.add('groups', style);


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
    console.log('test 42');
    return m('div', [ // maindiv, list of 'moderated', 'all' & 'add'
      // test for 'moderated'
      this.moderatedGroups.length > 0 && m('div.maincontainer', {
        style: { 'margin-top': '5px' },
      },
      // moderated card
      m(Card, {
        content: m('div', [
          m('div.pe-card__title', 'moderated by you'),
          m('div', {
            style: { display: 'flex', 'flex-wrap': 'wrap' },
          }, this.moderatedGroups.map(item => m('div.grouplistitem', item.name))),
        ]),
      }),
      ),
      // test 'all groups'
      this.moderatedGroups.length > 0 && m('div.maincontainer', {
        style: { 'margin-top': '5px' },
      }, [

        // ''all' cards
        m(Card, {
          content: m('div', [
            m('div.pe-card__title', 'all groups'),
            m('div', {
              style: { display: 'flex', 'flex-wrap': 'wrap' },
            }, this.groups.map(item => m('div.grouplistitem', item.name))),
          ]),
        }),
      ]),
      // add button
      m('div', {
        style: { width: '100px', margin: '5px' },
        onclick: () => { m.route.set('/newgroup'); },
      }, m(Card, { content: [{ primary: { title: '+ add' } }] })),

    ]);
  }
}
