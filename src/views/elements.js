import m from 'mithril';
import { IconButton, TextField } from 'polythene-mithril';

export class textInput {
  constructor({ attrs: { getErrors } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    if (getErrors) {
      this.getErrors = getErrors;
    }
  }

  view({ attrs }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const attributes = Object.assign({}, attrs);
    attributes.valid = errors.length > 0;
    attributes.error = errors.join(', ');
    return m(TextField, attributes);
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
  view({ attrs: { args, active, text } }) {
    const argsCopy = args;
    if (!active) {
      argsCopy.disabled = 'disabled';
    }
    return m('div.btn', argsCopy, text);
  }
}

export const icons = {
  iconSearchSVG: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  iconBackSVG: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  iconClearSVG: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  iconUsersSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  iconEventSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
};

export const BackButton = {
  view: ({ attrs }) => m(IconButton, {
    icon: { svg: m.trust(icons.iconBackSVG) },
    ink: false,
    events: { onclick: attrs.leave },
  }),
};
export const ClearButton = {
  view: ({ attrs }) => m(IconButton, {
    icon: { svg: m.trust(icons.iconClearSVG) },
    ink: false,
    events: { onclick: attrs.clear },
  }),
};
export const SearchIcon = {
  view: () => m(IconButton, {
    icon: { svg: m.trust(icons.iconSearchSVG) },
    inactive: true,
  }),
};
