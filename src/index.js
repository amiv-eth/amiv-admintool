import m from 'mithril';
import LoginScreen from './login';
import TableView from './views/tableView';
import { UserModal, UserTable, NewUser } from './userTool';
import { MembershipView } from './membershipTool';
import EventTable from './events/table';
import newEvent from './events/newEvent';
import viewEvent from './events/viewEvent';
import eventDraft from './events/eventDraft';
import eventWithExport from './events/eventWithExport';
import Layout from './layout';
import './style';

const root = document.body;


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
  '/newuser': layoutWith(NewUser),
  '/groupmemberships/:id': layoutWith(MembershipView),
  '/events': layoutWith(EventTable),
  '/events/:id': layoutWith(viewEvent),
  '/newevent': layoutWith(newEvent),
  '/draftevent': layoutWith(eventDraft),
  '/eventwithexport': layoutWith(eventWithExport),
  '/groups': layoutWith({
    view() {
      return m(TableView, {
        resource: 'groups',
        keys: ['name'],
      });
    },
  }),
  '/login': LoginScreen,
  // '/announce': layoutWith(AnnounceTool),
});
