import Ajv from 'ajv';
import { ItemView } from './itemView';
import { getSession } from '../auth';

const m = require('mithril');

// Mapper for resource vs schema-object names
const objectNameForResource = {
  users: 'User',
  groupmembershipds: 'Groupmembership',
  groups: 'Group',
  eventsignups: 'Eventsignup',
  events: 'Event',
};

export class EditView extends ItemView {
  /* Extension of ItemView to edit a data item
   *
   * Requires:
   * - call constructor with vnode, resource, (valid, true by default)
   * - vnode.attrs.onfinish has to be a callback function that is called after
   *   the edit is finished
   *
   * Provides Methods:
   * - bind(attrs): binds a form-field against this.data
   * - patchOnClick: onclick-function for patching
   * - postOnClick: onclick-function for posting
   */
  constructor(vnode, resource, valid = true) {
    super(resource);
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
    m.request('http://amiv-api.ethz.ch/docs/api-docs').then((schema) => {
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
          });
        });
      } else {
        this.callback();
      }
    };
  }
}

export class inputGroup {
  constructor(vnode) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    if (vnode.attrs.getErrors) {
      this.getErrors = vnode.attrs.getErrors;
    }
  }

  view(vnode) {
    // set display-settings accoridng to error-state
    let errorField = null;
    let groupClasses = vnode.attrs.classes ? vnode.attrs.classes : '';
    const errors = this.getErrors();
    if (errors.length > 0) {
      errorField = m('span.help-block', `Error: ${errors.join(', ')}`);
      groupClasses += ' has-error';
    }

    return m('div.form-group', { class: groupClasses }, [
      m(`label[for=${vnode.attrs.name}]`, vnode.attrs.title),
      m(`input[name=${vnode.attrs.name}][id=${vnode.attrs.name}].form-control`, {
        value: vnode.attrs.value, onchange: vnode.attrs.onchange,
      }),
      errorField,
    ]);
  }
}

export class selectGroup {
  view(vnode) {
    return m('div.form-group', { class: vnode.attrs.classes }, [
      m(`label[for=${vnode.attrs.name}]`, vnode.attrs.title),
      m(
        `select[name=${vnode.attrs.name}][id=${vnode.attrs.name}].form-control`,
        { value: vnode.attrs.value, onchange: vnode.attrs.onchange },
        vnode.attrs.options.map(option => m('option', option)),
      ),
    ]);
  }
}

export class submitButton {
  view(vnode) {
    const args = vnode.attrs.args;
    if (!vnode.attrs.active) {
      args.disabled = 'disabled';
    }
    return m('div.btn', args, vnode.attrs.text);
  }
}
