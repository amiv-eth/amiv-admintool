import m from 'mithril';
import viewEvent from './viewEvent';
import newEvent from './newEvent';

export default class EventModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(newEvent, { onfinish: () => { this.edit = false; m.redraw(); } });
    }
    return m(viewEvent, { onEdit: () => { this.edit = true; } });
  }
}
