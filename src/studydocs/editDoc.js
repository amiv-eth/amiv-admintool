import m from 'mithril';
import { FileInput } from 'amiv-web-ui-components';
import { Button, List, ListTile, Snackbar } from 'polythene-mithril';
import EditView from '../views/editView';
import { getSchema } from '../auth';


export default class editDoc extends EditView {
  // constructor zu file upload
  constructor(vnode) {
    // remove the files list as it is impossible to validate
    const docSchema = getSchema().definitions['Study Document'];
    delete docSchema.properties.files;
    super(vnode);
    if (!('files' in this.form.data)) {
      this.form.data.files = [{ name: 'add file' }];
    }
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
    this.submit(submitData).then(() => this.controller.changeModus('view'));
  }

  view() {
    return this.layout([
      m('h3', 'Add a New Studydocument'),
      this.form._renderField('semester', {
        ...this.form.schema.properties.semester,
        style: { width: '100px' },
      }),
      ...this.form.renderSchema(['type', 'lecture', 'title', 'course_year', 'professor', 'author']),
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
          events: { onclick: () => { this.form.data.files.push({ name: 'add file' }); } },
        }),
      ]),
    ]);
  }
}
