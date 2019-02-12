import m from 'mithril';
import { Converter } from 'showdown';
import { Card } from 'polythene-mithril';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import ItemView from '../views/itemView';
import { dateFormatter } from '../utils';
import { Property } from '../views/elements';

export default class viewJob extends ItemView {
  constructor(vnode) {
    super(vnode);
    this.markdown = new Converter();
  }

  view() {
    const stdMargin = { margin: '5px' };

    return this.layout([
      m('div', { style: { height: '50px' } }, [
        // company logo if existing
        this.data.logo ? m('img', {
          src: `${apiUrl}/${this.data.logo.file}`,
          height: '50px',
          style: { float: 'left' },
        }) : '',
        m('h3', {
          style: { 'line-height': '50px', 'margin-top': '0px' },
        }, this.data.company),
      ]),
      // below the title, most important details are listed
      m('div', { style: { display: 'flex', margin: '5px 0px 0px 5px' } }, [
        this.data.time_end ? m(Property, {
          title: 'Offer Ends',
          style: stdMargin,
        }, `${dateFormatter(this.data.time_end)}`) : '',
      ]),
      m('div.viewcontainer', [
        m('div.viewcontainercolumn', m(Card, {
          content: m('div.maincontainer', [
            m('div.pe-card__title', this.data.title_de),
            m('div', m.trust(this.markdown.makeHtml(this.data.description_de))),
          ]),
        })),
        m('div.viewcontainercolumn', m(Card, {
          content: m('div.maincontainer', [
            m('div.pe-card__title', this.data.title_en),
            m('div', m.trust(this.markdown.makeHtml(this.data.description_en))),
          ]),
        })),
      ]),
    ]);
  }
}
