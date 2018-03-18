import m from 'mithril';
import { Switch, Button, Card, TextField, IconButton, Toolbar, ToolbarTitle, MaterialDesignSpinner as Spinner } from 'polythene-mithril';
import ItemView from '../views/itemView';
import { events as config, eventsignups as signupConfig } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';
import { icons } from '../views/elements';
import { styler } from 'polythene-core-css';
import {ResourceHandler} from "../auth";

const viewLayout = [
    {
        '.eventViewContainer': {
            display: 'grid',
            'grid-template-columns': '40% 55%',
            'grid-gap': '50px',
        },
        '.propertyTitle': {
            color: 'rgba(0, 0, 0, 0.54)',
        },
        '.propertyText': {
            color: 'rgba(0, 0, 0, 0.87)',
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
            'font-size' : '11px',
        },
        '.eventInfoCard': {
          padding: '10px',
            'font-size': '15sp',
        },
        '.eventViewLeft': {
            'grid-column': 1,
        },
        '.eventViewRight': {
            'grid-column': 2,
        },
        '.eventViewRight h4': {
                'margin-top': '0px',
        }
    }
];
styler.add('eventView', viewLayout);

class PropertyInfo {
    view({ attrs: { title, de, en } }) {
        //const text = '';

        if(de && en) {
            return m('div',
                m('p.propertyTitle', {style: { 'margin-top': '10px', 'margin-bottom': '3px' } }, [title]),
                m('div', [
                    m('div', { className: 'propertyLangIndicator' }, 'DE'),
                    m('p.propertyText', de),
                ]),
                m('div', [
                    m('div', { className: 'propertyLangIndicator' }, 'EN'),
                    m('p.propertyText', en ),
                ]),
            )
        } else if(de) {
            return m('div',
                m('p.propertyTitle', {style: { 'margin-top': '10px', 'margin-bottom': '3px' } }, [title]),
                m('div', [
                    m('div', { className: 'propertyLangIndicator' }, 'DE'),
                    m('p.propertyText', de),
                ]),
            )
        } else if(en) {
            return m('div',
                m('p.propertyTitle', {style: { 'margin-top': '10px', 'margin-bottom': '3px' } }, [title]),
                m('div', [
                    m('div', { className: 'propertyLangIndicator' }, 'EN'),
                    m('p.propertyText', en),
                ]),
            )
        }
    }
}

class ParticipantsTable {
  constructor({ attrs: { where } }) {
    this.ctrl = new DatalistController('eventsignups', {
      embedded: { user: 1 },
      where,
    }, signupConfig.tableKeys);
  }

  getItemData(data) {
    return [
      m('div', { style: { width: '9em' } }, dateFormatter(data._created)),
      m('div', { style: { width: '9em' } }, data.user.lastname),
      m('div', { style: { width: '9em' } }, data.user.firstname),
      m('div', { style: { width: '9em' } }, data.email),
    ];
  }

  view() {

    return m(Card, {
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
        this.details = false;
        this.emailAdresses = false;


        this.emaillist = [''];
        this.showAllEmails = false;
        this.setUpEmailList(this.showAllEmails);
    }

    setUpEmailList(showAll) {
        if (!showAll) {
            this.signupHandler.get({ where: { accepted: true } }).then((data) => {
                this.emaillist = (data._items.map(item => item.email));
            });
        }
        else {
            this.signupHandler.get({}).then((data) => {
                this.emaillist = (data._items.map(item => item.email));
            });
        }
        m.redraw();
    }

    view() {
        if (!this.data) return '';
        console.log(Object.keys(this));
        console.log(this['data']);

        let displayDetailsButton = m(Toolbar, { compact: true, events: { onclick: () => this.details = !this.details } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "details" }),
        ]);
        let displayEmailAdressesButton = m(Toolbar, { compact: true, events: { onclick: () => this.emailAdresses = !this.emailAdresses } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "email adresses" }),
        ]);

        let displayDetails = null;
        let displayWaitlist = null;
        let displayEmailAdresses = null;

        if (this.details) {
            displayDetailsButton = m(Toolbar, { compact: true, events: { onclick: () => this.details = !this.details } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "details" }),
            ]);
            displayDetails = m(Card, {
                className: 'eventInfoCard',
                content: [

                    {
                        any: {
                            content: [
                                m(PropertyInfo, {
                                    title: 'Catchphrase',
                                    de: this.data.catchphrase_de,
                                    en: this.data.catchphrase_en,
                                }),
                            ]
                        }
                    },
                    {
                        any: {
                            content: [
                                m(PropertyInfo, {
                                    title: 'Description',
                                    de: this.data.description_de,
                                    en: this.data.description_en,
                                }),
                            ]

                        }
                    },
                    {
                        any: {
                            content: [
                                this.data.priority ? m('div', {style: { 'margin-top': '10px', 'margin-bottom': '3px' } }, [m('span.propertyTitle', 'Priority')]) : '',
                                this.data.priority ? m('div', m('p.propertyText', ` ${this.data.priority}`)) : '',
                            ]
                        }
                    },
                ]

            })
        }


        if (this.emailAdresses) {
            displayEmailAdressesButton = m(Toolbar, { compact: true, events: { onclick: () => this.emailAdresses = !this.emailAdresses } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "email adresses" }),
            ]);
            displayEmailAdresses = m(Card, {
                className: 'eventInfoCard',
                content: [
                    {
                        any:
                            {
                                content: m(Switch, {
                                    defaultChecked: false,
                                    label: 'show unaccepted',
                                    onChange: () => {
                                        this.showAllEmails = !this.showAllEmails;
                                        this.setUpEmailList(this.showAllEmails);

                                    },
                                }),
                            },
                    },
                    {
                        any:
                            {
                                content: m(EmailList, { list: this.emaillist }),
                            }
                    },
                ],

            });
        }


        return m("div", {
            style: { height: '100%', 'overflow-y': 'scroll', padding: '10px'}
            },[
            m(Button, {element: 'div', label: "Update Event"}),
            m("h1", {style: { 'margin-top': '0px', 'margin-bottom': '0px' } }, [this.data.title_de]),
            m('div', { style: { float: 'left', 'margin-right': '20px'} }, [
                this.data.time_start ? m('div', m('span.propertyTitle', `Time`)) : '',
                this.data.time_start ? m('div', m('p.propertyText', ` ${dateFormatter(this.data.time_start)} to ${dateFormatter(this.data.time_end)}`)) : '',
            ]),
            m('div', [
                this.data.location ? m('div', m('span.propertyTitle', `Location`)) : m.trust('&nbsp;'),
                this.data.location ? m('div', m('p.propertyText', ` ${this.data.location}`)) : ' ',
            ]),

            m('div.eventViewContainer', { style: { 'margin-top': '50px' } }, [
               m('div.eventViewLeft', [

                   displayDetailsButton,
                   displayDetails,

                   displayEmailAdressesButton,
                   displayEmailAdresses,
               ]),
               m('div.eventViewRight', [
                   m('h4', 'Accepted Participants'),
                   m(ParticipantsTable, { where: { accepted: true } }),
                   m('p', ''),
                   m('h4', 'Participants on Waiting List'),
                   m(ParticipantsTable, { where: { accepted: false } }),
               ])
            ]),

        ])
    }
}
