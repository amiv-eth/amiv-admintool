import m from 'mithril';
import EditView from './views/editView';

export default class MembershipView extends EditView {
  constructor(vnode) {
    super(vnode, 'groupmemberships', { user: 1, group: 1 });
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    return m('div', [
      m('h1', `${this.data.user.firstname} ${this.data.user.lastname}`),
      m('br'),
      m('strong', 'is member in'),
      m('br'),
      m('h1', this.data.group.name),
      m('br'),
      m('span', this.data.expiry),
    ]);
  }
}
