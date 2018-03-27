import m from 'mithril';
import {
  Switch,
  Button,
  Card,
  TextField,
  Icon,
} from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import ItemView from '../views/itemView';
import { apiUrl, eventsignups as signupConfig } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';
import { icons, DropdownCard, Property } from '../views/elements';
import { ResourceHandler } from '../auth';

const viewLayout = [
  {
    '.eventViewContainer': {
      display: 'grid',
      'grid-template-columns': '40% 55%',
      'grid-gap': '50px',
    },
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
    '.eventViewLeft': {
      'grid-column': 1,
    },
    '.eventViewRight': {
      'grid-column': 2,
    },
    '.eventViewRight h4': {
      'margin-top': '0px',
    },
  },
];
styler.add('eventView', viewLayout);


// small helper class to display both German and English content together, dependent
// on which content is available.
class DuoLangProperty {
  view({ attrs: { title, de, en } }) {
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

// Helper class to either display the signed up participants or those on the
// waiting list.
class ParticipantsTable {
  constructor({ attrs: { where } }) {
    this.ctrl = new DatalistController('eventsignups', {
      embedded: { user: 1 },
      where,
    }, ['email', 'user.firstname', 'user.lastname'], false);
  }

  getItemData(data) {
    // TODO list should not have hardcoded size outside of stylesheet
    return [
      m('div', { style: { width: '9em' } }, dateFormatter(data._created)),
      m('div', { style: { width: '9em' } }, data.user.lastname),
      m('div', { style: { width: '9em' } }, data.user.firstname),
      m('div', { style: { width: '9em' } }, data.email),
    ];
  }

  view() {
    return m(Card, {
      style: { height: '300px' },
      content: m(TableView, {
        controller: this.ctrl,
        keys: signupConfig.tableKeys,
        tileContent: this.getItemData,
        titles: [
          { text: 'Date of Signup', width: '9em' },
          { text: 'Name', width: '9em' },
          { text: 'First Name', width: '9em' },
          { text: 'Email', width: '9em' },
        ],
      }),
    });
  }
}

class EmailList {
  view({ attrs: { list } }) {
    const emails = list.toString().replace(/,/g, '; ');
    return m(Card, {
      content: m(TextField, { value: emails, label: '', multiLine: true }, ''),
    });
  }
}

export default class viewEvent extends ItemView {
  constructor() {
    super('events');
    this.signupHandler = new ResourceHandler('eventsignups');
    this.description = false;
    this.advertisement = false;
    this.registration = false;
    this.emailAdresses = false;
    this.emaillist = [''];
    this.showAllEmails = false;
  }

  oninit() {
    this.handler.getItem(this.id, this.embedded).then((item) => {
      this.data = item;
      m.redraw();
    });
    this.setUpEmailList(this.showAllEmails);
  }

  setUpEmailList(showAll) {
    // setup where query
    const where = { event: this.id };
    if (!showAll) {
      // only show accepted
      where.accepted = true;
    }
    this.signupHandler.get({ where }).then((data) => {
      this.emaillist = (data._items.map(item => item.email));
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
      m('div', [
        this.data.img_thumbnail ? m('img', {
          src: `${apiUrl.slice(0, -1)}${this.data.img_thumbnail.file}`,
          height: '50px',
          style: { float: 'left' },
        }) : '',
        m('h1', { style: { 'margin-top': '0px', 'margin-bottom': '0px' } }, [this.data.title_de || this.data.title_en]),
      ]),
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

      m('div.eventViewContainer', { style: { 'margin-top': '50px' } }, [
        m('div.eventViewLeft', [
          m(DropdownCard, { title: 'description' }, [
            m(DuoLangProperty, {
              title: 'Catchphrase',
              de: this.data.catchphrase_de,
              en: this.data.catchphrase_en,
            }),
            m(DuoLangProperty, {
              title: 'Description',
              de: this.data.description_de,
              en: this.data.description_en,
            }),
          ]),

          m(DropdownCard, { title: 'advertisement' }, [
            [
              m(Icon, {
                style: { float: 'left' },
                svg: m.trust(this.data.show_annonce ? icons.checked : icons.clear),
              }),
              m('span', { style: { float: 'left' } }, 'annonce'),
              m(Icon, {
                style: { float: 'left' },
                svg: m.trust(this.data.show_infoscreen ? icons.checked : icons.clear),
              }),
              m('span', { style: { float: 'left' } }, 'infoscreen'),
              m(Icon, {
                style: { float: 'left' },
                svg: m.trust(this.data.show_website ? icons.checked : icons.clear),
              }),
              m('span', { style: { float: 'left' } }, 'website'),
            ],
            this.data.time_advertising_start ? m(
              Property,
              'Advertising Time',
              `${dateFormatter(this.data.time_advertising_start)} - ${dateFormatter(this.data.time_advertising_end)}`,
            ) : '',
            this.data.priority ? m(
              Property,
              { title: 'Priority' },
              `${this.data.priority}`,
            ) : '',
          ]),

          m(DropdownCard, { title: 'Registration' }, [
            this.data.price ? m(Property, 'Price', `${this.data.price}`) : '',
            this.data.time_register_start ? m(
              Property,
              { title: 'Registration Time' },
              `${dateFormatter(this.data.time_register_start)} - ${dateFormatter(this.data.time_register_end)}`,
            ) : '',
            this.data.selection_strategy ? m(
              Property,
              { title: 'Selection Mode' },
              m.trust(this.data.selection_strategy),
            ) : '',
            this.data.allow_email_signup ? m(Property, 'non AMIV-Members allowed') : '',
          ]),

          m(DropdownCard, { title: 'Email Adresses' }, [
            m(Switch, {
              defaultChecked: false,
              label: 'show unaccepted',
              onChange: () => {
                this.showAllEmails = !this.showAllEmails;
                this.setUpEmailList(this.showAllEmails);
              },
            }),
            m(EmailList, { list: this.emaillist }),
          ]),
        ]),

        m('div.eventViewRight', [
          m('h4', 'Accepted Participants'),
          m(ParticipantsTable, { where: { accepted: true, event: this.data._id } }),
          m('p', ''),
          m('h4', 'Participants on Waiting List'),
          m(ParticipantsTable, { where: { accepted: false, event: this.data._id } }),
        ]),
      ]),

    ]);
  }
}