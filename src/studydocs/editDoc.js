import m from 'mithril';
import { RadioGroup } from 'polythene-mithril';
import EditView from '../views/editView';


export default class editDoc extends EditView {
  view() {
    return this.layout([
      m('h3', 'Add a New Studydocument'),
      ...this.form.renderPage({
        // uploader
        author: { type: 'text', label: 'Author' },
        files: { type: 'text', label: 'File' }, // buggy only singel file possible
        lecture: { type: 'text', label: 'Lecture' },
        title: { type: 'text', label: 'Title' },
        professor: { type: 'text', label: 'Professor' },
        course_year: { type: 'number', lable: 'Year' }, // semester unterscheidung, plausibility
      }),
      // department //drop-down-list
      m('div', 'Semester'), // formatieren
      m(RadioGroup, {
        name: 'semester',
        buttons: [
          { value: '1', label: '1.', defaultChecked: this.form.data.gender === '1' },
          { value: '2', label: '2', defaultChecked: this.form.data.gender === '2' },
          { value: '3', label: '3', defaultChecked: this.form.data.gender === '3' },
          { value: '4', label: '4', defaultChecked: this.form.data.gender === '4' },
          { value: '5', label: '5+', defaultChecked: this.form.data.gender === '5' },
        ],
        onChange: ({ value }) => { console.log(value); this.form.data.gender = value; },
      }),
      m(RadioGroup, {
        name: 'type',
        buttons: [{
          value: 'exames',
          label: 'exames',
          defaultChecked: this.form.data.gender === 'exames',
        }, {
          value: 'cheat_sheet',
          label: 'cheat sheet',
          defaultChecked: this.form.data.gender === 'cheat_sheet',
        }, {
          value: 'lecture_documents',
          label: 'lecture documents',
          defaultChecked: this.form.data.gender === 'lecture_documents',
        }, {
          value: 'exercise',
          label: 'exercise',
          defaultChecked: this.form.data.gender === 'exercise',
        }],
        onChange: ({ value }) => { console.log(value); this.form.data.gender = value; },
      }),

    ]);
  }
}
