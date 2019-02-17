import m from 'mithril';
import { FileInput } from 'amiv-web-ui-components';
import EditView from '../views/editView';


export default class newJob extends EditView {
  beforeSubmit() {
    console.log(this.form.data);
    // remove all unchanged files
    if (this.form.data.pdf !== undefined &&
        (this.form.data.pdf === null || 'upload_date' in this.form.data.pdf)) {
      delete this.form.data.pdf;
    }
    if (this.form.data.logo !== undefined &&
        (this.form.data.logo === null || 'upload_date' in this.form.data.logo)) {
      delete this.form.data.logo;
    }

    // post everyhing together as FormData
    const submitData = new FormData();
    Object.keys(this.form.data).forEach((key) => {
      submitData.append(key, this.form.data[key]);
    });
    this.submit(submitData);
  }

  view() {
    return this.layout([
      m('h3', 'Add a New Job Offer'),
      ...this.form.renderPage({ company: { type: 'text', label: 'Company' } }),
      m(FileInput, this.form.bind({
        name: 'logo',
        label: 'Company Logo',
        accept: 'image/png, image/jpeg',
      })),
      ...this.form.renderPage({
        time_end: {
          type: 'datetime',
          label: 'End of Advertisement',
          required: true,
        },
        show_website: {
          type: 'checkbox',
          label: 'Show on Website',
        },
        title_en: { type: 'text', label: 'English Title' },
        description_en: {
          type: 'text',
          label: 'English Text',
          multiLine: true,
          rows: 5,
        },
        title_de: { type: 'text', label: 'German Title' },
        description_de: {
          type: 'text',
          label: 'German Text',
          multiLine: true,
          rows: 5,
        },
      }),
      m(FileInput, this.form.bind({
        name: 'pdf',
        label: 'PDF',
        accept: 'application/pdf',
      })),
    ]);
  }
}
