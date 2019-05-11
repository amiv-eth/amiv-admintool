import m from 'mithril';
import { Toolbar, ToolbarTitle, Card, Button } from 'polythene-mithril';
import Stream from 'mithril/stream';
import { styler } from 'polythene-core-css';
import { DropdownCard, DatalistController, Chip } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import RelationlistController from '../relationlistcontroller';
import { dateFormatter } from '../utils';
import { Property, FilterChip, icons } from '../views/elements';
import { ResourceHandler } from '../auth';
import { colors } from '../style';

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

class ParticipantsSummary {
  constructor() {
    this.onlyAccepted = true;
  }

  view({ attrs: { participants, additionalFields = "{'properties': {}}" } }) {
    // Parse the JSON from additional fields into an object
    const parsedParticipants = participants.map(signup => ({
      ...signup,
      additional_fields: signup.additional_fields ?
        JSON.parse(signup.additional_fields) : {},
    }));
    // Filter if only accepted participants should be shown
    const filteredParticipants = parsedParticipants.filter(participant =>
      (this.onlyAccepted ? participant.accepted : true));

    // check which additional fields should get summarized
    let hasSBB = false;
    let hasFood = false;
    if (additionalFields) {
      hasSBB = 'sbb_abo' in JSON.parse(additionalFields).properties;
      hasFood = 'food' in JSON.parse(additionalFields).properties;
    }

    return m('div', [
      m('div', {
        style: {
          height: '50px',
          'overflow-x': 'auto',
          'overflow-y': 'hidden',
          'white-space': 'nowrap',
          padding: '0px 5px',
        },
      }, [].concat(['Filters: '], ...[
        m(FilterChip, {
          selected: this.onlyAccepted,
          onclick: () => { this.onlyAccepted = !this.onlyAccepted; },
        }, 'accepted users'),
      ])),
      hasSBB ? m('div', { style: { display: 'flex' } }, [
        m(Property, { title: 'No SBB', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.sbb_abo === 'None').length),
        m(Property, { title: 'GA', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.sbb_abo === 'GA').length),
        m(Property, { title: 'Halbtax', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.sbb_abo === 'Halbtax').length),
        m(Property, { title: 'Gleis 7', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.sbb_abo === 'Gleis 7').length),
      ]) : '',
      hasFood ? m('div', { style: { display: 'flex' } }, [
        m(Property, { title: 'Omnivors', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.food === 'Omnivor').length),
        m(Property, { title: 'Vegis', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.food === 'Vegi').length),
        m(Property, { title: 'Vegans', leftAlign: false }, filteredParticipants.filter(signup =>
          signup.additional_fields.food === 'Vegan').length),
      ]) : '',
      m('textarea', {
        style: { opacity: '0', width: '0px' },
        id: 'participantsemails',
      }, filteredParticipants.map(signup => signup.email).toString().replace(/,/g, '; ')),
      m(Button, {
        label: 'Copy Emails',
        events: {
          onclick: () => {
            document.getElementById('participantsemails').select();
            document.execCommand('copy');
          },
        },
      }),
    ]);
  }
}

// Helper class to either display the signed up participants or those on the
// waiting list.
class ParticipantsTable {
  constructor({ attrs: { where, additional_fields_schema: additionalFieldsSchema } }) {
    this.ctrl = new RelationlistController({
      primary: 'eventsignups',
      secondary: 'users',
      query: { where },
      searchKeys: ['email'],
      includeWithoutRelation: true,
    });
    this.add_fields_schema = additionalFieldsSchema ?
      JSON.parse(additionalFieldsSchema).properties : null;
  }

  exportAsCSV(filePrefix) {
    this.ctrl.getFullList().then((list) => {
      const csvData = (list.map((item) => {
        const additionalFields = item.additional_fields && JSON.parse(item.additional_fields);

        return [
          item.position,
          item._created,
          item.user ? item.user.firstname : '',
          item.user ? item.user.lastname : '',
          item.user ? item.user.membership : 'none',
          item.email,
          item.accepted,
          item.confirmed,
          ...Object.keys(this.add_fields_schema || {}).map(key =>
            (additionalFields && additionalFields[key] ? additionalFields[key] : '')),
        ].join(',');
      })).join('\n');

      const header = [
        'Position', 'Date', 'Firstname', 'Lastname', 'Membership', 'Email', 'Accepted', 'Confirmed',
        ...Object.keys(this.add_fields_schema || {}).map(key => this.add_fields_schema[key].title),
      ].join(',');

      const filename = `${filePrefix}_participants_export.csv`;
      const fileContent = `data:text/csv;charset=utf-8,${header}\n${csvData}`;

      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(fileContent));
      link.setAttribute('download', filename);
      link.click();
    });
  }

  itemRow(data) {
    // TODO list should not have hardcoded size outside of stylesheet
    const hasPatchRights = data._links.self.methods.indexOf('PATCH') > -1;
    const additionalFields = data.additional_fields && JSON.parse(data.additional_fields);
    const canBeAccepted = !data.accepted;
    return [
      m('div', { style: { width: '9em' } }, dateFormatter(data._created)),
      m('div', { style: { width: '16em' } }, [
        ...data.user ? [`${data.user.firstname} ${data.user.lastname}`, m('br')] : '',
        data.email,
      ]),
      m(
        'div', { style: { width: '14em' } },
        m('div', ...data.user ? `Membership: ${data.user.membership}` : ''),
        (additionalFields && this.add_fields_schema) ? Object.keys(additionalFields).map(key =>
          m('div', `${this.add_fields_schema[key].title}: ${additionalFields[key]}`)) : '',
      ),
      m('div', { style: { 'flex-grow': '100' } }),
      canBeAccepted ? m('div', m(Button, {
        // Button to accept this eventsignup
        className: 'blue-row-button',
        style: {
          margin: '0px 4px',
        },
        borders: false,
        label: 'accept',
        events: {
          onclick: () => {
            // preapare data for patch request
            const patch = (({ _id, _etag }) => ({ _id, _etag }))(data);
            patch.accepted = true;
            this.ctrl.handler.patch(patch).then(() => {
              this.ctrl.refresh();
              m.redraw();
            });
          },
        },
      })) : '',
      hasPatchRights ? m('div', m(Button, {
        // Button to remove this eventsignup
        className: 'red-row-button',
        borders: false,
        label: 'remove',
        events: {
          onclick: () => {
            this.ctrl.handler.delete(data).then(() => {
              this.ctrl.refresh();
              m.redraw();
            });
          },
        },
      })) : '',
    ];
  }

  view({ attrs: { title, filePrefix } }) {
    return m(Card, {
      style: { height: '400px', 'margin-bottom': '10px' },
      content: m('div', [
        m(Toolbar, { compact: true }, [
          m(ToolbarTitle, { text: title }),
          m(Button, {
            className: 'blue-button',
            borders: true,
            label: 'export CSV',
            events: { onclick: () => this.exportAsCSV(filePrefix) },
          }),
        ]),
        m(TableView, {
          tableHeight: '275px',
          controller: this.ctrl,
          tileContent: data => this.itemRow(data),
          clickOnRows: false,
          titles: [
            { text: 'Date of Signup', width: '9em' },
            { text: 'Participant', width: '16em' },
            { text: 'Additional Info', width: '16em' },
          ],
        }),
      ]),
    });
  }
}

export default class viewEvent extends ItemView {
  constructor(vnode) {
    super(vnode);
    this.signupHandler = new ResourceHandler('eventsignups');
    this.signupCtrl = new DatalistController((query, search) => this.signupHandler.get({
      search, ...query,
    }));
    this.description = false;
    this.advertisement = false;
    this.registration = false;
    this.allParticipants = [];
    this.modalDisplay = Stream('none');
  }

  oninit() {
    this.signupCtrl.setQuery({ where: { event: this.data._id } });
    this.signupCtrl.getFullList().then((list) => { this.allParticipants = list; });
  }

  cloneEvent() {
    const event = Object.assign({}, this.data);

    const eventInfoToDelete = [
      '_id',
      '_created',
      '_etag',
      '_links',
      '_updated',
      'signup_count',
      'unaccepted_count',
      '__proto__',
    ];
    const now = new Date();
    if (event.time_end < `${now.toISOString().slice(0, -5)}Z`) {
      eventInfoToDelete.push(...[
        'time_advertising_end',
        'time_advertising_start',
        'time_end',
        'time_register_end',
        'time_register_end',
        'time_register_start',
        'time_start']);
    }
    eventInfoToDelete.forEach((key) => {
      delete event[key];
    });

    this.controller.changeModus('new');
    this.controller.data = event;
  }

  view() {
    let displaySpots = '-';
    const stdMargin = { margin: '5px' };

    // Get the image and insert it inside the modal -
    // use its "alt" text as a caption
    const modalImg = document.getElementById('modalImg');

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
        (this.data.spots !== null && 'signup_count' in this.data
         && this.data.signup_count !== null) ?
          m(Property, {
            style: stdMargin,
            title: 'Signups',
          }, `${this.data.signup_count} / ${displaySpots}`) : '',
        this.data.location && m(Property, {
          style: stdMargin,
          title: 'Location',
        }, `${this.data.location}`),
        this.data.time_start && m(Property, {
          title: 'Time',
          style: stdMargin,
        }, `${dateFormatter(this.data.time_start)} - ${dateFormatter(this.data.time_end)}`),
        this.data.moderator && m(Property, {
          title: 'Moderator',
          style: stdMargin,
        }, m.trust(`${this.data.moderator.firstname} ${this.data.moderator.lastname}
         (<a href='mailto:${this.data.moderator.email}'>${this.data.moderator.email}</a>)`)),
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
              m(Chip, {
                svg: this.data.show_annonce ? icons.checked : icons.clear,
                border: '1px #aaaaaa solid',
              }, 'announce'),
              m(Chip, {
                svg: this.data.show_infoscreen ? icons.checked : icons.clear,
                border: '1px #aaaaaa solid',
                margin: '4px',
              }, 'infoscreen'),
              m(Chip, {
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
          this.data.spots !== null ? m(DropdownCard, {
            title: 'Participants Summary',
            style: { margin: '10px 0' },
          }, m(ParticipantsSummary, {
            participants: this.allParticipants,
            additionalFields: this.data.additional_fields,
          })) : '',

          m(DropdownCard, { title: 'Images' }, [
            m('div', {
              style: {
                display: 'flex',
              },
            }, [
              m('div', {
                style: {
                  width: '40%',
                  padding: '5px',
                },
              }, [
                this.data.img_poster && m('div', 'Poster'),
                this.data.img_poster && m('img', {
                  src: `${apiUrl}${this.data.img_poster.file}`,
                  width: '100%',
                  onclick: () => {
                    this.modalDisplay('block');
                    modalImg.src = `${apiUrl}${this.data.img_poster.file}`;
                  },
                }),
              ]),
              m('div', {
                style: {
                  width: '52%',
                  padding: '5px',
                },
              }, [
                m('div', [
                  this.data.img_infoscreen && m('div', 'Infoscreen'),
                  this.data.img_infoscreen && m('img', {
                    src: `${apiUrl}${this.data.img_infoscreen.file}`,
                    width: '100%',
                    onclick: () => {
                      this.modalDisplay('block');
                      modalImg.src = `${apiUrl}${this.data.img_infoscreen.file}`;
                    },
                  }),
                ]),
              ]),
            ]),
          ]),
        ]),
        m('div.viewcontainercolumn', { style: { width: '50em' } }, [
          this.data.time_register_start ? m(ParticipantsTable, {
            where: { accepted: true, event: this.data._id },
            title: 'Accepted Participants',
            filePrefix: 'accepted',
            additional_fields_schema: this.data.additional_fields,
          }) : '',
          this.data.time_register_start ? m(ParticipantsTable, {
            where: { accepted: false, event: this.data._id },
            title: 'Participants on Waiting List',
            filePrefix: 'waitinglist',
            additional_fields_schema: this.data.additional_fields,
          }) : '',
        ]),
      ]),
      m('div', {
        id: 'imgModal',
        style: {
          display: this.modalDisplay(),
          position: 'fixed',
          'z-index': '100',
          'padding-top': '100px',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'auto',
          'background-color': 'rgba(0, 0, 0, 0.9)',
        },
      }, [
        m('img', {
          id: 'modalImg',
          style: {
            margin: 'auto',
            display: 'block',
            'max-width': '80vw',
            'max-heigth': '80vh',
          },
        }),
        m('div', {
          onclick: () => {
            this.modalDisplay('none');
          },
          style: {
            top: '15px',
            right: '35px',
            color: '#f1f1f1',
            transition: '0.3s',
            'z-index': 10,
            position: 'absolute',
            'font-size': '40px',
            'font-weight': 'bold',
          },
        }, 'x'),
      ]),
    ], [
      m(Button, {
        label: 'Clone Event',
        border: true,
        style: {
          color: colors.light_blue,
          'border-color': colors.light_blue,
        },
        events: {
          // opens 'new event' ,
          // coping All information but the 'event_id',  past dates and API generated properties
          onclick: () => this.cloneEvent(),
        },
      }),
    ]);
  }
}
