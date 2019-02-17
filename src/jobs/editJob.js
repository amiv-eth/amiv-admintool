import m from 'mithril';
import { FileInput } from 'amiv-web-ui-components';
import { loadingScreen } from '../layout';
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
    if (!this.form.schema) return m(loadingScreen);
    return this.layout([
      m('h3', 'Add a New Job Offer'),
      ...this.form.renderSchema(['company']),
      m(FileInput, this.form.bind({
        name: 'logo',
        label: 'Company Logo',
        accept: 'image/png, image/jpeg',
      })),
      ...this.form.renderSchema(['time_end', 'title_en']),
      this.form._renderField('description_en', {
        multiLine: true,
        rows: 5,
        ...this.form.schema.properties.description_en,
      }),
      ...this.form.renderSchema(['title_de']),
      this.form._renderField('description_de', {
        multiLine: true,
        rows: 5,
        ...this.form.schema.properties.description_de,
      }),
      m(FileInput, this.form.bind({
        name: 'pdf',
        label: 'PDF',
        accept: 'application/pdf',
      })),
    ]);
  }
}
