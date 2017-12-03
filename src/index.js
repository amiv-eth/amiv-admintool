import LoginScreen from './login';
import TableView from './views/tableView';
import { UserModal, UserTable, NewUser } from './userTool';
import { MembershipView } from './membershipTool';
import { EventTable, NewEvent, EventView, EventModal } from './eventTool';
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
  '/events/:id': layoutWith(EventModal),
  '/newevents': layoutWith(NewEvent),
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
