import m from 'mithril';
import ItemView from '../views/itemView';
import { Property } from '../views/elements';


export default class viewDoc extends ItemView {
  view() {
    const stdMarg = { margin: '5px' };

    return this.layout(m('div.maincontainer', [
      m('h3', {
        style: { 'margin-top': '0px', 'margin-bottom': '0px' },
      }, this.data.title),
      // below the title, most important details are listed
      m('div', { style: { display: 'flex' } }, [
        this.data.lecture && m(Property, {
          title: 'Lecture',
          style: stdMarg,
        }, `${this.data.lecture} ${this.data.department.toUpperCase()}`),
        this.data.semster && m(Property, {
          title: 'Semester',
          style: stdMarg,
        }, this.data.semester),
        this.data.department && !this.data.lecture && m(Property, {
          title: 'Department',
          style: stdMarg,
        }, this.data.department.toUpperCase()),
        this.data.professor && m(Property, {
          title: 'Professor',
          style: stdMarg,
        }, this.data.professor),
        this.data.author && m(Property, {
          title: 'Author',
          style: stdMarg,
        }, this.data.author),
        this.data.uploader && m(Property, {
          title: 'Uploader',
          style: stdMarg,
        }, this.data.uploader),
      ]),
    ]));
  }
}
