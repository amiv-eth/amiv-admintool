import ItemView from './views/itemView';
import EditView from './views/editView';
import TableView from './views/tableView';
import { inputGroup, selectGroup, submitButton } from './views/elements';
import SelectList from './views/selectList';
import { users as config } from './config.json';
import DatalistController from './listcontroller';
import { ListTile } from 'polythene-mithril';

const m = require('mithril');

class UserView extends ItemView {
  constructor() {
    super('users');
    // a controller to handle the groupmemberships of this user
    this.groupmemberships = new DatalistController('groupmemberships', {
      where: { user: this.id },
      embedded: { group: 1 },
    });
    // a controller to handle the eventsignups of this user
    this.eventsignups = new DatalistController('eventsignups', {
      where: { user: this.id },
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
    this.handler.getItem(this.id, this.embedded).then((item) => {
      this.data = item;
      m.redraw();
    });
    this.groupmemberships.refresh();
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

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

    return m('div', [
      m('h1', `${this.data.firstname} ${this.data.lastname}`),
      membershipBadge,
      m('table', detailKeys.map(key => m('tr', [
        m('td.detail-descriptor', config.keyDescriptors[key]),
        m('td', this.data[key] ? this.data[key] : ''),
      ]))),
      m('h2', 'Memberships'), m('br'),
      this.groupchoice ? groupSelect : '',
      m(TableView, {
        controller: this.groupmemberships,
        keys: ['group.name', 'expiry'],
        titles: ['groupname', 'expiry'],
        onAdd: () => { this.groupchoice = true; },
      }),
      m('h2', 'Signups'), m('br'),
      m(TableView, {
        controller: this.eventsignups,
        keys: ['event.title_de'],
        titles: ['event'],
      }),
    ]);
  }
}

class UserEdit extends EditView {
  constructor(vnode) {
    super(vnode, 'users');
  }

  getForm() {
    return m('form', [
      m('div.row', [
        m(inputGroup, this.bind({
          classes: 'col-xs-6', title: 'Last Name', name: 'lastname',
        })),
        m(inputGroup, this.bind({
          classes: 'col-xs-6', title: 'First Name', name: 'firstname',
        })),
        m(inputGroup, this.bind({ title: 'Email', name: 'email' })),
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'Membership Status',
          name: 'membership',
          options: ['regular', 'extraordinary', 'honory'],
        })),
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'Gender',
          name: 'gender',
          options: ['male', 'female'],
        })),
      ]),
      m('span', JSON.stringify(this.data)),
      m('span', JSON.stringify(this.errors)),
    ]);
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    return m('form', [
      this.getForm(),
      m(submitButton, {
        active: this.valid,
        args: {
          onclick: this.submit('PATCH', config.patchableKeys),
          class: 'btn-warning',
        },
        text: 'Update',
      }),
    ]);
  }
}

export class NewUser extends UserEdit {
  constructor(vnode) {
    super(vnode);
    this.data = {
      gender: 'male',
      membership: 'regular',
    };
    this.valid = false;

    // if the creation is finished, UI should switch to new User
    this.callback = (response) => { m.route.set(`/users/${response.data._id}`); };
  }

  view() {
    return m('form', [
      this.getForm(),
      m(submitButton, {
        active: this.valid,
        args: {
          onclick: this.submit('POST', config.patchableKeys),
          class: 'btn-warning',
        },
        text: 'Create',
      }),
    ]);
  }
}

export class UserModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(UserEdit, { onfinish: () => { this.edit = false; m.redraw(); } });
    }
    // else
    return m('div', [
      m('div.btn.btn-default', { onclick: () => { this.edit = true; } }, 'Edit'),
      m('br'),
      m(UserView),
    ]);
  }
}

export class UserTable {
  constructor() {
    this.ctrl = new DatalistController('users', {}, config.tableKeys);
  }
  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      titles: config.tableKeys.map(key => config.keyDescriptors[key] || key),
      onAdd: () => { m.route.set('/newuser'); },
    });
  }
}
