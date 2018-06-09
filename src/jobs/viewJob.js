import m from 'mithril';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import ItemView from '../views/itemView';
import { dateFormatter } from '../utils';
import { Property } from '../views/elements';

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
        this.data.img_thumbnail ? m('img', {
          src: `${apiUrl}/${this.data.logo.file}`,
          height: '50px',
          style: { float: 'left' },
        }) : '',
        m('h3', {
          style: { 'margin-top': '0px', 'margin-bottom': '0px' },
        }, [this.data.title_de || this.data.title_en]),
      ]),
      // below the title, most important details are listed
      this.data.time_end ? m(Property, {
        title: 'Offer Ends',
      }, `${dateFormatter(this.data.time_end)}`) : '',
    ]);
  }
}
