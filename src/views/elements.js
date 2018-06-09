import m from 'mithril';
import {
  IconButton,
  TextField,
  Toolbar,
  ToolbarTitle,
  Card,
  Icon,
} from 'polythene-mithril';

export const icons = {
  search: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
  back: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  clear: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  ArrowRight: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/><path d="M0-.25h24v24H0z" fill="none"/></svg>',
  ArrowDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
  iconUsersSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  iconEventSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  iconJobsSVG: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>',
  ArrowLeft: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/><path d="M0-.5h24v24H0z" fill="none"/></svg>',
  checked: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
  group: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
  cloud: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  department: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path d="M24 14V6H4v36h40V14H24zM12 38H8v-4h4v4zm0-8H8v-4h4v4zm0-8H8v-4h4v4zm0-8H8v-4h4v4zm8 24h-4v-4h4v4zm0-8h-4v-4h4v4zm0-8h-4v-4h4v4zm0-8h-4v-4h4v4zm20 24H24v-4h4v-4h-4v-4h4v-4h-4v-4h16v20zm-4-16h-4v4h4v-4zm0 8h-4v4h4v-4z"/></svg>',
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
    attributes.style = Object.assign({
      'margin-top': '-10px',
      'margin-bottom': '-10px',
    }, attributes.style);
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
    attributes.style = Object.assign({
      'margin-top': '-10px',
      'margin-bottom': '-10px',
    }, attributes.style);
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
      const splitted = this.time.split(':');
      date.setHours(splitted[0]);
      date.setMinutes(splitted[1]);
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
    let initialDate;
    let initialTime;
    if (value) {
      const parsed = new Date(value);
      // convert to locale timezone
      const locale = {
        year: parsed.getFullYear(),
        month: `${parsed.getMonth()}`.padStart(2, '0'),
        day: `${parsed.getDay()}`.padStart(2, '0'),
        hour: `${parsed.getHours()}`.padStart(2, '0'),
        minute: `${parsed.getMinutes()}`.padStart(2, '0'),
      };
      initialDate = `${locale.year}-${locale.month}-${locale.day}`;
      initialTime = `${locale.hour}:${locale.minute}`;
    }

    const date = {
      type: 'date',
      style: {
        width: '150px',
        float: 'left',
      },
      onChange: ({ value: newDate }) => {
        if (newDate !== this.date) {
          this.date = newDate;
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
      onChange: ({ value: newTime }) => {
        if (newTime !== this.time) {
          this.time = newTime;
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

  view({ attrs: { title, ...kwargs }, children }) {
    const toolbar = m(Toolbar, {
      compact: true,
      events: { onclick: () => { this.expand = !this.expand; } },
    }, [
      m(IconButton, {
        icon: { svg: m.trust(this.expand ? icons.ArrowDown : icons.ArrowRight) },
      }),
      m(ToolbarTitle, { text: title }),
    ]);

    const content = [{ any: { content: toolbar } }];
    if (this.expand) {
      content.push(...children.map(child => ({
        any: {
          style: {
            padding: '0 10px 10px 10px',
          },
          content: child,
        },
      })));
    }

    return m(Card, { content, ...kwargs });
  }
}

// Property as specified by material design: small, grey title and larger
// darker content text below
// attrs is the title, children the text
// therefore, you can call it with m(Property, title, text)
export class Property {
  view({ attrs: { title, ...restAttrs }, children }) {
    return m('div', restAttrs, [
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

export class chip {
  view({
    attrs: {
      svg,
      color = '#000000',
      background = '#dddddd',
      ...styleAttrs
    },
    children,
  }) {
    return m('div', {
      style: {
        height: '32px',
        'background-color': '#ffffff',
        'border-radius': '16px',
        // if there is a border, things are weirdly shifted
        padding: styleAttrs.border ? '3px 8px 4px 6px' : '4px 8px',
        display: 'inline-flex',
        ...styleAttrs,
      },
    }, [
      svg && m('div', {
        style: {
          'background-color': background,
          'border-radius': '12px',
          margin: '0px 4px 0px -2px',
          height: '24px',
          width: '24px',
          padding: '2px 2px 2px 4px',
        },
      }, m(Icon, { svg: { content: m.trust(svg) }, size: 'small', style: { color } })),
      m('div', { style: { 'line-height': '24px' } }, children),
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
    icon: { svg: m.trust(icons.back) },
    ink: false,
    events: { onclick: attrs.leave },
  }),
};
export const ClearButton = {
  view: ({ attrs }) => m(IconButton, {
    icon: { svg: m.trust(icons.clear) },
    ink: false,
    events: { onclick: attrs.clear },
  }),
};
export const SearchIcon = {
  view: () => m(IconButton, {
    icon: { svg: m.trust(icons.search) },
    inactive: true,
  }),
};
