import m from 'mithril';
import viewDoc from './viewDoc';
import editDoc from './editDoc';
import ItemController from '../itemcontroller';
import { loadingScreen } from '../layout';

export default class studydocItem {
  constructor() {
    this.controller = new ItemController('studydocuments');
  }

  view() {
    if (!this.controller || !this.controller.data) return m(loadingScreen);
    if (this.controller.modus !== 'view') return m(editDoc, { controller: this.controller });
    return m(viewDoc, { controller: this.controller });
  }
}
