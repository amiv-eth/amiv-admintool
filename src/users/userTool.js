import m from 'mithril';
import EditUser from './editUser';
import ViewUser from './viewUser';
import TableView from '../views/tableView';
import { users as config } from '../resourceConfig.json';
import DatalistController from '../listcontroller';
import ItemController from '../itemcontroller'

export class UserItem {
  constructor() {
    this.controller = new ItemController('users');
  }

  view() {
    if (!this.controller || !this.controller.data) return '';
    if (this.controller.modus !== 'view') return m(EditUser, { controller: this.controller });
    return m(ViewUser, { controller: this.controller });
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
