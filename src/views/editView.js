import Ajv from 'ajv';
import { ItemView } from './itemView';
import { getSession } from '../auth';


const m = require('mithril');

const objectNameForResource = {
  users: 'User',
};

export class EditView extends ItemView {
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

  patchOnClick(patchableFields, callback) {
    return {
      onclick: () => {
        if (this.changed) {
          getSession().then((apiSession) => {
            // fields like `_id` are not patchable and would lead to an error
            // We therefore only send patchable fields
            const patchData = {};
            patchableFields.forEach((key) => {
              patchData[key] = this.data[key];
            });

            apiSession.patch(`${this.resource}/${this.id}`, patchData, {
              headers: { 'If-Match': this.data._etag },
            }).then(() => { callback(); });
          });
        } else {
          callback();
        }
      },
    };
  }

  createOnClick(fields, callback) {
    return {
      onclick: () => {
        getSession().then((apiSession) => {
          // fields like `_id` are not patchable and would lead to an error
          // We therefore only send patchable fields
          const postData = {};
          fields.forEach((key) => {
            postData[key] = this.data[key];
          });

          apiSession.post(this.resource, postData)
            .then(response => { callback(response); });
        });
      },
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
    console.log(groupClasses)
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
