import m from 'mithril';
import { DatalistController } from 'amiv-web-ui-components';
import TableView from '../views/tableView';
import { dateFormatter } from '../utils';
import { ResourceHandler } from '../auth';


/* Table of all current Jobs
 *
 * Makes use of the standard TableView
 */


export default class JobTable {
  constructor() {
    this.handler = new ResourceHandler('joboffers');
    this.ctrl = new DatalistController((query, search) => this.handler.get({ search, ...query }));
  }

  getItemData(data) {
    return [
      m('div', { style: { width: 'calc(100% - 30em)' } }, data.title_de || data.title_en),
      m('div', { style: { width: '21em' } }, data.company),
      m('div', { style: { width: '9em' } }, dateFormatter(data.time_end)),
    ];
  }

  view(data) {
    return m(TableView, {
      controller: this.ctrl,
      keys: [(data.title_de) ? 'title_de' : 'title_en', 'company', 'time_end'],
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
