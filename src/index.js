import m from 'mithril';
import { OauthRedirect } from './auth';
import GroupList from './groups/list';
import GroupItem from './groups/item';
import { UserItem, UserTable } from './users/userTool';
import { MembershipView } from './membershipTool';
import EventTable from './events/table';
import EventItem from './events/item';
import JobTable from './jobs/table';
import JobItem from './jobs/item';
import { Layout } from './layout';
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
m.route(root, '/events', {
  '/users': layoutWith(UserTable),
  '/users/:id': layoutWith(UserItem),
  '/newuser': layoutWith(UserItem),
  '/groupmemberships/:id': layoutWith(MembershipView),
  '/events': layoutWith(EventTable),
  '/events/:id': layoutWith(EventItem),
  '/newevent': layoutWith(EventItem),
  '/proposeevent': layoutWith(EventItem),
  '/groups': layoutWith(GroupList),
  '/groups/:id': layoutWith(GroupItem),
  '/newgroup': layoutWith(GroupItem),
  '/oauthcallback': OauthRedirect,
  '/joboffers': layoutWith(JobTable),
  '/newjoboffer': layoutWith(JobItem),
  '/joboffers/:id': layoutWith(JobItem),
});
