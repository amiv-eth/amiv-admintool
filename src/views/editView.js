import m from 'mithril';
import { IconButton, Toolbar, ToolbarTitle, Button } from 'polythene-mithril';
import { Form } from 'amiv-web-ui-components';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
import ItemView from './itemView';
import { icons } from './elements';
import { colors } from '../style';

// Mapper for resource vs schema-object names
const objectNameForResource = {
  users: 'User',
  groupmembershipds: 'Groupmembership',
  groups: 'Group',
  eventsignups: 'Eventsignup',
  events: 'Event',
};

export default class EditView extends ItemView {
  /**
   * Extension of ItemView to edit a data item
   *
   * Requires:
   * - call constructor with vnode, resource, (valid, true by default)
   * - vnode.attrs.onfinish has to be a callback function that is called after
   *   the edit is finished
   * @param  {object} vnode   [as provided by mithril]
   * @param  {string} resource  [the API resource of this view, e.g. 'events']
   * @param  {object} embedded  [any embedding query that should be added
   *                             to API requests for this resource]
   * @param  {Boolean} valid    [whether the view should be valid before the
   *                             first validation]
   */
  constructor(vnode, valid = true) {
    super(vnode);
    // start a form to collect the submit data
    this.form = new Form({}, valid, Object.assign({}, this.controller.data));
  }

  oninit() {
    // load schema
    m.request(`${apiUrl}/docs/api-docs`).then((schema) => {
      this.form.setSchema(schema.definitions[objectNameForResource[this.resource]]);
    }).catch((error) => { console.log(error); });
  }

  /**
   * Submit the changed version of this.data
   *
   * @param  {Boolean} true if the data should be send as FormData instead of
   *                   JSON. Necessary in cases where files are included in the
   *                   changes.
   */
  submit(formData = false) {
    if (Object.keys(this.form.data).length > 0) {
      let request;
      if (this.controller.modus === 'edit') {
        // if id is known, this is a patch to an existing item
        request = this.controller.patch(this.form.data, formData);
      } else {
        request = this.controller.post(this.form.data);
      }
      request.catch((error) => {
        console.log(error);
        // Process the API error
        const { response } = error;
        if (response.status === 422) {
          // there are problems with some fields, display them
          Object.keys(response.data._issues).forEach((field) => {
            this.errors[field] = [response.data._issues[field]];
          });
          m.redraw();
        } else {
          console.log(error);
        }
      });
    } else {
      this.controller.changeModus('view');
    }
  }

  beforeSubmit() {
    this.submit();
  }

  layout(children) {
    return m('div', { style: { 'background-color': 'white' } }, [
      m(Toolbar, { style: { 'background-color': colors.orange } }, [
        m(IconButton, {
          icon: { svg: { content: m.trust(icons.clear) } },
          events: { onclick: () => { this.controller.cancel(); } },
        }),
        m(ToolbarTitle, `${((this.controller.modus === 'new') ? 'New' : 'Edit')}` +
          ` ${this.resource.charAt(0).toUpperCase()}${this.resource.slice(1, -1)}`),
        m(Button, {
          className: 'blue-button-filled',
          label: 'submit',
          disabled: !this.form.valid,
          events: { onclick: () => { this.beforeSubmit(); } },
        }),
      ]),
      m('div.maincontainer', {
        style: { height: 'calc(100vh - 130px)', 'overflow-y': 'scroll', padding: '10px' },
      }, children),
    ]);
  }
}
