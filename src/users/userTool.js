import m from 'mithril';
import { DatalistController } from 'amiv-web-ui-components';
import EditUser from './editUser';
import ViewUser from './viewUser';
import TableView from '../views/tableView';
import { users as config } from '../resourceConfig.json';
import ItemController from '../itemcontroller';
import { loadingScreen } from '../layout';
import { ResourceHandler } from '../auth';

export class UserItem {
  constructor() {
    this.controller = new ItemController('users');
  }

  view() {
    if (!this.controller || (!this.controller.data && this.controller.modus !== 'new')) {
      return m(loadingScreen);
    }
    if (this.controller.modus !== 'view') return m(EditUser, { controller: this.controller });
    return m(ViewUser, { controller: this.controller });
  }
}

export class UserTable {
  constructor() {
    this.handler = new ResourceHandler('users');
    this.ctrl = new DatalistController(
      (query, search) => this.handler.get({ search, ...query }),
      { sort: [['lastname', 1]] },
    );
  }
  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      titles: config.tableKeys.map(key => config.keyDescriptors[key] || key),
      filters: [[
        { name: 'not members', query: { membership: 'none' } },
        { name: 'regular members', query: { membership: 'regular' } },
        { name: 'extraordinary members', query: { membership: 'extraordinary' } },
        { name: 'honorary member', query: { membership: 'honorary' } },
      ], [
        { name: 'ITET', query: { department: 'itet' } },
        { name: 'MAVT', query: { department: 'mavt' } },
      ]],
      onAdd: () => { m.route.set('/newuser'); },
    });
  }
}
