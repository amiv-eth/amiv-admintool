import m from 'mithril';
import ItemView from '../views/itemView';


export default class viewEvent extends ItemView {
  constructor() {
    super('events');
  }

  view() {
    return m('h1', 'Hello World');
  }
}
