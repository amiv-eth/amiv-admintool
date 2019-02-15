import m from 'mithril';
import { RadioGroup, TextInput } from 'amiv-web-ui-components';
import EditView from '../views/editView';

export default class UserEdit extends EditView {
  beforeSubmit() {
    if ('rfid' in this.form.data && !this.form.data.rfid) delete this.form.data.rfid;
    this.submit(this.form.data);
  }

  view() {
    if (!this.form.schema) return '';
    return this.layout([
      ...this.form.renderSchema(['lastname', 'firstname', 'email', 'nethz']),
      m(TextInput, this.form.bind({
        type: 'password',
        name: 'password',
        label: 'New password',
        floatingLabel: true,
      })),
      ...this.form.renderSchema(['rfid', 'membership', 'gender', 'department']),
    ]);
  }
}
