import LoginScreen from './login';
import TableView from './views/tableView';
import { UserModal, UserTable, NewUser } from './userTool';
<<<<<<< HEAD
import { MembershipView } from './membershipTool';
=======
import { EventTable, NewEvent } from './eventTool';
>>>>>>> Testing small eventTool.
import Sidebar from './sidebar';
import AnnounceTool from './announceTool';

const m = require('mithril');

const main = document.createElement('div');
document.body.appendChild(main);
const root = main;


class Layout {
  view(vnode) {
    return m('div.wrapper-main.smooth', [
      m(Sidebar),
      m('div.navbar.navbar-defailt.navbar-main'),
      m('div.wrapper-content', vnode.children),
    ]);
  }
}

function layoutWith(view) {
  return {
    view() {
      return m(Layout, m(view));
    },
  };
}

m.route(root, '/users', {
  '/users': layoutWith(UserTable),
  '/users/:id': layoutWith(UserModal),
  '/newusers': layoutWith(NewUser),
  '/groupmemberships/:id': layoutWith(MembershipView),
  '/events': layoutWith(EventTable),
  '/newevents': layoutWith(NewEvent),
    view() {
      return m(TableView, {
        resource: 'events',
        keys: ['title_de', 'time_start', 'show_website', 'spots', 'signup_count'],
      });
    },
  }),
  '/groups': layoutWith({
    view() {
      return m(TableView, {
        resource: 'groups',
        keys: ['name'],
      });
    },
  }),
  '/login': LoginScreen,
  '/announce': layoutWith(AnnounceTool),
});
