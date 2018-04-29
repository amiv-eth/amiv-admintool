import m from 'mithril';
import {
  IconButton,
  TextField,
  Toolbar,
  ToolbarTitle,
  Card,
} from 'polythene-mithril';

export const icons = {
  search: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  back: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  clear: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  ArrowRight: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>',
  ArrowDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
  iconUsersSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  iconEventSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  ArrowLeft: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg>',
  checked: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
};

export class textInput {
  constructor({ attrs: { getErrors, name } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    this.name = name;
    if (getErrors) {
      this.getErrors = getErrors;
    }
    this.value = '';
  }

  view({ attrs }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const attributes = Object.assign({}, attrs);
    attributes.valid = errors.length === 0;
    attributes.error = errors.join(', ');
    attributes.onChange = ({ value }) => {
      if (value !== this.value) {
        this.value = value;
        attrs.onChange(this.name, value);
      }
    };
    return m(TextField, attributes);
  }
}

export class numInput extends textInput {
  view({ attrs }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const attributes = Object.assign({}, attrs);
    attributes.type = 'number';
    attributes.valid = errors.length === 0;
    attributes.error = errors.join(', ');
    attributes.onChange = ({ value }) => {
      if (value !== this.value) {
        this.value = value;
        attrs.onChange(this.name, parseInt(value, 10));
      }
    };
    return m(TextField, attributes);
  }
}

export class datetimeInput {
  constructor({ attrs: { getErrors, name, onChange } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    this.name = name;
    if (getErrors) { this.getErrors = getErrors; }
    this.value = '';
    this.date = false;
    this.time = false;
    this.onChangeCallback = onChange;
  }

  onChange() {
    if (this.date && this.time) {
      const date = new Date(this.date);
      const h_m = this.time.split(':');
      date.setHours(h_m[0]);
      date.setMinutes(h_m[1]);
      if (this.onChangeCallback) {
        // the ISO String contains 3 positions for microseconds, this kind of fomrat
        // is not accepted by the API
        this.onChangeCallback(this.name, `${date.toISOString().slice(0, -5)}Z`);
      }
    }
  }

  view({ attrs: { label, value } }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();
    const initialValue = value || 'T';
    const initialDate = initialValue.split('T')[0];
    const initialTime = initialValue.split('T')[1].substring(0, 5);

    const date = {
      type: 'date',
      style: {
        width: '150px',
        float: 'left',
      },
      onChange: ({ value }) => {
        if (value !== this.date) {
          this.date = value;
          this.onChange();
        }
      },
      valid: errors.length === 0,
      error: errors.join(', '),
      value: this.date || initialDate,
    };

    const time = {
      type: 'time',
      style: {
        width: '100px',
      },
      onChange: ({ value }) => {
        if (value !== this.time) {
          this.time = value;
          this.onChange();
        }
      },
      valid: errors.length === 0,
      value: this.time || initialTime,
    };
    return m('div', [
      m(TextField, {
        label,
        disabled: true,
        style: {
          width: '200px',
          float: 'left',
        },
      }),
      m(TextField, date),
      m(TextField, time),
    ]);
  }
}


export class fileInput {
  constructor({ attrs: { getErrors, name, onChange } }) {
    // Link the error-getting function from the binding
    this.getErrors = () => [];
    this.name = name;
    if (getErrors) { this.getErrors = getErrors; }
    this.onChangeCallback = onChange;
    this.file = null;
  }

  onChange() {
    
  }

  view({ attrs: { label, accept } }) {
    // set display-settings accoridng to error-state
    const errors = this.getErrors();

    const image = {
      type: 'file',
      accept,
      onchange: ({ target: { files: [file] } }) => {
        if (file !== this.file) {
          // as we only accept one file, it is always the first element
          // of the list
          this.file = file;
          console.log(this.file);
          this.onChangeCallback(this.name, this.file);
        }
      },
    };

    return m('div', { style: { display: 'flex' } }, [
      m(TextField, {
        label,
        disabled: true,
        style: {
          width: '200px',
          float: 'left',
        },
        valid: errors.length === 0,
        error: errors.join(', '),
      }),
      m('input', image),
    ]);
  }
}


// a card that is usually collapsed, but pops out when clicked on the title
export class DropdownCard {
  constructor() {
    this.expand = false;
  }

  view({ attrs: { title }, children }) {
    const toolbar = m(Toolbar, {
      compact: true,
      events: { onclick: () => { this.expand = !this.expand; } },
    }, [
      m(IconButton, {
        icon: {
          svg: m.trust(this.expand ? icons.ArrowDown : icons.ArrowRight),
        },
      }),
      m(ToolbarTitle, { text: title }),
    ]);

    const card = m(Card, {
      style: { padding: '10px', 'font-size': '15sp' },
      content: children.map(child => ({ any: { content: child } })),
    });

    return m('div', [toolbar, this.expand ? card : '']);
  }
}

// Property as specified by material design: small, grey title and larger
// darker content text below
// attrs is the title, children the text
// therefore, you can call it with m(Property, title, text)
export class Property {
  view({ attrs: { title, style }, children }) {
    return m('div', { style }, [
      m('span', {
        style: {
          'margin-top': '10px',
          'margin-bottom': '3px',
          color: 'rgba(0, 0, 0, 0.54)',
        },
      }, m.trust(title)),
      m('p', { style: { color: 'rgba(0, 0, 0, 0.87)' } }, children),
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
  view({ attrs: { args, active, text } }) {
    const argsCopy = args;
    if (!active) {
      argsCopy.disabled = 'disabled';
    }
    return m('div.btn', argsCopy, text);
  }
}

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
