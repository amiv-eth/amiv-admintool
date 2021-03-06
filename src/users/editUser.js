import m from 'mithril';
import { TextInput } from 'amiv-web-ui-components';
import EditView from '../views/editView';

export default class UserEdit extends EditView {
  beforeSubmit() {
    if ('rfid' in this.form.data && !this.form.data.rfid) delete this.form.data.rfid;
    this.submit(this.form.data).then(() => this.controller.changeModus('view'));
  }

  view() {
    return this.layout([
      ...this.form.renderSchema(['lastname', 'firstname', 'email', 'phone', 'nethz', 'legi']),
      m(TextInput, this.form.bind({
        type: 'password',
        name: 'password',
        label: 'New password',
        floatingLabel: true,
      })),
      ...this.form.renderSchema(['rfid', 'send_newsletter', 'membership', 'gender', 'department']),
    ]);
  }
}
