import m from 'mithril';
import { Checkbox, Button, Card, TextField, IconButton, Toolbar, ToolbarTitle } from 'polythene-mithril';
import ItemView from '../views/itemView';
import { events as config, eventsignups as signupConfig } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';
import { icons } from '../views/elements';
import { styler } from 'polythene-core-css';

const viewLayout = [
    {
        '.eventViewContainer': {
            display: 'grid',
            'grid-template-columns': '50% 50%',
            'grid-gap': '50px',
        },
        '.eventViewLeft': {
            'grid-column': 1,
        },
        '.eventViewRight': {
            'grid-column': 2,
        }
    }
];
styler.add('eventView', viewLayout);


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

export default class viewEvent extends ItemView {
    constructor() {
        super('events');
        this.details = false;
        this.waitlist = false;
        this.emailAdresses = false;
    }

    view() {
        if (!this.data) return '';
        console.log(Object.keys(this));
        console.log(this['data']);

        let displayCatchphraseDe = null;
        let displayCatchphraseEn = null;
        let displayDescriptionDe = null;
        let displayDescriptionEn = null;
        let displayPriority = null;

        if(this.data.catchphrase_de) {
            displayCatchphraseDe = m("t3", {class: "text"}, this.data.catchphrase_de);
        }

        if(this.data.catchphrase_en) {
            displayCatchphraseEn = m("t3", {class: "text"}, this.data.catchphrase_en);
        }

        if(this.data.description_de) {
            displayDescriptionDe = m("t3", {class: "text"}, this.data.description_de);
        }

        if(this.data.description_en) {
            displayDescriptionEn = m("t3", {class: "text"}, this.data.description_en);
        }

        if(this.data.priority) {
            displayPriority = m("t3", {class: "text"}, this.data.priority);
        }

        let displayDetailsButton = m(Toolbar, { compact: true, events: { onclick: () => this.details = !this.details } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "details" }),
        ]);
        let displayWaitlistButton = m(Toolbar, { compact: true, events: { onclick: () => this.waitlist = !this.waitlist } }, [
            m(IconButton, { icon: { svg: m.trust(icons.ArrowRight) } }),
            m(ToolbarTitle, { text: "waitlist" }),
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
                content: [
                    {
                        primary: {
                            title: "Catchphrase DE",
                            subtitle: displayCatchphraseDe
                        }
                    },
                    {
                        primary: {
                            title: "Catchphrase EN",
                            subtitle: displayCatchphraseEn
                        }
                    },
                    {
                        any: {
                            content: this.data.time_start ? m('p', m('strong', `when: from ${dateFormatter(this.data.time_start)} to ${dateFormatter(this.data.time_end)}`)) : '',
                        },
                    },
                    {
                        any: {
                            content: this.data.location ? m('p', m('strong', `where: ${this.data.location}`)) : '',
                        }
                    },
                    {
                        primary: {
                            title: "Description DE",
                            subtitle: displayDescriptionDe
                        }
                    },

                    {
                        primary: {
                            title: "Description EN",
                            subtitle: displayDescriptionEn
                        }
                    },
                    {
                        primary: {
                            title: "Priority",
                            subtitle: displayPriority
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }

        if (this.waitlist) {
            displayWaitlistButton = m(Toolbar, { compact: true, events: { onclick: () => this.waitlist = !this.waitlist } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "waitlist" }),
            ]);
            displayWaitlist = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Primary title",
                            subtitle: "Subtitle"
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }

        if (this.emailAdresses) {
            displayEmailAdressesButton = m(Toolbar, { compact: true, events: { onclick: () => this.emailAdresses = !this.emailAdresses } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "email adresses" }),
            ]);
            displayEmailAdresses = m(Card, {
                content: [
                    {
                        primary: {
                            title: "Primary title",
                            subtitle: "Subtitle"
                        }
                    },
                    {
                        actions: {
                            content: [
                                m(Button, {
                                    label: "Action 1"
                                }),
                                m(Button, {
                                    label: "Action 2"
                                })
                            ]
                        }
                    },
                    {
                        text: {
                            content: "More text"
                        }
                    }
                ]

            })
        }


        return m("div", {
            style: { height: '100%', 'overflow-y': 'scroll'}
            },[
            m("h1", {class: "title"}, this.data.title_de),
            m(Button, {element: 'div', label: "Update Event"}),

            m('div.eventViewContainer', [
               m('div.eventViewLeft', [
                   displayDetailsButton,
                   displayDetails,

                   displayWaitlistButton,
                   displayWaitlist,

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
