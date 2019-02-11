import m from 'mithril';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import ItemView from '../views/itemView';
import { dateFormatter } from '../utils';
import { Property, chip } from '../views/elements';

export default class viewJob extends ItemView {
  view() {
    const stdMargin = { margin: '5px' };

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
      m('div', { style: { display: 'flex' } }, [
        this.data.time_end ? m(Property, {
          title: 'Offer Ends',
          style: stdMargin,
        }, `${dateFormatter(this.data.time_end)}`) : '',
        this.data.company ? m(Property, {
          title: 'Company',
          style: stdMargin,
        }, this.data.company) : '',
      ]),
      m('div.viewcontainer', [
        m('div.viewcontainercolumn', m('div', [
          m('div', { style: { color: 'rgb(031,045,084)' } }, 'en'),
          this.data.description_en,
        ])),
        m('div.viewcontainercolumn', m('div', [
          m('div', { style: { color: 'rgb(031,045,084)' } }, 'de'),
          this.data.description_de,
        ])),
      ]),
    ]);
  }
}
