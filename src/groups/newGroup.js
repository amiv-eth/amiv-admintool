import m from 'mithril';
import EditView from '../views/editView';
import { RaisedButton } from 'polythene-mithril';


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
        name: { type: 'text', label: 'Group Name'},
      }),
      submitButton,
    ]);
  }
}
