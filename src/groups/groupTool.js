import m from 'mithril';
import viewGroup from './viewGroup';
import newGroup from './newGroup';

export default class GroupView {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(newGroup, { onfinish: () => { this.edit = false; m.redraw(); } });
    }
    return m(viewGroup, { onEdit: () => { this.edit = true; } });
  }
}
