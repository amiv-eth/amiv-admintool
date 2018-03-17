import m from 'mithril';
import EditView from '../views/editView';


export default class newEvent extends EditView {
  constructor(vnode) {
    super(vnode, 'events');
  }

  view() {
    return m('h1', 'Hello World');
  }
}
