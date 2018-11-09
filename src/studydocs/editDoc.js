import m from 'mithril';
import { FileInput } from 'amiv-web-ui-components';
import { RadioGroup, Button, List, ListTile, Snackbar } from 'polythene-mithril';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import EditView from '../views/editView';


export default class editDoc extends EditView {
  // constructoe^r zu file upload
  constructor(vnode) {
    super(vnode);
    if (!('files' in this.form.data)) {
      this.form.data.files = [{ name: 'add file' }];
    }
  }

  oninit() {
    // load schema
    m.request(`${apiUrl}/docs/api-docs`).then((schema) => {
      // remove the files list as it is impossible to validate
      const docSchema = schema.definitions.Studydocument;
      delete docSchema.properties.files;
      this.form.setSchema(docSchema);
    }).catch((error) => { console.log(error); });
  }

  beforeSubmit() {
    // check if there are files uploaded
    const files = [];
    Object.keys(this.form.data).forEach((key) => {
      if (key.startsWith('new_file_') && this.form.data[key]) {
        files.push(this.form.data[key]);
        delete this.form.data[key];
      }
    });
    // in case that there are no files, eject an error
    if (this.controller.modus === 'new' && files.length === 0) {
      Snackbar.show({ title: 'You need to upload at least one file.' });
      this.form.valid = false;
      return;
    }
    // now post all together as FormData
    const submitData = new FormData();
    Object.keys(this.form.data).forEach((key) => {
      if (key !== 'files') submitData.append(key, this.form.data[key]);
    });
    files.forEach((file) => { submitData.append('files', file); });
    this.submit(submitData);
  }

  view() {
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
      // file upload: work in progress, so far all files get deleted with a patch
      m('div', [
        'WARNING: Files added here will remove all files currently uploaded. If you want to add',
        '/edit a file in this studydoc, reupload all other files as well.',
        m(List, {
          tiles: [...this.form.data.files.entries()].map(numAndFile => m(ListTile, {
            content: [
              m(FileInput, this.form.bind({
                name: `new_file_${numAndFile[0]}`,
                label: numAndFile[1].name,
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
          events: { onclick: () => { this.form.data.files.push({ name: 'add file' }); } },

        }),
      ]),
    ]);
  }
}
