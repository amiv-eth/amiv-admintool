import m from 'mithril';
import {
  Switch,
  Button,
  Card,
  TextField,
  IconButton,
  Toolbar,
  ToolbarTitle,
} from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import ItemView from '../views/itemView';
import { eventsignups as signupConfig } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';
import { icons } from '../views/elements';
import { ResourceHandler } from '../auth';

const viewLayout = [
  {
    '.eventViewContainer': {
      display: 'grid',
      'grid-template-columns': '40% 60%',
      'grid-gap': '50px',
    },
    '.eventViewLeft': {
      'grid-column': 1,
    },
    '.eventViewRight': {
      'grid-column': 2,
    },
    '.eventViewRight h4': {
      'margin-top': '2px',
    },
  },
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
  }

  oninit() {
    this.handler.getItem(this.id, this.embedded).then((item) => {
      this.data = item;
      m.redraw();
    });
    this.setUpEmailList(this.showAllEmails);
  }

  setUpEmailList(showAll) {
    if (!showAll) {
      this.signupHandler.get({ where: { accepted: true } }).then((data) => {
        this.emaillist = (data._items.map(item => item.email));
        m.redraw();
      });
    } else {
      this.signupHandler.get({}).then((data) => {
        this.emaillist = (data._items.map(item => item.email));
        m.redraw();
      });
    }
  }

    view() {
        if (!this.data) return '';

        let displayCatchphrase = null;
        let displayDescription = null;
        let displayPriority = null;

        if(this.data.catchphrase_de && this.data.catchphrase_en) {
            displayCatchphrase = m("t3", {class: "text"}, "de: " + this.data.catchphrase_de + " / en: " + this.data.catchphrase_en);
        } else if(this.data.catchphrase_de) {
            displayCatchphrase = m("t3", {class: "text"}, "de: " + this.data.catchphrase_de);
        } else if(this.data.catchphrase_en) {
            displayCatchphrase = m("t3", {class: "text"}, "en: " + this.data.catchphrase_en);
        }

        if(this.data.description_de && this.data.description_en) {
            displayDescription = m("t3", {class: "text"}, "de: " + this.data.description_de + " / en: " + this.data.description_en);
        } else if(this.data.catchphrase_de) {
            displayDescription = m("t3", {class: "text"}, "de: " + this.data.description_de);
        } else if(this.data.catchphrase_en) {
            displayDescription = m("t3", {class: "text"}, "en: " + this.data.description_en);
        }

        if(this.data.priority) {
            displayPriority = m("t3", {class: "text"}, this.data.priority);
        }

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
                content: [
                    {
                        primary: {
                            title: "Catchphrase",
                            subtitle: displayCatchphrase,
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
                            title: "Description",
                            subtitle: displayDescription
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


        if (this.emailAdresses) {
            displayEmailAdressesButton = m(Toolbar, { compact: true, events: { onclick: () => this.emailAdresses = !this.emailAdresses } }, [
                m(IconButton, { icon: { svg: m.trust(icons.ArrowDown) } }),
                m(ToolbarTitle, { text: "email adresses" }),
            ]);
            displayEmailAdresses = m(Card, {
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


        return m('div', {
            style: { height: '100%', 'overflow-y': 'scroll'},
            }, [
            m("h1", this.data.title_de || this.data.title_en),
            m(Button, {element: 'div', label: "Update Event"}),

            m('div.eventViewContainer', [
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
