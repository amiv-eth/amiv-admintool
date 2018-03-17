import Ajv from 'ajv';
import ItemView from './itemView';
import { getSession } from '../auth';
import { apiUrl } from '../config.json';

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

    // state for validation
    this.valid = valid;
    this.ajv = new Ajv({
      missingRefs: 'ignore',
      errorDataPath: 'property',
      allErrors: true,
    });
    this.errors = {};

    // callback when edit is finished
    this.callback = vnode.attrs.onfinish;
  }

  oninit() {
    if (this.id) {
      // load data for item
      this.handler.getItem(this.id, this.embedded).then((item) => {
        this.data = item;
        m.redraw();
      });
    }
    // load schema
    m.request(`${apiUrl}docs/api-docs`).then((schema) => {
      const objectSchema = schema.definitions[
        objectNameForResource[this.resource]];
      this.ajv.addSchema(objectSchema, 'schema');
    });
  }

  // bind form-fields to the object data and validation
  bind(attrs) {
    // initialize error-list for every bound field
    if (!this.errors[attrs.name]) this.errors[attrs.name] = [];

    const boundFormelement = {
      onchange: (e) => {
        this.changed = true;
        // bind changed data
        this.data[e.target.name] = e.target.value;

        // validate against schema
        const validate = this.ajv.getSchema('schema');
        this.valid = validate(this.data);
        console.log(validate.schema);

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

  submit(method) {
    return () => {
      if (this.changed) {
        let request;
        if (method === 'POST') {
          request = this.handler.post(this.data);
        } else if (method === 'PATCH') {
          request = this.handler.patch(this.data);
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
          } else if (response.status === 403) {
            // Unauthorized
            m.route.set('/login');
          } else {
            console.log(error);
          }
        });
      } else {
        this.callback();
      }
    };
  }
}
