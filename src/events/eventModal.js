import m from 'mithril';
import viewEvent from './viewEvent';
import newEvent from './newEvent';

export default class EventModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(newEvent);
    }
    return m(viewEvent, { onEdit: () => { this.edit = true; } });
  }
}
