import m from 'mithril';
import {
  Switch,
  Button,
  Card,
  TextField,
  Icon,
} from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import { apiUrl } from 'networkConfig';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';
import { icons, DropdownCard, Property } from '../views/elements';
import { ResourceHandler } from '../auth';

const viewLayout = [
  {
    '.propertyLangIndicator': {
      width: '30px',
      height: '20px',
      float: 'left',
      'background-color': 'rgb(031,045,084)',
      'border-radius': '10px',
      'text-align': 'center',
      'line-height': '20px',
      color: 'rgb(255,255,255)',
      'margin-right': '10px',
      'font-size': '11px',
    },
    '.jobViewLeft': {
      'grid-column': 1,
    },
    '.jobViewRight': {
      'grid-column': 2,
    },
    '.jobViewRight h4': {
      'margin-top': '0px',
    },
  },
];
styler.add('jobView', viewLayout);


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
  constructor() {
    super('jobs');
    this.description = false;
    this.advertisement = false;
    this.logo = false;
  }

  oninit() {
    this.handler.getItem(this.id, this.embedded).then((item) => {
      this.data = item;
      m.redraw();
    });
  }

  view({ attrs: { onEdit } }) {
    if (!this.data) return '';

    let displaySpots = '-';

    if (this.data.spots !== 0) {
      displaySpots = this.data.spots;
    }

    return m('div', {
      style: { height: '100%', 'overflow-y': 'scroll', padding: '10px' },
    }, [
      m(Button, {
        element: 'div',
        label: 'Update Event',
        events: { onclick: onEdit },
      }),

      // this div is the title line
      m('div', [
        // company logo if existing
        this.data.img_thumbnail ? m('img', {
          src: `${apiUrl}${this.data.img_thumbnail.file}`,
          height: '50px',
          style: { float: 'left' },
        }) : '',
        m('h1', { style: { 'margin-top': '0px', 'margin-bottom': '0px' } }, [this.data.title_de || this.data.title_en]),
      ]),
      // below the title, most important details are listed
      this.data.signup_count ? m(Property, {
        style: { float: 'left', 'margin-right': '20px' },
        title: 'Signups',
      }, `${this.data.signup_count} / ${displaySpots}`) : m.trust('&nbsp;'),
      this.data.location ? m(Property, {
        style: { float: 'left', 'margin-right': '20px' },
        title: 'Location',
      }, `${this.data.location}`) : m.trust('&nbsp;'),
      this.data.time_start ? m(Property, {
        title: 'Time',
      }, `${dateFormatter(this.data.time_start)} - ${dateFormatter(this.data.time_end)}`) : m.trust('&nbsp;'),
    ]);
  }
}
