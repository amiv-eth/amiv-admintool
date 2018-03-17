import m from 'mithril';
import { events as config } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';


/* Table of all Events
 *
 * Makes use of the standard TableView
 */


function dateFormatter(datestring) {
  // converts an API datestring into the standard format 01.01.1990, 10:21
  if (!datestring) return '';
  const date = new Date(datestring);
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}


export default class EventTable {
  constructor() {
    this.ctrl = new DatalistController('events', {}, config.tableKeys);
  }

  getItemData(data) {
    return [
      m('div', { style: { width: 'calc(100% - 18em)' } }, data.title_de || data.title_en),
      m('div', { style: { width: '9em' } }, dateFormatter(data.time_start)),
      m('div', { style: { width: '9em' } }, dateFormatter(data.time_end)),
    ];
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      tileContent: this.getItemData,
      titles: [
        { text: 'Titel', width: 'calc(100% - 18em)' },
        { text: 'Start', width: '9em' },
        { text: 'End', width: '9em' },
      ],
      onAdd: () => { m.route.set('/newevent'); },
    });
  }
}
