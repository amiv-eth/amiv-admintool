import m from 'mithril';
import viewJob from './viewJob';
import editJob from './editJob';
import ItemController from '../itemcontroller';

export default class jobModal {
  constructor() {
    this.controller = new ItemController('joboffers');
  }

  view() {
    if (!this.controller || !this.controller.data) return '';
    if (this.controller.modus !== 'view') return m(editJob, { controller: this.controller });
    return m(viewJob, { controller: this.controller });
  }
}
