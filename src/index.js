import m from 'mithril';
import { OauthRedirect } from './auth';
import GroupList from './groups/overview';
import GroupView from './groups/groupTool';
import { UserModal, UserTable, NewUser } from './users/userTool';
import { MembershipView } from './membershipTool';
import NewGroup from './groups/newGroup';
import EventTable from './events/table';
import newEvent from './events/newEvent';
import EventModal from './events/eventModal';
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
  '/events/:id': layoutWith(EventModal),
  '/newevent': layoutWith(newEvent),
  '/draftevent': layoutWith(eventDraft),
  '/eventwithexport': layoutWith(eventWithExport),
  '/groups': layoutWith(GroupList),
  '/groups/:id': layoutWith(GroupView),
  '/newgroup': layoutWith(NewGroup),
  '/oauthcallback': OauthRedirect,
  '/jobs': layoutWith(jobTable),
  '/newjob': layoutWith(newJob),
  '/jobs/:id': layoutWith(jobModal),
  // '/announce': layoutWith(AnnounceTool),
});

m.route.prefix('');
