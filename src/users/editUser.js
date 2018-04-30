import m from 'mithril';
import EditView from '../views/editView';
import { inputGroup, selectGroup, submitButton } from '../views/elements';
import { users as config } from '../config.json';


export default class UserEdit extends EditView {
  constructor(vnode) {
    super(vnode, 'users');
  }

  getForm() {
    return m('form', [
      m('div.row', [
        m(inputGroup, this.bind({
          classes: 'col-xs-6', title: 'Last Name', name: 'lastname',
        })),
        m(inputGroup, this.bind({
          classes: 'col-xs-6', title: 'First Name', name: 'firstname',
        })),
        m(inputGroup, this.bind({ title: 'Email', name: 'email' })),
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'Membership Status',
          name: 'membership',
          options: ['regular', 'extraordinary', 'honory'],
        })),
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'Gender',
          name: 'gender',
          options: ['male', 'female'],
        })),
      ]),
      m('span', JSON.stringify(this.data)),
      m('span', JSON.stringify(this.errors)),
    ]);
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    return m('form', [
      this.getForm(),
      m(submitButton, {
        active: this.valid,
        args: {
          onclick: this.submit('PATCH', config.patchableKeys),
          class: 'btn-warning',
        },
        text: 'Update',
      }),
    ]);
  }
}