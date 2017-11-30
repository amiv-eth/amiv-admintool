import { ItemView } from './views/itemView';
import { EditView, inputGroup, selectGroup } from './views/editView';
import Table from './views/tableView';

const m = require('mithril');

const keyDescriptors = {
  legi: 'Legi Number',
  firstname: 'First Name',
  lastname: 'Last Name',
  rfid: 'RFID',
  phone: 'Phone',
  nethz: 'nethz Account',
  gender: 'Gender',
  department: 'Department',
  email: 'Email',
};

class UserView extends ItemView {
  constructor() {
    super('users');
    this.memberships = [];
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    let membershipBadge = m('span.label.label-important', 'No Member');
    if (this.data.membership === 'regular') {
      membershipBadge = m('span.label.label-success', 'Member');
    } else if (this.data.membership === 'extraordinary') {
      membershipBadge = m('span.label.label-success', 'Extraordinary Member');
    } else if (this.data.membership === 'honory') {
      membershipBadge = m('span.label.label-warning', 'Honory Member');
    }

    const detailKeys = [
      'email', 'phone', 'nethz', 'legi', 'rfid', 'department', 'gender'];

    return m('div', [
      m('h1', `${this.data.firstname} ${this.data.lastname}`),
      membershipBadge,
      m('table', detailKeys.map(key => m('tr', [
        m('td.detail-descriptor', keyDescriptors[key]),
        m('td', this.data[key] ? this.data[key] : ''),
      ]))),
      m('h2', 'Memberships'), m('br'),
      m(Table, {
        resource: 'groupmemberships',
        keys: ['group.name', 'expiry'],
        querystring: m.buildQueryString({
          where: `user=="${this.id}"`,
          embedded: '{"group":1}',
        }),
      }),
      m('h2', 'Signups'), m('br'),
      m(Table, {
        resource: 'eventsignups',
        keys: ['event.title_de'],
        querystring: m.buildQueryString({
          where: `user=="${this.id}"`,
          embedded: '{"event":1}',
        }),
      }),
    ]);
  }
}

class UserEdit extends EditView {
  constructor(vnode) {
    super(vnode, 'users');
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    // UPDATE button is inactive if form is not valid
    const buttonArgs = this.patchOnClick([
      'lastname', 'firstname', 'email', 'membership', 'gender']);
    const updateButton = m(
      'div.btn.btn-warning',
      this.valid ? buttonArgs : { disabled: 'disabled' },
      'Update',
    );

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
      m('span', JSON.stringify(this.errorLists)),
      updateButton,
    ]);
  }
}

export default class UserModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(UserEdit, { onfinish: () => { this.edit = false; m.redraw(); } });
    }
    // else
    return m('div', [
      m('div.btn', { onclick: () => { this.edit = true; } }, 'Edit'),
      m('br'),
      m(UserView),
    ]);
  }
}
