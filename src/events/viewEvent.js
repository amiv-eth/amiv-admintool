import m from 'mithril';
import {
  Switch,
  Toolbar,
  ToolbarTitle,
  Card,
  TextField,
} from 'polythene-mithril';
import { styler } from 'polythene-core-css';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import ItemView from '../views/itemView';
import { eventsignups as signupConfig } from '../resourceConfig.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';
import { icons, DropdownCard, Property, chip } from '../views/elements';
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
      m(
        'div',
        { style: { width: '18em' } },
        data.user ? `${data.user.firstname} ${data.user.lastname}` : '',
      ),
      m('div', { style: { width: '9em' } }, data.email),
    ];
  }

  view({ attrs: { title } }) {
    return m(Card, {
      style: { height: '400px', 'margin-bottom': '10px' },
      content: m('div', [
        m(Toolbar, { compact: true }, [
          m(ToolbarTitle, { text: title }),
        ]),
        m(TableView, {
          tableHeight: '275px',
          controller: this.ctrl,
          keys: signupConfig.tableKeys,
          tileContent: this.getItemData,
          titles: [
            { text: 'Date of Signup', width: '9em' },
            { text: 'Name', width: '18em' },
            { text: 'Email', width: '9em' },
          ],
        }),
      ]),
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
  constructor(vnode) {
    super(vnode);
    this.signupHandler = new ResourceHandler('eventsignups');
    this.description = false;
    this.advertisement = false;
    this.registration = false;
    this.emailAdresses = false;
    this.emaillist = [''];
    this.showAllEmails = false;
  }

  oninit() {
    this.setUpEmailList(this.showAllEmails);
  }

  setUpEmailList(showAll) {
    // setup where query
    const where = { event: this.data._id };
    if (!showAll) {
      // only show accepted
      where.accepted = true;
    }
    this.signupHandler.get({ where }).then((data) => {
      this.emaillist = (data._items.map(item => item.email));
      m.redraw();
    });
  }

  view() {
    let displaySpots = '-';
    const stdMargin = { margin: '5px' };

    if (this.data.spots !== 0) {
      displaySpots = this.data.spots;
    }

    return this.layout([
      // this div is the title line
      m('div.maincontainer', [
        // event image if existing
        this.data.img_thumbnail ? m('img', {
          src: `${apiUrl}${this.data.img_thumbnail.file}`,
          height: '50px',
          style: { float: 'left', margin: '0 5px' },
        }) : '',
        m('h1', this.data.title_de || this.data.title_en),
      ]),
      // below the title, most important details are listed
      m('div.maincontainer', { style: { display: 'flex' } }, [
        ('signup_count' in this.data && this.data.signup_count !== null) && m(Property, {
          style: stdMargin,
          title: 'Signups',
        }, `${this.data.signup_count} / ${displaySpots}`),
        this.data.location && m(Property, {
          style: stdMargin,
          title: 'Location',
        }, `${this.data.location}`),
        this.data.time_start && m(Property, {
          title: 'Time',
          style: stdMargin,
        }, `${dateFormatter(this.data.time_start)} - ${dateFormatter(this.data.time_end)}`),
      ]),
      // everything else is not listed in DropdownCards, which open only on request
      m('div.viewcontainer', [
        m('div.viewcontainercolumn', [
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

          m(DropdownCard, { title: 'advertisement', style: { margin: '10px 0' } }, [
            [
              m(chip, {
                svg: this.data.show_annonce ? icons.checked : icons.clear,
                border: '1px #aaaaaa solid',
              }, 'announce'),
              m(chip, {
                svg: this.data.show_infoscreen ? icons.checked : icons.clear,
                border: '1px #aaaaaa solid',
                margin: '4px',
              }, 'infoscreen'),
              m(chip, {
                svg: this.data.show_website ? icons.checked : icons.clear,
                border: '1px #aaaaaa solid',
              }, 'website'),
            ],
            this.data.time_advertising_start ? m(
              Property,
              { title: 'Advertising Time' },
              `${dateFormatter(this.data.time_advertising_start)} - ` +
              `${dateFormatter(this.data.time_advertising_end)}`,
            ) : '',
            this.data.priority ? m(
              Property,
              { title: 'Priority' },
              `${this.data.priority}`,
            ) : '',
          ]),

          m(DropdownCard, { title: 'Registration', style: { margin: '10px 0' } }, [
            this.data.price ? m(Property, { title: 'Price' }, `${this.data.price}`) : '',
            this.data.time_register_start ? m(
              Property,
              { title: 'Registration Time' },
              `${dateFormatter(this.data.time_register_start)} - ` +
              `${dateFormatter(this.data.time_register_end)}`,
            ) : '',
            this.data.selection_strategy ? m(
              Property,
              { title: 'Selection Mode' },
              m.trust(this.data.selection_strategy),
            ) : '',
            this.data.allow_email_signup && m(Property, 'non AMIV-Members allowed'),
            this.data.additional_fields && m(
              Property,
              { title: 'Registration Form' },
              this.data.additional_fields,
            ),
          ]),

          // a list of email adresses of all participants, easy to copy-paste
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

        m('div.viewcontainercolumn', [
          this.data.time_register_start ? m(ParticipantsTable, {
            where: { accepted: true, event: this.data._id },
            title: 'Accepted Participants',
          }) : '',
          this.data.time_register_start ? m(ParticipantsTable, {
            where: { accepted: false, event: this.data._id },
            title: 'Participants on Waiting List',
          }) : '',
        ]),
      ]),

    ]);
  }
}
