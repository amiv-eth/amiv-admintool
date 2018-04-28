import Ajv from 'ajv';
import ItemView from './itemView';
import { apiUrl } from '../config.json';
import { Checkbox } from 'polythene-mithril';
import { textInput, datetimeInput, numInput } from './elements';

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
  /* Extension of ItemView to edit a data item
   *
   * Requires:
   * - call constructor with vnode, resource, (valid, true by default)
   * - vnode.attrs.onfinish has to be a callback function that is called after
   *   the edit is finished
   *
   * Provides Methods:
   * - bind(attrs): binds a form-field against this.data
   * - submit
   */
  constructor(vnode, resource, embedded, valid = true) {
    super(resource, embedded);
    this.changed = false;
    this.resource = resource;

    // state for validation
    this.valid = valid;
    this.ajv = new Ajv({
      missingRefs: 'ignore',
      errorDataPath: 'property',
      allErrors: true,
    });
    this.errors = {};
    this.data = {};

    // callback when edit is finished
    this.callback = vnode.attrs.onfinish;
  }

  oninit() {
    // if this.id is set, this is an edit view of an existing event.
    // Therefore, we load the current state of the event from the API.
    if (this.id) {
      this.handler.getItem(this.id, this.embedded).then((item) => {
        this.data = item;
        m.redraw();
      });
    }
    // load schema
    m.request(`${apiUrl}/docs/api-docs`).then((schema) => {
      const objectSchema = schema.definitions[
        objectNameForResource[this.resource]];
      // console.log(objectSchema);
      // filter out any field that is of type media and replace with type
      // object
      Object.keys(objectSchema.properties).forEach((property) => {
        if (objectSchema.properties[property].type === 'media' ||
            objectSchema.properties[property].type === 'json_schema_object') {
          objectSchema.properties[property].type = 'object';
        }
      });
      // delete objectSchema.properties['_id'];
      console.log(this.ajv.addSchema(objectSchema, 'schema'));
    }).catch((error) => { console.log(error); });
  }

  // bind form-fields to the object data and validation
  bind(attrs) {
    // initialize error-list for every bound field
    if (!this.errors[attrs.name]) this.errors[attrs.name] = [];

    const boundFormelement = {
      onChange: (name, value) => {
        this.changed = true;
        // bind changed data
        this.data[name] = value;

        console.log(this.data);

        // validate against schema
        const validate = this.ajv.getSchema('schema');
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
      },
      getErrors: () => this.errors[attrs.name],
      value: this.data[attrs.name],
    };
    // add the given attributes
    Object.keys(attrs).forEach((key) => { boundFormelement[key] = attrs[key]; });

    return boundFormelement;
  }

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
        field.onChange = (state) => {
          this.data[key] = state.checked;
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

  submit() {
    if (Object.keys(this.data).length > 0) {
      let request;
      if (this.id) {
        // if id is known, this is a patch to an existing item
        request = this.handler.patch(this.data);
      } else {
        request = this.handler.post(this.data);
      }
      request.then((response) => {
        this.callback(response);
      }).catch((error) => {
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
      this.callback();
    }
  };
}
