import m from 'mithril';
import { RadioGroup, TextInput, Form } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import EditView from '../views/editView';

export default class UserEdit extends EditView {
  constructor(vnode) {
    super(vnode);
    this.pw = new Form();
  }

  oninit() {
    // load schema
    m.request(`${apiUrl}/docs/api-docs`).then((schema) => {
      this.pw.setSchema(JSON.parse(JSON.stringify(schema.definitions.User)));
      this.form.setSchema(schema.definitions.User);
    }).catch((error) => { console.log(error); });
  }

  beforeSubmit() {
    if ('rfid' in this.form.data && !this.form.data.rfid) delete this.form.data.rfid;
    this.submit();
  }

  view() {
    const style = 'display: inline-block; vertical-align: top; padding-right: 80px';
    return this.layout([
      ...this.form.renderPage({
        lastname: { type: 'text', label: 'Last Name' },
        firstname: { type: 'text', label: 'First Name' },
        email: { type: 'text', label: 'Email' },
        nethz: { type: 'text', label: 'NETHZ' },
      }),
      m(TextInput, this.form.bind({
        type: 'password',
        name: 'password',
        label: 'New password',
        floatingLabel: true,
      })),
      ...this.form.renderPage({
        rfid: { type: 'text', label: 'RFID Code' },
      }),
      m(
        'div', { style },
        m(RadioGroup, {
          name: 'Membership',
          default: this.form.data.membership,
          values: [
            {
              value: 'none',
              label: 'No Member',
            },
            {
              value: 'regular',
              label: 'Regular AMIV Member',
            },
            {
              value: 'extraordinary',
              label: 'Extraordinary Member',
            },
            {
              value: 'honorary',
              label: 'Honorary Member',
            },
          ],
          onchange: (value) => {
            this.form.data.membership = value;
            this.form.validate();
          },
        }),
      ),
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
