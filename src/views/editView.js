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
      getSession().then((apiSession) => {
        this.loadItemData(apiSession);
      }).catch(() => {
        m.route.set('/login');
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

  submit(method, fields) {
    return () => {
      if (this.changed) {
        getSession().then((apiSession) => {
          // build request
          const request = { method };
          if (method === 'POST' || method === 'PATCH') {
            // fields like `_id` are not post/patchable
            // We therefore only send patchable fields
            const submitData = {};
            fields.forEach((key) => {
              submitData[key] = this.data[key];
            });
            request.data = submitData;
          }

          // if request is PATCH or DELETE, add If-Match header and set url
          if (method === 'PATCH' || method === 'DELETE') {
            request.headers = { 'If-Match': this.data._etag };
            request.url = `${this.resource}/${this.id}`;
          } else {
            request.url = this.resource;
          }

          apiSession(request).then((response) => {
            this.callback(response);
          }).catch((error) => {
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
        });
      } else {
        this.callback();
      }
    };
  }
}
