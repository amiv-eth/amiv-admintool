import m from 'mithril';
import { TextField } from 'polythene-mithril';
import SelectList from '../views/selectList';
import DatalistController from '../listcontroller';
import { EditView, EditLayout } from '../views/editView';


export default class NewGroup extends EditView {
  constructor(vnode) {
    super(vnode, 'groups', { moderator: 1 });
    this.userController = new DatalistController(
      'users', {},
      ['firstname', 'lastname', 'email', 'nethz'],
    );
  }

  view({ attrs: { onCancel = () => {} }}) {
    if (!this.data) return '';
    return m(EditLayout, {
      title: 'Edit Group',
      onSubmit: () => {
        // excahgne moderator object with string of id
        const { moderator } = this.data;
        if (moderator) { this.data.moderator = `${moderator._id}`; }
        this.submit();
      },
      onCancel,
    }, m('div.mywrapper', [
      m('h3', 'Add a New Group'),
      ...this.renderPage({
        name: { type: 'text', label: 'Group Name' },
        allow_self_enrollment: {
          type: 'checkbox',
          label: 'the group can be seen by all users and they can subscribe themselves',
        },
      }),
      m('div', { style: { display: 'flex' } }, [
        m(TextField, { label: 'Group Moderator: ', disabled: true, style: { width: '160px' } }),
        m('div', { style: { 'flex-grow': 1 } }, m(SelectList, {
          controller: this.userController,
          selection: this.data.moderator,
          listTileAttrs: user => Object.assign({}, { title: `${user.firstname} ${user.lastname}` }),
          selectedText: user => `${user.firstname} ${user.lastname}`,
          onSelect: (data) => {
            if (data) {
              this.data.moderator = data;
            } else if (this.data.moderator) {
              delete this.data.moderator;
            }
          },
        })),
      ]),
    ]));
  }
}
