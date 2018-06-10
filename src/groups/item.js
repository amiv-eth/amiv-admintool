import m from 'mithril';
import viewGroup from './viewGroup';
import editGroup from './editGroup';
import ItemController from '../itemcontroller';
import { loadingScreen } from '../layout';

export default class GroupItem {
  constructor() {
    this.controller = new ItemController('groups', { moderator: 1 });
  }

  view() {
    if (!this.controller || !this.controller.data) return m(loadingScreen);
    if (this.controller.modus !== 'view') return m(editGroup, { controller: this.controller });
    return m(viewGroup, { controller: this.controller });
  }
}
