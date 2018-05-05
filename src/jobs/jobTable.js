import m from 'mithril';
import { events as config } from '../resourceConfig.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';
import { dateFormatter } from '../utils';


/* Table of all current Jobs
 *
 * Makes use of the standard TableView
 */


export default class JobTable {
  constructor() {
    this.ctrl = new DatalistController('joboffers', {}, config.tableKeys);
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
      onAdd: () => { m.route.set('/newjob'); },
    });
  }
}
