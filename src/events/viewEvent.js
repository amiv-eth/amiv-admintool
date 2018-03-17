import m from 'mithril';
import { Checkbox, Button, Card, TextField } from 'polythene-mithril';
import ItemView from '../views/itemView';
import { events as config, eventsignups as signupConfig } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';


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
    this.showParticipants = false;
  }

  view() {
    if (!this.data) return '';
    console.log(this.data);


    const navigation = m('nav', m('ul', [m('li', 'event overview'), m('li', 'participants'), m('li', 'something')]));

    function edit() {
      alert('edit event...');
    }
    const editEventButton = m('div', m(Button, {
      label: 'edit event',
      events: {
        onclick: () => edit(),
      },
    }));

    const showParticipantsButton = m('div', m(Button, {
      label: `display participants ${this.showParticipants ? '>' : '<'}`,
      events: {
        onclick: () => {
          this.showParticipants = !this.showParticipants;
        },
      },
    }));

    return m('main', { style: { height: '100%', overflow: 'scroll' } }, [navigation,
      m('h1', { class: 'title' }, 'Event overview'),
      m('h3', m('em', this.data.title_en)),
      this.data.time_start ? m('p', m('strong', `when: from ${dateFormatter(this.data.time_start)} to ${dateFormatter(this.data.time_end)}`)) : '',
      this.data.location ? m('p', m('strong', `where: ${this.data.location}`)) : '',
      editEventButton,
      m('h1', { class: 'title' }, 'Participants'),
      showParticipantsButton,
      this.showParticipants ? m('h4', 'Accepted Participants') : '',
      this.showParticipants ? m(ParticipantsTable, { where: { accepted: true } }) : '',
      this.showParticipants ? m('p', '') : '',
      this.showParticipants ? m('h4', 'Participants on Waiting List') : '',
      this.showParticipants ? m(ParticipantsTable, { where: { accepted: false } }) : '',
    ]);
  }
}
