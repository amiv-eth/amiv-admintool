import m from 'mithril';
import { RadioGroup } from 'polythene-mithril';
import EditView from '../views/editView';


export default class UserEdit extends EditView {
  view() {
    return this.layout([
      ...this.renderPage({
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
            value: 'regular',
            label: 'Regular AMIV Member',
            defaultChecked: this.data.membership === 'regular',
          },
          {
            value: 'extraordinary',
            label: 'Extraordinary Member',
            defaultChecked: this.data.membership === 'extraordinary',
          },
          {
            value: 'honory',
            label: 'Honorary Member',
            defaultChecked: this.data.membership === 'honory',
          },
        ],
        onChange: ({ value }) => { this.data.membership = value; },
      }),
      m(RadioGroup, {
        name: 'Sex',
        buttons: [
          { value: 'female', label: 'Female', defaultChecked: this.data.gender === 'female' },
          { value: 'male', label: 'Male', defaultChecked: this.data.gender === 'male' },
        ],
        onChange: ({ value }) => { console.log(value); this.data.gender = value; },
      }),
      m(RadioGroup, {
        name: 'Departement',
        buttons: [
          { value: 'itet', label: 'ITET', defaultChecked: this.data.department === 'itet' },
          { value: 'mavt', label: 'MAVT', defaultChecked: this.data.department === 'mavt' },
        ],
        onChange: ({ value }) => { this.data.department = value; },
      }),
    ]);
  }
}
