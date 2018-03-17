import m from 'mithril';
import { events as config } from '../config.json';
import TableView from '../views/tableView';
import DatalistController from '../listcontroller';


export default class EventTable {
  constructor() {
    this.ctrl = new DatalistController('events', {}, config.tableKeys);
  }

  view() {
    return m(TableView, {
      controller: this.ctrl,
      keys: config.tableKeys,
      titles: config.tableKeys.map(key => config.keyDescriptors[key] || key),
      onAdd: () => { m.route.set('/newevent'); },
    });
  }
}
