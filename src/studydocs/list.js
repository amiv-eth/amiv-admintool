import m from 'mithril';
import { DatalistController } from 'amiv-web-ui-components';
import { studydocuments as config } from '../resourceConfig.json';
import TableView from '../views/tableView';
import { ResourceHandler } from '../auth';


/* Table of all studydocuments */
export default class StudydocTable {
  constructor() {
    this.handler = new ResourceHandler('studydocuments', config.tableKeys);
    this.ctrl = new DatalistController((query, search) => this.handler.get({ search, ...query }));
  }

  getItemData(data) {
    return [
      m('div', { style: { width: 'calc(100% - 36em)' } }, data.title),
      m('div', { style: { width: '8em' } }, data.author),
      m('div', { style: { width: '4em' } }, data.course_year),
      m('div', { style: { width: '4em' } }, data.semester),
      m('div', { style: { width: '10em' } }, data.lecture),
      m('div', { style: { width: '10em' } }, data.files.map((file) => {
        const splittedFilenames = file.name.split('.');
        return `.${splittedFilenames[splittedFilenames.length - 1]} `;
      })),
    ];
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      tileContent: this.getItemData,
      titles: [
        { text: 'Title', width: 'calc(100% - 36em)' },
        { text: 'Author', width: '8em' },
        { text: 'Year', width: '4em' },
        { text: 'Sem.', width: '4em' },
        { text: 'Lecture', width: '10em' },
        { text: 'Files', width: '10em' },
      ],
      onAdd: () => { m.route.set('/newstudydocument'); },
    });
  }
}
