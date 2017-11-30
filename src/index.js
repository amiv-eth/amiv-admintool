import { LoginScreen } from './login';
import TableView from './views/tableView';
import UserModal from './userTool';

const m = require('mithril');

const main = document.createElement('div');
document.body.appendChild(main);
const root = main;


m.route(root, '/users', {
  '/users': {
    view() {
      return m(TableView, {
        resource: 'users',
        keys: ['firstname', 'lastname', 'nethz', 'legi', 'membership'],
      });
    },
  },
  '/users/:id': UserModal,
  '/events': {
    view() {
      return m(TableView, {
        resource: 'events',
        keys: ['title_de', 'time_start', 'show_website', 'spots', 'signup_count'],
      });
    },
  },
  '/groups': {
    view() {
      return m(TableView, {
        resource: 'groups',
        keys: ['name'],
      });
    },
  },
  '/login': LoginScreen,
});
