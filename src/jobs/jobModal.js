import m from 'mithril';
import viewJob from './viewJob';
import newJob from './newJob';

export default class jobModal {
  constructor() {
    this.edit = false;
  }

  view() {
    if (this.edit) {
      return m(newJob);
    }
    return m(viewJob, { onEdit: () => { this.edit = true; } });
  }
}
