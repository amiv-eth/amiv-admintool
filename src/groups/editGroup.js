import m from 'mithril';
import { TextField } from 'polythene-mithril';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import SelectList from '../views/selectList';
import { MDCSelect } from '../views/selectOption';
import DatalistController from '../listcontroller';
import EditView from '../views/editView';


/**
 * Table of all possible permissions to edit
 *
 * @class      PermissionEditor (name)
 */
class PermissionEditor {
  oninit() {
    // load all possible API endpoints, as permissions are defined at endpoint/resource level
    m.request(apiUrl).then((response) => {
      this.apiEndpoints = response._links.child;
    });
  }

  /**
   *
   * @attr       {object}  permissions the permissions as defined so far for the group
   * @attr       {function}  onChange  is called with the changed permissions any timne the
   *                                   permissions are changed in this editor.
   */
  view({ attrs: { permissions, onChange } }) {
    // make a local copy of permissions to edit
    const internalPerm = Object.assign({}, permissions);

    if (!this.apiEndpoints) return '';
    return m('div', [
      m('span', {
        style: {
          color: 'rgba(0, 0, 0, 0.54)',
          'font-size': '10pt',
        },
      }, 'Permissions granted by membership in this group'),
      m('div', {
        style: {
          padding: '10px',
          border: '1px solid rgba(0, 0, 0, 0.54)',
          'border-radius': '10px',
        },
      }, m('div', {
        style: { display: 'flex', width: '100%', 'flex-flow': 'row wrap' },
      }, this.apiEndpoints.map(apiEndpoint => m('div', {
        style: { display: 'flex', width: '330px', 'padding-right': '20px' },
      }, [
        m(TextField, {
          label: apiEndpoint.title,
          disabled: true,
          style: { width: '60%' },
        }),
        m('div', { style: { width: '40%' } }, m(MDCSelect, {
          name: apiEndpoint.href,
          options: ['no permission', 'read', 'readwrite'],
          onchange: (newVal) => {
            if (newVal === 'no permission') {
              // the api equivalent to no permission if to delete the key out of the dict
              if (internalPerm[apiEndpoint.href]) delete internalPerm[apiEndpoint.href];
            } else {
              internalPerm[apiEndpoint.href] = newVal;
            }
            onChange(internalPerm);
          },
          value: internalPerm[apiEndpoint.href],
        })),
      ])))),
    ]);
  }
}


export default class NewGroup extends EditView {
  constructor(vnode) {
    super(vnode);
    this.userController = new DatalistController(
      'users', {},
      ['firstname', 'lastname', 'email', 'nethz'],
    );
    console.log(this.data);
  }

  beforeSubmit() {
    // exchange moderator object with string of id
    const { moderator } = this.data;
    if (moderator) { this.data.moderator = `${moderator._id}`; }
    this.submit();
  }

  view() {
    return this.layout([
      ...this.renderPage({
        name: { type: 'text', label: 'Group Name' },
        allow_self_enrollment: {
          type: 'checkbox',
          label: 'the group can be seen by all users and they can subscribe themselves',
        },
        requires_storage: {
          type: 'checkbox',
          label: "the group shares a folder with it's members in the AMIV Cloud",
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
      m(PermissionEditor, {
        permissions: this.data.permissions,
        onChange: (newPermissions) => { this.data.permissions = newPermissions; },
      }),
    ]);
  }
}
