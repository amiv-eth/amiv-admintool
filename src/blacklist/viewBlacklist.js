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
        'div', { style: { width: '14em' } },
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
      m('div', !data.end_time && m(Button, {
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
      // m('div', { style: { width: '9em' } }, dateFormatter(data.time_start)),
      // m('div', { style: { width: '9em' } }, dateFormatter(data.time_end)),
    ];
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: ['user'],
      tileContent: data => this.getItemData(data),
      titles: [
        // { text: 'User', width: '18em' },
        // { text: 'mail', width: '9em' },
        // // { text: 'End', width: '9em' },
      ],
      onAdd: () => { m.route.set('/newblacklistentry'); },
    });
  }
}
