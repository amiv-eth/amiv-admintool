import { ItemView } from './views/itemView';
import { EditView, inputGroup, selectGroup, submitButton } from './views/editView';
import TableView from './views/tableView';
import { Users as config } from './config.json';

const m = require('mithril');

class UserView extends ItemView {
  constructor() {
    super('users');
    this.memberships = [];
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    let membershipBadge = m('span.label.label-important', 'No Member');
    if (this.data.membership === 'regular') {
      membershipBadge = m('span.label.label-success', 'Member');
    } else if (this.data.membership === 'extraordinary') {
      membershipBadge = m('span.label.label-success', 'Extraordinary Member');
    } else if (this.data.membership === 'honory') {
      membershipBadge = m('span.label.label-warning', 'Honory Member');
    }

    const detailKeys = [
      'email', 'phone', 'nethz', 'legi', 'rfid', 'department', 'gender'];

    return m('div', [
      m('h1', `${this.data.firstname} ${this.data.lastname}`),
      membershipBadge,
      m('table', detailKeys.map(key => m('tr', [
        m('td.detail-descriptor', config.keyDescriptors[key]),
        m('td', this.data[key] ? this.data[key] : ''),
      ]))),
      m('h2', 'Memberships'), m('br'),
      m(TableView, {
        resource: 'groupmemberships',
        keys: ['group.name', 'expiry'],
        query: {
          where: { user: this.id },
          embedded: { group: 1 },
        },
      }),
      m('h2', 'Signups'), m('br'),
      m(TableView, {
        resource: 'eventsignups',
        keys: ['event.title_de'],
        query: {
          where: { user: this.id },
          embedded: { event: 1 },
        },
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
  view() {
    return m(TableView, {
      resource: 'users',
      keys: config.tableKeys,
      titles: config.tableKeys.map(key => config.keyDescriptors[key] || key),
    });
  }
}
