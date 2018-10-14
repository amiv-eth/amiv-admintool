import m from 'mithril';
import { RadioGroup } from 'polythene-mithril';
import EditView from '../views/editView';


export default class UserEdit extends EditView {
  view() {
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
          { value: 'female', label: 'Female', defaultChecked: this.form.data.gender === 'female' },
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
    ]);
  }
}
