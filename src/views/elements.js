const m = require('mithril');

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
