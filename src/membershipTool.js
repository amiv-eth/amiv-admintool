import EditView from './views/editView';
import SelectList from './views/selectList';

const m = require('mithril');

export class MembershipView extends EditView {
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

export class NewMembership {
  constructor() {
    this.selectUser = new SelectList('users', ['firstname', 'lastname'], {
      view(vnode) {
        return m('span', `${vnode.attrs.firstname} ${vnode.attrs.lastname}`);
      },
    });
  }

  view() {
    return m(this.selectUser);
  }
}
