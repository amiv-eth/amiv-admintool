import m from 'mithril';
import viewGroup from './viewGroup';
import newGroup from './newGroup';
import ItemTool from '../views/itemTool';

export default class GroupTool extends ItemTool {
  constructor() {
    super('groups', { moderator: 1 });
  }

  detailView() {
    return m(viewGroup, { handler: this.handler, data: this.data });
  }

  editView() {
    return m(newGroup, { onCancel: () => { this.modus = 'view'; } });
  }
}
