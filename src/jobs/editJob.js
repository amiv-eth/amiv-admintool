import m from 'mithril';
import marked from 'marked';
import { RaisedButton, Card, Toolbar, ToolbarTitle, Button } from 'polythene-mithril';
import { fileInput } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import EditView from '../views/editView';

export default class newJob extends EditView {
  constructor(vnode) {
    super(vnode);
    this.currentpage = 1;
    this.editingGerman = true;
    this.editingEnglish = true;
  }

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
      }, m('div.viewcontainer', [
        m('div.viewcontainercolumn', m(Card, {
          content: m('div', [
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'Deutsche Beschreibung' }),
              m(Button, {
                className: 'blue-button',
                label: 'Markdown überprüfen',
                events: { onclick: () => { this.editingGerman = !this.editingGerman; } },
              }),
            ]),
            this.editingGerman ? m('div', this.form.renderPage({
              title_de: { type: 'text', label: 'German Event Title' },
              catchphrase_de: { type: 'text', label: 'German Catchphrase' },
              description_de: {
                type: 'text',
                label: 'German Description',
                multiLine: true,
                rows: 10000,
              },
            })) : m('p', m.trust(marked(escape(this.data.description_de)))),
          ]),
        })),
        m('div.viewcontainercolumn', m(Card, {
          content: m('div', [
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'English description' }),
              m(Button, {
                className: 'blue-button',
                label: 'Verify markdown',
                events: { onclick: () => { this.editingEnglish = !this.editingEnglish; } },
              }),
            ]),
            this.editingEnglish ? m('div', this.form.renderPage({
              title_en: { type: 'text', label: 'English Event Title' },
              catchphrase_en: { type: 'text', label: 'English Catchphrase' },
              description_en: {
                type: 'text',
                label: 'English Description',
                multiLine: true,
                rows: 10000,
              },
            })) : m('p', m.trust(marked(escape(this.data.description_en)))),
          ]),
        })),
      ])),
      m('div', {
        style: { display: (this.currentpage === 3) ? 'block' : 'none' },
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
        /*time_end: { type: 'datetime', label: 'Prospective Job End Time' },
        time_start: {
          type: 'datetime',
          label: 'Desired Job Start Time',
          hint: 'If as soon as possible, write nothing.',
        },*/
      })),
      m('div', {
        style: { display: (this.currentpage === 2) ? 'block' : 'none' },
      }, [
        // TODO: update once the right fields are accepted by API.
        /*...this.form.renderPage({
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
        }),*/
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