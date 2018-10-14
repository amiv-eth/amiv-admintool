import m from 'mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { studydocuments as config } from '../resourceConfig.json';
import TableView from '../views/tableView';
import { dateFormatter } from '../utils';
import { ResourceHandler } from '../auth';


/* Table of all studydocuments */
export default class StudydocTable {
  constructor() {
    this.handler = new ResourceHandler('studydocuments', config.tableKeys);
    this.ctrl = new DatalistController((query, search) => this.handler.get({ search, ...query }));
  }

  getItemData(data) {
    return [
      m('div', { style: { width: 'calc(100% - 30em)' } }, data.title),
      m('div', { style: { width: '6em' } }, data.department.toUpperCase()),
      m('div', { style: { width: '6em' } }, data.semester),
      m('div', { style: { width: '18em' } }, data.lecture),
    ];
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      tileContent: this.getItemData,
      titles: [
        { text: 'Titel', width: 'calc(100% - 30em)' },
        { text: 'Department', width: '6em' },
        { text: 'Semester', width: '6em' },
        { text: 'Lecture', width: '18em' },
      ],
      onAdd: () => { m.route.set('/newstudydocument'); },
    });
  }
}
