import m from 'mithril';
import { RaisedButton } from 'polythene-mithril';
import EditView from '../views/editView';


export default class NewGroup extends EditView {
  constructor(vnode) {
    super(vnode, 'groups', {});
    this.callback = () => { m.route.set('/groups'); };
  }

  view() {
    const submitButton = m(RaisedButton, {
      disabled: !this.valid,
      label: 'Submit',
      events: { onclick: () => { this.submit(); } },
    });

    return m('div.mywrapper', [
      m('h3', 'Add a New Group'),
      ...this.renderPage({
        name: { type: 'text', label: 'Group Name' },
        allow_self_enrollment: {
          type: 'checkbox',
          label: 'the group can be seen by all users and they can subscribe themselves',
        },
      }),
      m('br'),
      submitButton,
    ]);
  }
}
