import m from 'mithril';
import '@material/select/dist/mdc.select.css';
import '@material/select/dist/mdc.select';
//@import 'material/select/dist/mdc.select.css';
import stream from 'mithril/stream';
import { Menu, List, ListTile } from 'polythene-mithril';

/**
 * form element to select from multiple options.
 *
 * Copied from
 * https://github.com/ArthurClemens/polythene/blob/master/docs/components/mithril/menu.md
 *
 * @class      SelectOptions (name)
 */
export class SelectOptions {
  oninit({ name }) {
    this.isOpen = stream(false);
    this.selectedIndex = stream(0);
    // target has to be a unique ID, therefore we take the name of the assigned value
    this.target = name;
  }

  view({ attrs: { name, options, onChange } }) {
    const isOpen = this.isOpen();
    const selectedIndex = this.selectedIndex();
    return m('div', { style: { position: 'relative' } }, [
      m(Menu, {
        target: `#${this.target}`,
        show: isOpen,
        hideDelay: 0.240,
        didHide: () => this.isOpen(false),
        size: 5,
        content: m(List, {
          tiles: options.map((setting, index) =>
            m(ListTile, {
              title: setting,
              ink: true,
              hoverable: true,
              events: {
                onclick: () => {
                  this.selectedIndex(index);
                  onChange(name, options[index]);
                },
              },
            })),
        }),
      }),
      m(ListTile, {
        id: this.target,
        title: options[selectedIndex],
        events: { onclick: () => this.isOpen(true) },
      }),
    ]);
  }
}

export class MDCSelect {
  view({ attrs: { options, name, onchange = () => {}, ...kwargs } }) {
    return m('div.mdc-select', { style: { height: '41px' } }, [
      m('select.mdc-select__native-control', {
        style: { 'padding-top': '10px' },
        onchange: ({ target: { value } }) => { onchange(value); },
        ...kwargs,
      }, options.map(option => m('option', { value: option }, option)),
      ),
      m('label.mdc-floating-label', ''),
      m('div.mdc-line-ripple'),
    ]);
  }
}
