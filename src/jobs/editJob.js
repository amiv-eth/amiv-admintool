import m from 'mithril';
import { RaisedButton } from 'polythene-mithril';
import { fileInput } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import EditView from '../views/editView';

export default class newJob extends EditView {
  view() {
    const buttonRight = m(RaisedButton, {
      label: 'next',
      disabled: this.currentpage === 5,
      events: {
        onclick: () => {
          this.currentpage = Math.min(this.currentpage + 1, 5);
        },
      },
    });

    const buttonLeft = m(RaisedButton, {
      label: 'previous',
      disabled: this.currentpage === 1,
      events: {
        onclick: () => {
          this.currentpage = Math.max(1, this.currentpage - 1);
        },
      },
    });

    const title = [
      'Job Description', 'Advertisement', 'Logo'][this.currentpage - 1];

    return this.layout([
      m('h3', title),
      buttonLeft,
      m.trust('&nbsp;'),
      buttonRight,
      m('br'),
      m('div', {
        style: { display: (this.currentpage === 1) ? 'block' : 'none' },
      }, this.form.renderPage({
        title_en: { type: 'text', label: 'English Job Title' },
        description_en: {
          type: 'text',
          label: 'English Description',
          multiLine: true,
          rows: 5,
        },
        title_de: { type: 'text', label: 'German Job Title' },
        description_de: {
          type: 'text',
          label: 'German Description',
          multiLine: true,
          rows: 5,
        },
        // location: { type: 'text', label: 'Location' },
        time_end: { type: 'datetime', label: 'Prospective Job End Time' },
        time_start: {
          type: 'datetime',
          label: 'Desired Job Start Time',
          hint: 'If as soon as possible, write nothing.',
        },
      })),
      m('div', {
        style: { display: (this.currentpage === 2) ? 'block' : 'none' },
      }, [
        ...this.form.renderPage({
          time_advertising_start: {
            type: 'datetime',
            label: 'Start of Advertisement on Website',
            required: false,
          },
          time_advertising_end: {
            type: 'datetime',
            label: 'End of Advertisement on Website',
            required: false,
          },
        }),
        ...this.form.renderPage({
          show_website: { type: 'checkbox', label: 'Advertise on Website' },
        }),
      ]),
      m('div', {
        style: { display: (this.currentpage === 3) ? 'block' : 'none' },
      }, [
        ['logo'].map(key => [ // think about adding a thumbnail.
          this.data[`img_${key}`] ? m('img', {
            src: `${apiUrl}${this.data[`img_${key}`].file}`,
            style: { 'max-height': '50px', 'max-width': '100px' },
          }) : m('div', `currently no ${key} image set`),
          m(fileInput, this.form.bind({
            name: `new_${key}`,
            label: `New ${key} Image`,
            accept: 'image/png, image/jpeg',
          })),
        ]),
      ]),
    ]);
  }
}