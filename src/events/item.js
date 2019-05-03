import m from 'mithril';
import viewEvent from './viewEvent';
import editEvent from './editEvent';
import ItemController from '../itemcontroller';
import { loadingScreen } from '../layout';

export default class EventItem {
  constructor() {
    this.controller = new ItemController('events', { moderator: 1 });
  }

  view() {
    if (!this.controller || (!this.controller.data && this.controller.modus !== 'new')) {
      return m(loadingScreen);
    }
    if (this.controller.modus !== 'view') return m(editEvent, { controller: this.controller });
    return m(viewEvent, { controller: this.controller });
  }
}
