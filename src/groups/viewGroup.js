import m from 'mithril';
import {
  Button,
  RaisedButton,
  Card,
  Toolbar,
  ToolbarTitle,
  TextField,
  Icon,
  IconButton
} from 'polythene-mithril';
import { icons, Property } from '../views/elements';
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
          listTileAttrs: user => Object.assign({}, { title: `${user.firstname} ${user.lastname}` }),
          onSubmit: (user) => {
            this.addmode = false;
            this.ctrl.handler.post({
              user: user._id,
              group: this.group_id,
            }).then(() => {
              this.ctrl.refresh();
              m.redraw();
            });
          },
          onCancel: () => { this.addmode = false; m.redraw(); },
          selectedText: user => `${user.firstname} ${user.lastname}`,
        }) : '',
        m(Toolbar, { compact: true }, [
          m(ToolbarTitle, { text: 'Members' }),
          m(Button, {
            className: 'blue-button',
            borders: true,
            label: 'add',
            events: { onclick: () => { this.addmode = true; } },
          }),
        ]),
        m(TableView, {
          tableHeight: '375px',
          controller: this.ctrl,
          keys: ['user.lastname', 'user.firstname', 'user.email'],
          tileContent: data => this.itemRow(data),
          clickOnRows: false,
          titles: [
            { text: 'Name', width: '18em' },
            { text: 'Email', width: '9em' },
          ],
        }),
      ]),
    });
  }
}

// Table for list of email adresses, both forward_to and receive
class EmailTable {
  constructor({ attrs: { onRemove = () => {} } }) {
    this.addmode = false;
    this.dirty = false;
    this.newvalue = '';
    this.onRemove = onRemove;
  }

  item(data) {
    return m('div', {
      style: {
        margin: '10px',
        padding: '5px',
        height: '30px',
        'background-color': '#dddddd',
      },
    }, [
      data,
      m(Icon, {
        style: { 'margin-left': '3px' },
        svg: { content: m.trust(icons.clear) },
        size: 'small',
        events: {
          onclick: () => { this.onRemove(data); },
        },
      }),
    ]);
  }

  view({ attrs: { list, onSubmit = () => {} } }) {
    return m(Card, {
      style: { height: '200px' },
      content: m('div', [
        this.addmode ? m(Toolbar, {
          compact: true,
          style: { background: 'rgb(78, 242, 167)' },
        }, [
          m(TextField, {
            label: 'enter email address',
            type: 'email',
            onChange: ({ value }) => {
              this.dirty = value !== '';
              this.newvalue = value;
            },
          }),
          m(Button, {
            label: this.dirty ? 'Submit' : 'Cancel',
            className: 'blue-button',
            events: {
              onclick: () => {
                if (this.dirty) {
                  onSubmit(this.newvalue);
                  this.addmode = false;
                  this.newvalue = '';
                } else {
                  this.addmode = false;
                }
              },
            },
            value: this.newvalue,
          }),
        ]) : '',
        m(Toolbar, { compact: true }, [
          m(ToolbarTitle, { text: 'Receiving Email Adresses' }),
          m(Button, {
            className: 'blue-button',
            borders: true,
            label: 'add',
            events: { onclick: () => { this.addmode = true; } },
          }),
        ]),
        m('div', {
          style: { padding: '10px', display: 'flex', 'flex-wrap': 'wrap' },
        }, list.map(item => this.item(item))),
      ]),
    });
  }
}

export default class viewGroup extends ItemView {
  view() {
    return this.layout([
      // this div is the title line
      m('div.maincontainer', [
        m('h1', { style: { 'margin-top': '0px', 'margin-bottom': '0px' } }, this.data.name),
        this.data.moderator ? m(Property, {
          title: 'Moderator',
          onclick: () => { m.route.set(`/users/${this.data.moderator._id}`); },
        }, `${this.data.moderator.firstname} ${this.data.moderator.lastname}`) : '',
        this.data.requires_storage ? m(IconButton, {
          label: 'has a folder on the AMIV Cloud',
          style: { color: '#ffffff', backgroundColor: 'orange' },
          icon: { svg: { content: m.trust(icons.cloud) } },
          inactive: true,
          compact: true,
        }): '',
      ]),
      m('div.viewcontainer', [
        // now-column layout: This first column are the members
        m('div.viewcontainercolumn', m(MembersTable, { group: this.data._id })),
        // the second column contains receive_from and forward_to emails
        m('div.viewcontainercolumn', [
          m(EmailTable, {
            list: this.data.receive_from || [],
            onSubmit: (newItem) => {
              const oldList = this.data.receive_from || [];
              this.handler.patch({
                _id: this.data._id,
                _etag: this.data._etag,
                receive_from: [...oldList, newItem],
              });
            },
            onRemove: (item) => {
              const oldList = this.data.receive_from;
              // remove the first occurence of the given item-string
              const index = oldList.indexOf(item);
              if (index !== -1) {
                oldList.splice(index, 1);
                this.handler.patch({
                  _id: this.data._id,
                  _etag: this.data._etag,
                  receive_from: oldList,
                }).then(() => m.redraw());
              }
            },
          }),
        ]),
      ]),
    ]);
  }
}
