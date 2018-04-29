import m from 'mithril';
import {
  Button,
  Card,
} from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';

const viewLayout = [
  {
    '.eventViewContainer': {
      display: 'grid',
      'grid-template-columns': '40% 55%',
      'grid-gap': '50px',
    },
    '.propertyLangIndicator': {
      width: '30px',
      height: '20px',
      float: 'left',
      'background-color': 'rgb(031,045,084)',
      'border-radius': '10px',
      'text-align': 'center',
      'line-height': '20px',
      color: 'rgb(255,255,255)',
      'margin-right': '10px',
      'font-size': '11px',
    },
    '.eventViewLeft': {
      'grid-column': 1,
    },
    '.eventViewRight': {
      'grid-column': 2,
    },
    '.eventViewRight h4': {
      'margin-top': '0px',
    },
  },
];
styler.add('eventView', viewLayout);


// Helper class to either display the signed up participants or those on the
// waiting list.
class MembersTable {
  constructor({ attrs: { where } }) {
    this.ctrl = new DatalistController('groupmemberships', {
      embedded: { user: 1 },
      where,
    }, ['email', 'user.firstname', 'user.lastname'], false);
  }

  getItemData(data) {
    // TODO list should not have hardcoded size outside of stylesheet
    return [
      m('div', { style: { width: '9em' } }, data.user.lastname),
      m('div', { style: { width: '9em' } }, data.user.firstname),
      m('div', { style: { width: '9em' } }, data.user.email),
    ];
  }

  view() {
    return m(Card, {
      style: { height: '300px' },
      content: m(TableView, {
        controller: this.ctrl,
        keys: ['user.lastname', 'user.firstname', 'user.email'],
        tileContent: this.getItemData,
        titles: [
          { text: 'Name', width: '9em' },
          { text: 'First Name', width: '9em' },
          { text: 'Email', width: '9em' },
        ],
      }),
    });
  }
}

export default class viewGroup extends ItemView {
  constructor() {
    super('groups');
  }

  oninit() {
    this.handler.getItem(this.id, this.embedded).then((item) => {
      this.data = item;
      m.redraw();
    });
  }

  view({ attrs: { onEdit } }) {
    if (!this.data) return '';

    return m('div', {
      style: { height: '100%', 'overflow-y': 'scroll', padding: '10px' },
    }, [
      m(Button, {
        element: 'div',
        label: 'edit group',
        events: { onclick: onEdit },
      }),
      // this div is the title line
      m('div', [
        // event image if existing
        m('h1', { style: { 'margin-top': '0px', 'margin-bottom': '0px' } }, this.data.name),
      ]),
      m('div', [
        m('h4', 'Members'),
        m(MembersTable, { where: { group: this.id } }),
      ]),
    ]);
  }
}
