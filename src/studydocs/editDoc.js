import m from 'mithril';
import EditView from '../views/editView';


export default class editDoc extends EditView {
  view() {
    return this.layout([
      m('h3', 'Add a New Studydocument'),
      ...this.form.renderPage({
        title: { type: 'text', label: 'Title' },
        lecture: { type: 'text', label: 'Lecture' },
      }),
    ]);
  }
}
