import m from 'mithril';
import { Button } from 'polythene-mithril';
import TableView from '../views/tableView';
import { ResourceHandler } from '../auth';
import RelationlistController from '../relationlistcontroller';
import { dateFormatter } from '../utils';

export default class BlacklistTable {
  constructor() {
    this.handler = new ResourceHandler('blacklist');
    this.ctrl = new RelationlistController({
      primary: 'blacklist',
      secondary: 'users',
      query: { sort: [['start_time', -1]] },
    });
  }

  getItemData(data) {
    return [
      m(
        'div', { style: { width: '18em' } },
        m(
          'div', { style: { 'font-weight': 'bold' } },
          `${data.user.firstname} ${data.user.lastname}`,
        ),
        m('div', data.user.email),
      ),
      m(
        'div', { style: { width: 'calc(100%-18em)' } },
        m('div', `From ${dateFormatter(data.start_time, false)}
        ${data.end_time ? ` to ${dateFormatter(data.end_time, false)}` : ''}`),
        m('div', `Reason: ${data.reason}`),
        data.price && m('div', `price: ${data.price}`),
      ),
      m('div', { style: { 'flex-grow': '100' } }),
      m('div', (!data.end_time &&
                this.ctrl.handler.rights.includes('POST')) && m(Button, {
        // Button to mark this entry as resolved
        className: 'blue-row-button',
        borders: false,
        label: 'redeem',
        events: {
          onclick: () => {
            const date = new Date(Date.now());
            const patchdata = Object.assign({}, data);
            delete patchdata.user;
            patchdata.end_time = `${date.toISOString().slice(0, -5)}Z`;
            this.ctrl.handler.patch(patchdata).then(() => {
              this.ctrl.refresh();
              m.redraw();
            });
          },
        },
      })),
    ];
  }

  view() {
    return m(TableView, {
      clickOnRows: false,
      controller: this.ctrl,
      keys: [],
      tileContent: data => this.getItemData(data),
      titles: [
        { text: 'User', width: '18em' },
        { text: 'Detail', width: '9em' },
      ],
      onAdd: (this.ctrl.handler.rights.includes('POST')) ?
        () => { m.route.set('/newblacklistentry'); } : false,
    });
  }
}
