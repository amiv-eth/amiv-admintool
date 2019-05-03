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
  groupmemberships: 'Group Membership',
  groups: 'Group',
  eventsignups: 'Event Signup',
  events: 'Event',
  studydocuments: 'Study Document',
  joboffers: 'Job Offer',
  blacklist: 'Blacklist',
};

export default class EditView extends ItemView {
  /**
   * Extension of ItemView to edit a data item
   *
   * Requires:
   * - call constructor with vnode, resource, (valid, false by default)
   * - vnode.attrs.onfinish has to be a callback function that is called after
   *   the edit is finished
   * @param  {object} vnode   [as provided by mithril]
   * @param  {string} resource  [the API resource of this view, e.g. 'events']
   * @param  {object} embedded  [any embedding query that should be added
   *                             to API requests for this resource]
   */
  constructor(vnode) {
    super(vnode);
    // the form is valid in case that the item controller is in edit mode
    const validInitially = this.controller.modus === 'edit';
    // start a form to collect the submit data
    this.form = new Form({}, validInitially, 4, Object.assign({}, this.controller.data));
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
  submit(data) {
    return new Promise((resolve, reject) => {
      let request;
      if (this.controller.modus === 'edit') {
        // this is a patch to an existing item
        request = this.controller.patch(data);
      } else {
        request = this.controller.post(data);
      }
      request.then((response) => {
        resolve(response);
      }).catch((error) => {
        console.log(error);
        // Process the API error
        if ('_issues' in error) {
          // there are problems with some fields, display them
          Object.keys(error._issues).forEach((field) => {
            this.form.errors[field] = [error._issues[field]];
            this.form.valid = false;
          });
          console.log(this.form.errors);
          m.redraw();
          reject(error);
        } else {
          console.log(error);
        }
      });
    });
  }

  beforeSubmit() {
    if (Object.keys(this.form.data).length > 0) {
      this.submit(this.form.data);
    } else {
      this.controller.changeModus('view');
    }
  }

  layout(children, buttonLabel = 'submit', wrapInContainer = true) {
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
          extraWide: true,
          label: buttonLabel,
          disabled: !this.form.valid,
          events: { onclick: () => { this.beforeSubmit(); } },
        }),
      ]),
      ...!this.form.schema ? [''] : [
        wrapInContainer && m('div.maincontainer', {
          style: { height: 'calc(100vh - 130px)', 'overflow-y': 'scroll', padding: '10px' },
        }, children),
        !wrapInContainer && children,
      ],
    ]);
  }
}
