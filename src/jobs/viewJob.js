import m from 'mithril';
import marked from 'marked';
import escape from 'html-escape';
import ItemView from '../views/itemView';
import { dateFormatter } from '../utils';
import { Property, icons, svgWithTitle, imgWithTitle, chip } from '../views/elements';

// small helper class to display both German and English content together, dependent
// on which content is available.
class DuoLangProperty {
  view({ attrs: { title, de, en } }) {
    // TODO Lang indicators should be smaller and there should be less margin
    // between languages
    return m(
      Property,
      { title },
      de ? m('div', [
        m('div', { className: 'propertyLangIndicator' }, 'DE'),
        m('p', de),
      ]) : '',
      en ? m('div', [
        m('div', { className: 'propertyLangIndicator' }, 'EN'),
        m('p', en),
      ]) : '',
    );
  }
}

export default class viewJob extends ItemView {
  view() {
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
      // m('div.viewcontainercolumn', [
      m('div', [
        this.data.location ? m(Property, { title: 'Location' }, `${this.data.location}`) :
          m(Property, { title: 'Location' }, 'Unknown location.'),
        m(chip, {
          svg: this.data.show_website ? icons.checked : icons.clear,
          border: '1px #aaaaaa solid',
        }, 'website'),
        m(DuoLangProperty, {
          title: 'Description',
          de: m('p', m.trust(marked(escape(this.data.description_de)))),
          en: m('p', m.trust(marked(escape(this.data.description_en)))),
        }),
      ]),
      // below the title, most important details are listed
      this.data.time_end ? m(Property, {
        title: 'Offer Ends',
      }, `${dateFormatter(this.data.time_end)}`) : '',
    ]);
  }
}
