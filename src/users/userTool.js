import m from 'mithril';
import UserEdit from './editUser';
import UserView from './viewUser';
import TableView from '../views/tableView';
import { submitButton } from '../views/elements';
import { users as config } from '../config.json';
import DatalistController from '../listcontroller';

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
