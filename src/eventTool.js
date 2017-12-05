import { ItemView } from './views/itemView';
import { EditView, inputGroup, selectGroup, submitButton } from './views/editView';
import TableView from './views/tableView';
import { Users as config } from './config.json';

const m = require('mithril');

class EventView extends ItemView {
  constructor() {
    super('event');
    this.memberships = [];
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    let comissionBadge = m('span.label.label-important', 'Who is resp of this event?');
    if (this.data.membership === 'kultur') {
      comissionBadge = m('span.label.label-success', 'Kulturi event');
    } else if (this.data.membership === 'eestec') {
      comissionBadge = m('span.label.label-important', 'EESTEC event');
    } else if (this.data.membership === 'limes') {
      comissionBadge = m('span.label.label-warning', 'LIMES event');
    }

    // TODO Question Lio171201:are we missing a "responsible" key?
    const detailKeys = [
      'title_de',
      'email', 'phone', 'rfid',
      'location', 'time_start', 'time_end',
      'show_website', 'catchphrase',
      'time_register_start', 'price', 'allow_email_signup'];

    return m('div', [
      m('h1', `${this.data.title_de}`),
      comissionBadge,
      m('table', detailKeys.map(key => m('tr', [
        m('td.detail-descriptor', config.keyDescriptors[key]),
        m('td', this.data[key] ? this.data[key] : ''),
      ]))),
      m('h2', 'Location'), m('br'),
      m(TableView, {
        resource: 'events',
        keys: ['event.location'],
        query: {
          where: { user: this.id },
          embedded: { group: 1 },
        },
      }),
      m('h2', 'Signups'), m('br'),
      m(TableView, {
        resource: 'events',
        keys: ['event.title_de'],
        query: {
          where: { user: this.id },
          embedded: { event: 1 },
        },
      }),
      m(TableView, {
        resource: '',
      }),
    ]);
  }
}

class EventEdit extends EditView {
  constructor(vnode) {
    super(vnode, 'events');
  }

  getForm() {
    return m('form', [
      m('div.row', [
        m(inputGroup, this.bind({ title: 'Deutscher Titel', name: 'title_de' })),
        m(inputGroup, this.bind({ title: 'English Title', name: 'title_en' })),
        m(inputGroup, this.bind({ title: 'Location', name: 'location' })),
        // m(inputGroup, this.bind({ title: 'Date-start', name: 'datetimepicker1' })),
        // $('#datetimepicker1').datetimepicker();
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'May non-AMIV members register?',
          name: 'allow_email_signup',
          options: [true, false],
        })),
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'Show on the website?',
          name: 'show_website',
          options: [true, false],
        })),
        m(selectGroup, this.bind({
          classes: 'col-xs-6',
          title: 'Piority from 1 to 10?',
          name: 'priority',
          // could be done with array.apply:
          options: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        })),
      ]),
      m('span', JSON.stringify(this.data)),
      m('span', JSON.stringify(this.errors)),
    ]);
  }

  view() {
    // do not render anything if there is no data yet
    if (!this.data) return m.trust('');

    return m('form', [
      this.getForm(),
      m(submitButton, {
        active: this.valid,
        args: {
          onclick: this.submit('PATCH', config.patchableKeys),
          class: 'btn-warning',
        },
        text: 'Update',
      }),
    ]);
  }
}

export class NewEvent extends EventEdit {
  constructor(vnode) {
    super(vnode);
    this.data = {
      title_de: 'Unvollstaendiges Event',
      priority: 7,
      show_website: false,
    };
    this.valid = false;

    // if the creation is finished, UI should switch to new User
    this.callback = (response) => { m.route.set(`/events/${response.data._id}`); };
  }

  view() {
    return m('form', [
      this.getForm(),
      m(submitButton, {
        active: this.valid,
        args: {
          onclick: this.submit('POST', config.patchableKeys),
          class: 'btn-warning',
        },
        text: 'Create',
      }),
    ]);
  }
}

export class EventModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(EventEdit, { onfinish: () => { this.edit = false; m.redraw(); } });
    }
    // else
    return m('div', [
      m('div.btn.btn-default', { onclick: () => { this.edit = true; } }, 'Edit'),
      m('br'),
      m(EventView),
    ]);
  }
}

export class EventTable {
  view() {
    return m(TableView, {
      resource: 'users',
      keys: config.tableKeys,
      titles: config.tableKeys.map(key => config.keyDescriptors[key] || key),
    });
  }
}
