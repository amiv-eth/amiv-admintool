import m from 'mithril';
import { RadioGroup, Button, Dialog } from 'polythene-mithril';
import { Form, textInput } from 'amiv-web-ui-components';
import { apiUrl } from 'networkConfig';
import EditView from '../views/editView';

class passwordField {
  view({ attrs: { form } }) {
    return m(textInput, form.bind({
      type: 'password',
      name: 'password',
      label: 'new password',
      floatingLabel: true,
    }));
  }
}

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

  view() {
    const passwordButton = m(Button, {
      label: 'submit',
      disabled: !this.pw.valid,
      events: {
        onclick: () => {
          this.controller.handler.patch(this.pw.data).then((data) => {
            this.form.data._etag = data._etag;
            Dialog.hide();
          });
        },
      },
    });

    return this.layout([
      ...this.form.renderPage({
        lastname: { type: 'text', label: 'Last Name' },
        firstname: { type: 'text', label: 'First Name' },
        email: { type: 'text', label: 'Email' },
        nethz: { type: 'text', label: 'NETHZ' },
        rfid: { type: 'text', label: 'RFID Code' },
      }),
      m(RadioGroup, {
        name: 'Membership',
        buttons: [
          {
            value: 'none',
            label: 'No Member',
            defaultChecked: this.form.data.membership === 'none',
          },
          {
            value: 'regular',
            label: 'Regular AMIV Member',
            defaultChecked: this.form.data.membership === 'regular',
          },
          {
            value: 'extraordinary',
            label: 'Extraordinary Member',
            defaultChecked: this.form.data.membership === 'extraordinary',
          },
          {
            value: 'honorary',
            label: 'Honorary Member',
            defaultChecked: this.form.data.membership === 'honorary',
          },
        ],
        onChange: ({ value }) => { this.form.data.membership = value; },
      }),
      m(RadioGroup, {
        name: 'Sex',
        buttons: [
          { value: 'female', label: 'Female', defaultChecked: this.data.gender === 'female' },
          { value: 'male', label: 'Male', defaultChecked: this.form.data.gender === 'male' },
        ],
        onChange: ({ value }) => { console.log(value); this.form.data.gender = value; },
      }),
      m(RadioGroup, {
        name: 'Departement',
        buttons: [
          { value: 'itet', label: 'ITET', defaultChecked: this.form.data.department === 'itet' },
          { value: 'mavt', label: 'MAVT', defaultChecked: this.form.data.department === 'mavt' },
        ],
        onChange: ({ value }) => { this.form.data.department = value; },
      }),
      m(Button, {
        label: 'Change Password',
        border: true,
        events: { onclick: () => this.resetpw() },
      }),
    ]);
  }
  resetpw() {
    this.pw.data._id = this.form.data._id;
    this.pw.data._etag = this.form.data._etag;

    Dialog.show({
      body: [
        'Enter the new password.',
        m('div', m(passwordField, { form: this.pw })),
      ],
      backdrop: true,
      footerButtons: [
        m(Button, {
          label: 'Cancel',
          events: {
            onclick: () => {
              Dialog.hide();
            },
          },
        }),
      ],
    });
  }
}
