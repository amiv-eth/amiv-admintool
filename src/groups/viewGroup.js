import m from 'mithril';
import {
  Button,
  Card,
} from 'polythene-mithril';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import SelectList from '../views/selectList';


// Helper class to either display the signed up participants or those on the
// waiting list.
class MembersTable {
  constructor({ attrs: { group } }) {
    this.group_id = group;
    this.ctrl = new DatalistController('groupmemberships', {
      embedded: { user: 1 },
      where: { group },
    }, ['user.email', 'user.firstname', 'user.lastname'], false);
    // true while in the modus of adding a member
    this.addmode = false;
    this.userController = new DatalistController(
      'users', {},
      ['firstname', 'lastname', 'email', 'nethz'],
    );
  }

  itemRow(data) {
    // TODO list should not have hardcoded size outside of stylesheet
    return [
      m('div', { style: { width: '18em' } }, `${data.user.firstname} ${data.user.lastname}`),
      m('div', { style: { width: '9em' } }, data.user.email),
      m('div', { style: { 'flex-grow': '100' } }),
      m('div', m(Button, {
        // Button to remove this groupmembership
        className: 'red-row-button',
        borders: false,
        label: 'remove',
        events: {
          onclick: () => {
            this.ctrl.handler.delete(data).then(() => {
              this.ctrl.refresh();
            });
          },
        },
      })),
    ];
  }

  view() {
    return m(Card, {
      style: { height: '500px' },
      content: m('div', [
        this.addmode ? m(SelectList, {
          controller: this.userController,
          listTileAttrs: user => Object.assign({}, { title: `${user.firstname} ${user.lastname}`}),
          onSubmit: (user) => {
            this.addmode = false;
            this.ctrl.handler.post({
              user: user._id,
              group: this.group_id,
            }).then(() => {
              this.ctrl.refresh();
            });
          },
          onCancel: () => { this.addmode = false; m.redraw(); },
          selectedText: user => `${user.firstname} ${user.lastname}`,
        }) : '',
        m(TableView, {
          controller: this.ctrl,
          keys: ['user.lastname', 'user.firstname', 'user.email'],
          tileContent: data => this.itemRow(data),
          clickOnRows: false,
          onAdd: () => { this.addmode = true; },
          titles: [
            { text: 'Name', width: '18em' },
            { text: 'Email', width: '9em' },
          ],
        }),
      ]),
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
      // this div is the title line
      m('div', [
        // event image if existing
        m('h1', { style: { 'margin-top': '0px', 'margin-bottom': '0px' } }, this.data.name),
      ]),
      m('div', [
        m('h4', 'Members'),
        m(MembersTable, { group: this.id }),
      ]),
    ]);
  }
}
