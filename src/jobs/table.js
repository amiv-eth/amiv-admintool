import m from 'mithril';
import { joboffers as config } from '../resourceConfig.json';
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
      m('div', { style: { width: 'calc(100% - 30em)' } }, data.title_de || data.title_en),
      m('div', { style: { width: '21em' } }, data.company),
      m('div', { style: { width: '9em' } }, dateFormatter(data.time_end)),
    ];
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      tileContent: this.getItemData,
      titles: [
        { text: 'Titel', width: 'calc(100% - 30em)' },
        { text: 'Company', width: '21em' },
        { text: 'End', width: '9em' },
      ],
      onAdd: () => { m.route.set('/newjoboffer'); },
    });
  }
}
