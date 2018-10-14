import m from 'mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { events as config } from '../resourceConfig.json';
import TableView from '../views/tableView';
import { dateFormatter } from '../utils';
import { ResourceHandler } from '../auth';


/* Table of all Events
 *
 * Makes use of the standard TableView
 */


export default class EventTable {
  constructor() {
    this.handler = new ResourceHandler('events', config.tableKeys);
    this.ctrl = new DatalistController((query, search) => this.handler.get({ search, ...query }));
  }

  getItemData(data) {
    return [
      m('div', { style: { width: 'calc(100% - 18em)' } }, data.title_de || data.title_en),
      m('div', { style: { width: '9em' } }, dateFormatter(data.time_start)),
      m('div', { style: { width: '9em' } }, dateFormatter(data.time_end)),
    ];
  }

  view() {
    const now = new Date();
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      tileContent: this.getItemData,
      titles: [
        { text: 'Titel', width: 'calc(100% - 18em)' },
        { text: 'Start', width: '9em' },
        { text: 'End', width: '9em' },
      ],
      filters: [[{
        name: 'upcoming',
        query: { time_start: { $gte: `${now.toISOString().slice(0, -5)}Z` } },
      }, {
        name: 'past',
        query: { time_start: { $lt: `${now.toISOString().slice(0, -5)}Z` } },
      }]],
      // per default, enable the 'upcoming' filter
      initFilterIdxs: [[0, 0]],
      onAdd: (this.handler.rights.length > 0) ?
        () => {
          if (this.handler.rights.includes('POST')) {
            m.route.set('/newevent');
          } else {
            m.route.set('/proposeevent');
          }
        } : false,
    });
  }
}
