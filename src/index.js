import m from 'mithril';
import { OauthRedirect } from './auth';
import GroupList from './groups/list';
import GroupItem from './groups/item';
import { UserModal, UserTable, NewUser } from './users/userTool';
import { MembershipView } from './membershipTool';
import EventTable from './events/table';
import EventItem from './events/item';
import eventDraft from './events/eventDraft';
import eventWithExport from './events/eventWithExport';
import newJob from './jobs/newJob';
import jobTable from './jobs/jobTable';
import jobModal from './jobs/jobModal';
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

m.route.prefix('');
m.route(root, '/users', {
  '/users': layoutWith(UserTable),
  '/users/:id': layoutWith(UserModal),
  '/newuser': layoutWith(NewUser),
  '/groupmemberships/:id': layoutWith(MembershipView),
  '/events': layoutWith(EventTable),
  '/events/:id': layoutWith(EventItem),
  '/newevent': layoutWith(EventItem),
  '/draftevent': layoutWith(eventDraft),
  '/eventwithexport': layoutWith(eventWithExport),
  '/groups': layoutWith(GroupList),
  '/groups/:id': layoutWith(GroupItem),
  '/newgroup': layoutWith(GroupItem),
  '/oauthcallback': OauthRedirect,
  '/joboffers': layoutWith(jobTable),
  '/newjoboffer': layoutWith(newJob),
  '/joboffers/:id': layoutWith(jobModal),
  // '/announce': layoutWith(AnnounceTool),
});

m.route.prefix('');
