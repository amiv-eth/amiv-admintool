import m from 'mithril';
import viewGroup from './viewGroup';
import newGroup from './newGroup';

export default class EventModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(newGroup);
    }
    return m(viewGroup, { onEdit: () => { this.edit = true; } });
  }
}
