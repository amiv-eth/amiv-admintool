import m from 'mithril';
import EditView from '../views/editView';


export default class newJob extends EditView {
  view() {
    return this.layout([
      m('h3', 'Add a New Job Offer'),
      ...this.form.renderPage({
        title_de: { type: 'text', label: 'German Title' },
      }),
    ]);
  }
}
