import Ajv from 'ajv';
import { Checkbox, IconButton, Toolbar, ToolbarTitle, Button } from 'polythene-mithril';
import { apiUrl } from 'networkConfig';
import ItemView from './itemView';
import { textInput, datetimeInput, numInput, icons } from './elements';
import { colors } from '../style';

const m = require('mithril');

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
    this.changed = false;

    // state for validation
    this.valid = valid;
    this.ajv = new Ajv({
      missingRefs: 'ignore',
      errorDataPath: 'property',
      allErrors: true,
    });
    this.errors = {};
    // copy a local version of the controller data to manipulate before submission
    // (changes will therefore not be applied if edit is cancelled)
    this.data = Object.assign({}, this.controller.data);
  }

  oninit() {
    // load schema
    m.request(`${apiUrl}/docs/api-docs`).then((schema) => {
      const objectSchema = schema.definitions[
        objectNameForResource[this.resource]];
      // console.log(objectSchema);
      // filter out any field that is not understood by the validator tool
      Object.keys(objectSchema.properties).forEach((property) => {
        if (objectSchema.properties[property].type === 'media' ||
            objectSchema.properties[property].type === 'json_schema_object') {
          objectSchema.properties[property].type = 'object';
        }
        if (objectSchema.properties[property].format === 'objectid') {
          delete objectSchema.properties[property];
        }
        // translate nullable field from OpenAPI specification to
        // possible type null in jsonschema
        if (objectSchema.properties[property].nullable) {
          objectSchema.properties[property].type = [
            'null',
            objectSchema.properties[property].type,
          ];
        }
      });
      // delete objectSchema.properties['_id'];
      console.log(this.ajv.addSchema(objectSchema, 'schema'));
      this.validate();
    }).catch((error) => { console.log(error); });
  }

  /**
   * bind form-fields to the object data and validation
   *
   * A binded form-field automatically updates this.data and calls validation
   * on the current data state with every change.
   *
   * @param  {object} options for the input element
   * @return {object} modified options passed to the input element
   */
  bind(attrs) {
    // initialize error-list for every bound field
    if (!this.errors[attrs.name]) this.errors[attrs.name] = [];

    const boundFormelement = {
      onChange: (name, value) => {
        this.changed = true;
        // bind changed data
        this.data[name] = value;

        console.log(this.data);

        this.validate();
      },
      getErrors: () => this.errors[attrs.name],
      value: this.data[attrs.name],
    };
    // add the given attributes
    Object.keys(attrs).forEach((key) => { boundFormelement[key] = attrs[key]; });

    return boundFormelement;
  }

  validate() {
    // validate against schema
    const validate = this.ajv.getSchema('schema');
    // sometimes the schema loading does not work or is not finished
    // before the first edit, this is to prevent crashes
    if (validate) {
      this.valid = validate(this.data);
      console.log(validate.errors);
      if (this.valid) {
        Object.keys(this.errors).forEach((field) => {
          this.errors[field] = [];
        });
      } else {
        // get errors for respective fields
        Object.keys(this.errors).forEach((field) => {
          const errors = validate.errors.filter(error =>
            `.${field}` === error.dataPath);
          this.errors[field] = errors.map(error => error.message);
        });
      }
    }
    m.redraw();
  }

  /**
   * Rendering Function to make form descriptions shorter
   *
   * @param  {object} Collection of descriptions for input form fields
   *                  {key: description}
   *                  with key matching the field in this.data
   *                  description containing type in ['text', 'number',
   *                  'checkbox', 'datetime'] and any attributes passed to the
   *                  input element
   * @return {string} mithril rendered output
   */
  renderPage(page) {
    return Object.keys(page).map((key) => {
      const field = page[key];
      if (field.type === 'text') {
        field.name = key;
        field.floatingLabel = true;
        delete field.type;
        return m(textInput, this.bind(field));
      } else if (field.type === 'number') {
        field.name = key;
        field.floatingLabel = true;
        delete field.type;
        return m(numInput, this.bind(field));
      } else if (field.type === 'checkbox') {
        field.checked = this.data[key] || false;
        field.onChange = ({ checked }) => {
          this.data[key] = checked;
        };
        delete field.type;
        return m(Checkbox, field);
      } else if (field.type === 'datetime') {
        field.name = key;
        delete field.type;
        return m(datetimeInput, this.bind(field));
      }
      return `key '${key}' not found`;
    });
  }

  /**
   * Submit the changed version of this.data
   *
   * @param  {Boolean} true if the data should be send as FormData instead of
   *                   JSON. Necessary in cases where files are included in the
   *                   changes.
   */
  submit(formData = false) {
    if (Object.keys(this.data).length > 0) {
      let request;
      if (this.controller.modus === 'edit') {
        // if id is known, this is a patch to an existing item
        request = this.controller.patch(this.data, formData);
      } else {
        request = this.controller.post(this.data);
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
        m(ToolbarTitle, ((this.controller.modus === 'new') ? 'New' : 'Edit') +
          ` ${this.resource.charAt(0).toUpperCase()}${this.resource.slice(1, -1)}`),
        m(Button, {
          className: 'blue-button-filled',
          label: 'submit',
          disabled: !this.valid,
          events: { onclick: () => { this.beforeSubmit(); } },
        }),
      ]),
      m('div.maincontainer', {
        style: { height: 'calc(100vh - 130px)', 'overflow-y': 'scroll', padding: '10px' },
      }, children),
    ]);
  }
}
