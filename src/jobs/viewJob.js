import m from 'mithril';
import marked from 'marked';
import escape from 'html-escape';
import { Card, Toolbar, ToolbarTitle, Button, TextField } from 'polythene-mithril';
import ItemView from '../views/itemView';
import { dateFormatter } from '../utils';
import { Property, icons, svgWithTitle, imgWithTitle } from '../views/elements';

export default class viewJob extends ItemView {
  constructor(vnode) {
    super(vnode);
    this.editingGerman = false;
    this.editingEnglish = false;
  }

  view() {
    const stdMargin = { margin: '5px' };

    return this.layout([
      m('div', [
        // company logo if existing
        this.data.img_thumbnail ? m(imgWithTitle, {
          svg: icons.iconUnknownCompany,
          title: this.data.company,
          margin: '4px',
          style: { float: 'left' },
        }) : m(svgWithTitle, {
          svg: icons.iconUnknownCompany,
          title: this.data.company,
          margin: '4px',
          style: { float: 'left' },
        }),
        m('h3', {
          // margin: '100px',
          style: { 'margin-top': '0px', 'margin-bottom': '0px' },
        }, [this.data.title_de || this.data.title_en]),
      ]),
      // below the title, most important details are listed
      m('div', { style: { display: 'flex' } }, [
        m(
          Property, { title: 'Expected starting time:', style: stdMargin },
          this.data.time_start ? `${dateFormatter(this.data.time_start)}` : 'Unknown.',
        ),
        m(
          Property, { title: 'Potential duration:', style: stdMargin },
          this.data.duration ? `${dateFormatter(this.data.duration)}` : 'Unknown.',
        ),
        m(
          Property, { title: 'Offer ends:', style: stdMargin },
          this.data.time_advertising_end?`${dateFormatter(this.data.time_advertising_end)}`:'',
        ),
      ]),
      // m('div.viewcontainercolumn', [
      m('div.viewcontainer', [
        m('div.viewcontainercolumn', m(Card, {
          content: m('div', [
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'Deutsche Beschreibung' }),
              m(Button, {
                className: 'blue-button',
                label: 'Beschreibung erfassen',
                events: { onclick: () => { this.editingGerman = !this.editingGerman; } },
              }),
            ]),
            this.editingGerman ? m(TextField, {
              multiLine: true,
            }) : m('p', m.trust(marked(escape(this.data.description_de)))),
          ]),
        })),
        m('div.viewcontainercolumn', m(Card, {
          // style: { height: '350px' },
          content: m('div', [
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'English description' }),
              m(Button, {
                className: 'blue-button',
                label: 'Write description',
                events: { onclick: () => { this.editingEnglish = !this.editingEnglish; } },
              }),
            ]),
            this.editingEnglish ? m(TextField, {
              multiLine: true,
            }) : m('p', m.trust(marked(escape(this.data.description_en)))),
          ]),
        })),
      ]),
      // m(Card, [
      //   this.data.location ? m(Property, { title: 'Location' }, `${this.data.location}`) :
      //     m(Property, { title: 'Location' }, 'Unknown location.'),
      //   m(chip, {
      //     svg: this.data.show_website ? icons.checked : icons.clear,
      //     border: '1px #aaaaaa solid',
      //   }, 'website'),
      //   m(DuoLangProperty, {
      //     title: 'Description',
      //     de: m('p', m.trust(marked(escape(this.data.description_de)))),
      //     en: m('p', m.trust(marked(escape(this.data.description_en)))),
      //   }),
      // ]),
    ]);
  }
}