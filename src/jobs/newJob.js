import m from 'mithril';
import { RaisedButton } from 'polythene-mithril';
import EditView from '../views/editView';


export default class newJob extends EditView {
  constructor(vnode) {
    super(vnode, 'joboffers', {});
  }

  view() {
    const submitButton = m(RaisedButton, {
      disabled: !this.valid,
      label: 'Submit',
      events: {
        onclick: () => { this.submit(); },
      },
    });

    return m('div.maincontainer', [
      m('h3', 'Add a New Job Offer'),
      ...this.renderPage({
        title_de: { type: 'text', label: 'German Title' },
      }),
      m('br'),
      submitButton,
    ]);
  }
}
