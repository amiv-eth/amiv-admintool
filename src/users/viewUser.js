import m from 'mithril';
import { Card, Toolbar, ToolbarTitle, Button } from 'polythene-mithril';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import SelectList from '../views/selectList';
import { users as config } from '../resourceConfig.json';
import DatalistController from '../listcontroller';

export default class UserView extends ItemView {
  constructor(vnode) {
    super(vnode);
    // a controller to handle the groupmemberships of this user
    this.groupmemberships = new DatalistController('groupmemberships', {
      where: { user: this.data._id },
      embedded: { group: 1 },
    });
    // a controller to handle the eventsignups of this user
    this.eventsignups = new DatalistController('eventsignups', {
      where: { user: this.data._id },
      embedded: { event: 1 },
    });
    // initially, don't display the choice field for a new group
    // (this will be displayed once the user clicks on 'new')
    this.groupchoice = false;
    // a controller to handle the list of possible groups to join
    this.groupcontroller = new DatalistController('groups', {}, ['name']);
    // exclude the groups where the user is already a member
    this.groupmemberships.handler.get({ where: { user: this.id } })
      .then((data) => {
        const groupIds = data._items.map(item => item.group);
        this.groupcontroller.setQuery({
          where: { _id: { $nin: groupIds } },
        });
      });
  }

  oninit() {
    this.groupmemberships.refresh();
  }

  view() {
    let membershipBadge = m('span.label.label-important', 'No Member');
    if (this.data.membership === 'regular') {
      membershipBadge = m('span.label.label-success', 'Member');
    } else if (this.data.membership === 'extraordinary') {
      membershipBadge = m('span.label.label-success', 'Extraordinary Member');
    } else if (this.data.membership === 'honorary') {
      membershipBadge = m('span.label.label-warning', 'Honorary Member');
    }

    const detailKeys = [
      'email', 'phone', 'nethz', 'legi', 'rfid', 'department', 'gender'];

    // Selector that is only displayed if "new" is clicked in the
    // groupmemberships. Selects a group to request membership for.
    const groupSelect = m(SelectList, {
      controller: this.groupcontroller,
      listTileAttrs: data => Object.assign({}, { title: data.name }),
      onSubmit: (group) => {
        this.groupchoice = false;
        this.groupmemberships.handler.post({
          user: this.data._id,
          group: group._id,
        }).then(() => {
          this.groupmemberships.refresh();
        });
      },
    });

    return this.layout([
      m('h1', `${this.data.firstname} ${this.data.lastname}`),
      membershipBadge,
      m('table', detailKeys.map(key => m('tr', [
        m('td.detail-descriptor', config.keyDescriptors[key]),
        m('td', this.data[key] ? this.data[key] : ''),
      ]))),
      m('div.viewcontainer', [
        m('div.viewcontainercolumn', m(Card, {
          style: { height: '300px', 'margin-bottom': '20px' },
          content: m('div', [
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'Event Signups' }),
            ]),
            m(TableView, {
              controller: this.eventsignups,
              keys: ['event.title_de'],
              titles: ['event'],
            }),
          ]),
        })),
        m('div.viewcontainercolumn', m(Card, {
          style: { height: '300px', 'margin-bottom': '10px' },
          content: m('div', [
            this.groupchoice ? groupSelect : '',
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'Group Memberships' }),
              m(Button, {
                className: 'blue-button',
                label: 'add',
                events: { onclick: () => { this.groupchoice = true; } },
              }),
            ]),
            m(TableView, {
              controller: this.groupmemberships,
              keys: ['group.name', 'expiry'],
              titles: ['groupname', 'expiry'],
            }),
          ]),
        })),
      ]),
    ]);
  }
}
