import m from 'mithril';
import { TextField } from 'polythene-mithril';
import { ListSelect, DatalistController, Select } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import { ResourceHandler } from '../auth';
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
        style: { display: 'flex', width: '220px', 'padding-right': '20px' },
      }, [
        m(Select, {
          label: apiEndpoint.title,
          options: ['no permission', 'read', 'readwrite'],
          default: 'no permission',
          style: { width: '200px' },
          onChange({ value }) {
            if (value === 'no permission') {
              // the api equivalent to no permission is to delete the key out of the dict
              if (internalPerm[apiEndpoint.href]) delete internalPerm[apiEndpoint.href];
            } else internalPerm[apiEndpoint.href] = value;
            onChange(internalPerm);
          },
          value: internalPerm[apiEndpoint.href],
        }),
      ])))),
    ]);
  }
}


export default class NewGroup extends EditView {
  constructor(vnode) {
    super(vnode);
    this.userHandler = new ResourceHandler('users', ['firstname', 'lastname', 'email', 'nethz']);
    this.userController = new DatalistController((query, search) =>
      this.userHandler.get({ search, ...query }));
  }

  beforeSubmit() {
    const { data } = this.form;
    // exchange moderator object with string of id
    this.submit({
      ...data,
      moderator: data.moderator ? data.moderator._id : undefined,
    }).then(() => this.controller.changeModus('view'));
  }

  view() {
    return this.layout([
      ...this.form.renderSchema(['name', 'allow_self_enrollment', 'requires_storage']),
      m('div', { style: { display: 'flex' } }, [
        m(TextField, { label: 'Group Moderator: ', disabled: true, style: { width: '160px' } }),
        m('div', { style: { 'flex-grow': 1 } }, m(ListSelect, {
          controller: this.userController,
          selection: this.form.data.moderator,
          listTileAttrs: user => Object.assign({}, { title: `${user.firstname} ${user.lastname}` }),
          selectedText: user => `${user.firstname} ${user.lastname}`,
          onSelect: (data) => { this.form.data.moderator = data; },
        })),
      ]),
      m(PermissionEditor, {
        permissions: this.form.data.permissions,
        onChange: (newPermissions) => { this.form.data.permissions = newPermissions; },
      }),
    ]);
  }
}
