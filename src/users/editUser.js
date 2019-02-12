import m from 'mithril';
import { RadioGroup, TextInput, Form } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import EditView from '../views/editView';

export default class UserEdit extends EditView {
  beforeSubmit() {
    if ('rfid' in this.form.data && !this.form.data.rfid) delete this.form.data.rfid;
    this.submit();
  }

  view() {
    const style = 'display: inline-block; vertical-align: top; padding-right: 80px';
    if (!this.form.schema) return '';
    return this.layout([
      ...this.form.renderSchema(['lastname', 'firstname', 'email', 'nethz']),
      m(TextInput, this.form.bind({
        type: 'password',
        name: 'password',
        label: 'New password',
        floatingLabel: true,
      })),
      ...this.form.renderSchema(['rfid', 'membership']),
      m(
        'div', { style },
        m(RadioGroup, {
          name: 'Sex',
          default: this.form.data.gender,
          values: [
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
          ],
          onchange: (value) => {
            this.form.data.gender = value;
            this.form.validate();
          },
        }),
      ),
      m(
        'div', { style },
        m(RadioGroup, {
          name: 'Departement',
          default: this.form.data.department,
          values: [
            { value: 'itet', label: 'ITET' },
            { value: 'mavt', label: 'MAVT' },
            { value: null, label: 'None' },
          ],
          onchange: (value) => {
            this.form.data.department = value;
            this.form.validate();
          },
        }),
      ),
    ]);
  }
}
