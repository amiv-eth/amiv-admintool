import m from 'mithril';
import { fileInput } from 'amiv-web-ui-components';
import { RadioGroup, Button, List, ListTile } from 'polythene-mithril';
import EditView from '../views/editView';


export default class editDoc extends EditView {
  // constructoe^r zu file upload
  constructor(vnode) {
    super(vnode);
<<<<<<< HEAD
    if (!('files' in this.form.data)) {
      this.form.data.files = [{ name: 'add file' }];
    }
=======
    console.log(this.form.data.files);
>>>>>>> d5c9d3ccc17b1e4a034a733d91485388f298b581
  }

  view() {
    console.log(this.form.data.files);

    return this.layout([
      m('h3', 'Add a New Studydocument'),

      // department //drop-down-list
      // lable for RadioGroup: semester
      m('div', { style: { color: '#0006', 'font-size': '16px' } }, 'Semester'),
      m(RadioGroup, {
        name: 'semester',
        buttons: [
          { value: '1', label: '1.', defaultChecked: this.form.data.gender === '1' },
          { value: '2', label: '2', defaultChecked: this.form.data.gender === '2' },
          { value: '3', label: '3', defaultChecked: this.form.data.gender === '3' },
          { value: '4', label: '4', defaultChecked: this.form.data.gender === '4' },
          { value: '5', label: '5+', defaultChecked: this.form.data.gender === '5' },
        ],
        onChange: ({ value }) => { console.log(value); this.form.data.semester = value; },
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
      ...this.form.renderPage({
        lecture: { type: 'text', label: 'Lecture' },
        title: { type: 'text', label: 'Title' },
        course_year: { type: 'number', label: 'Year' },
        professor: { type: 'text', label: 'Professor' },
        author: { type: 'text', label: 'Author' },
      }),
      // file upload: unfinished
      m('div', [
        m(List, {
          tiles: this.form.data.files.map(file => m(ListTile, {
            content: [
              m(fileInput, this.form.bind({
                name: 'new_file',
                label: `${file.name}`,
              })),
            ],
          })),
        }),


        // additional file
        m(Button, {
          label: 'Additional File',
          className: 'blue-button',
          border: true,
          // onclick to be enabled
<<<<<<< HEAD
          events: { onclick: () => { this.form.data.files.push({ name: 'add file' }); } },
=======
          events: { onclick: () => { onAdd(); } },
>>>>>>> d5c9d3ccc17b1e4a034a733d91485388f298b581

        }),
      ]),
    ]);
  }
}
