import m from 'mithril';
import {
  Button,
  Card,
  Toolbar,
  ToolbarTitle,
  TextField,
  Icon,
} from 'polythene-mithril';
import { DatalistController, ListSelect, DropdownCard, Chip } from 'amiv-web-ui-components';
import { icons, Property } from '../views/elements';
import { colors } from '../style';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import RelationlistController from '../relationlistcontroller';

import { ResourceHandler } from '../auth';


// Helper class to either display the signed up participants or those on the
// waiting list.
class MembersTable {
  constructor({ attrs: { group, hasPatchRights } }) {
    this.group_id = group;
    this.hasPatchRights = hasPatchRights;
    this.ctrl = new RelationlistController({
      primary: 'groupmemberships', secondary: 'users', query: { where: { group } },
    });
    // true while in the modus of adding a member
    this.addmode = false;
    this.userHandler = new ResourceHandler('users');
    this.userController = new DatalistController((query, search) => this.userHandler.get(
      { search, ...query },
    ));
  }

  itemRow(data) {
    // TODO list should not have hardcoded size outside of stylesheet
    return [
      m('div', { style: { width: '18em' } }, `${data.user.firstname} ${data.user.lastname}`),
      m('div', { style: { width: '9em' } }, data.user.email),
      m('div', { style: { 'flex-grow': '100' } }),
      this.hasPatchRights && m('div', m(Button, {
        // Button to remove this groupmembership
        className: 'red-row-button',
        borders: false,
        label: 'remove',
        events: {
          onclick: () => {
            this.ctrl.handler.delete(data).then(() => {
              this.ctrl.refresh();
              m.redraw();
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
        this.addmode ? m(ListSelect, {
          controller: this.userController,
          listTileAttrs: user => Object.assign({}, { title: `${user.firstname} ${user.lastname}` }),
          selectedText: user => `${user.firstname} ${user.lastname}`,
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
        }) : '',
        m(Toolbar, { compact: true }, [
          m(ToolbarTitle, { text: 'Members' }),
          this.hasPatchRights && m(Button, {
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
  constructor({ attrs: { onRemove = false } }) {
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
      this.onRemove && m(Icon, {
        style: { 'margin-left': '3px' },
        svg: { content: m.trust(icons.clear) },
        size: 'small',
        events: {
          onclick: () => { this.onRemove(data); },
        },
      }),
    ]);
  }

  view({ attrs: { list, title, style = {}, onSubmit = false } }) {
    return m(Card, {
      style: { height: '200px', ...style },
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
          m(ToolbarTitle, { text: title }),
          onSubmit && m(Button, {
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
  oninit() {
    // load the number of members in this group
    const handler = new ResourceHandler('groupmemberships');
    handler.get({ where: { group: this.data._id } }).then((memberships) => {
      this.numMembers = memberships._meta.total;
      m.redraw();
    });
  }

  view() {
    // update the reference to the controller data, as this may be refreshed in between
    this.data = this.controller.data;
    const hasPatchRights = this.data._links.self.methods.indexOf('PATCH') > -1;
    const stdMargin = { margin: '5px' };
    return this.layout([
      // this div is the title line
      m('div.maincontainer', [
        m('h1', this.data.name),
        this.data.requires_storage && m(Chip, {
          svg: icons.cloud,
          svgColor: '#ffffff',
          svgBackground: colors.orange,
          ...stdMargin,
        }, 'has a folder on the AMIV Cloud'),
        m('div', { style: { display: 'flex' } }, [
          ('numMembers' in this)
            && m(Property, { title: 'Members', style: stdMargin }, this.numMembers),
          this.data.moderator && m(Property, {
            title: 'Moderator',
            onclick: () => { m.route.set(`/users/${this.data.moderator._id}`); },
            style: stdMargin,
          }, `${this.data.moderator.firstname} ${this.data.moderator.lastname}`),
        ]),
      ]),
      m('div.viewcontainer', [
        // now-column layout: This first column are the members
        m('div.viewcontainercolumn', [
          this.data.permissions ? m(
            DropdownCard,
            { title: 'Permissions', style: { 'margin-bottom': '20px' } },
            Object.keys(this.data.permissions)
              .map(key => m(Property, { title: key }, this.data.permissions[key])),
          ) : '',
          m(MembersTable, { group: this.data._id, hasPatchRights }),
        ]),
        // the second column contains receive_from and forward_to emails
        m('div.viewcontainercolumn', [
          m(EmailTable, {
            list: this.data.receive_from || [],
            title: 'Receiving Email Adresses',
            onSubmit: hasPatchRights ? (newItem) => {
              const oldList = this.data.receive_from || [];
              this.controller.patch({
                _id: this.data._id,
                _etag: this.data._etag,
                receive_from: [...oldList, newItem],
              });
            } : undefined,
            onRemove: hasPatchRights ? (item) => {
              const oldList = this.data.receive_from;
              // remove the first occurence of the given item-string
              const index = oldList.indexOf(item);
              if (index !== -1) {
                oldList.splice(index, 1);
                this.controller.patch({
                  _id: this.data._id,
                  _etag: this.data._etag,
                  receive_from: oldList,
                });
              }
            } : undefined,
          }),
          m(EmailTable, {
            list: this.data.forward_to || [],
            title: 'Forwards to Email Adresses',
            style: { 'margin-top': '10px' },
            onSubmit: hasPatchRights ? (newItem) => {
              const oldList = this.data.forward_to || [];
              this.controller.patch({
                _id: this.data._id,
                _etag: this.data._etag,
                forward_to: [...oldList, newItem],
              });
            } : undefined,
            onRemove: hasPatchRights ? (item) => {
              const oldList = this.data.forward_to;
              // remove the first occurence of the given item-string
              const index = oldList.indexOf(item);
              if (index !== -1) {
                oldList.splice(index, 1);
                this.controller.patch({
                  _id: this.data._id,
                  _etag: this.data._etag,
                  forward_to: oldList,
                });
              }
            } : undefined,
          }),
        ]),
      ]),
    ]);
  }
}
