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
      m('div', { style: { width: 'calc(100% - 32em)' } }, data.title),
      m('div', { style: { width: '6em' } }, data.department.toUpperCase()),
      m('div', { style: { width: '6em' } }, data.semester),
      m('div', { style: { width: '10em' } }, data.lecture),
      m('div', { style: { width: '10em' } }, data.files.map((file) => {
        const splitted_filenames = file.name.split('.');
        return '.' + splitted_filenames[splitted_filenames.length - 1] + ' ';
      })),
    ];
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      tileContent: this.getItemData,
      titles: [
        { text: 'Titel', width: 'calc(100% - 33em)' },
        { text: 'Department', width: '6em' },
        { text: 'Semester', width: '6em' },
        { text: 'Lecture', width: '10em' },
        { text: 'Files', width: '10em' },
      ],
      onAdd: () => { m.route.set('/newstudydocument'); },
    });
  }
}
