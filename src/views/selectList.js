import m from 'mithril';
import Stream from 'mithril/stream';
import {
  List, ListTile, Search, IconButton, Button, Shadow, Toolbar,
  ToolbarTitle,
} from 'polythene-mithril';
import infinite from 'mithril-infinite';
import { debounce } from '../utils';
import { icons, BackButton, ClearButton, SearchIcon } from './elements';


class SearchField {
  oninit() {
    this.value = Stream('');
    this.setInputState = Stream();

    // const clear = () => setInputState()({ value: '', focus: false});
    this.clear = () => this.value('');
    this.leave = () => this.value('');
  }

  view({ state, attrs }) {
    // incoming value and focus added for result list example:
    const value = attrs.value !== undefined ? attrs.value : state.value();

    const ExitButton = attrs.onCancel ? {
      view() {
        return m(Button, {
          element: 'div',
          label: 'Cancel',
          className: 'blue-button',
          events: { onclick: attrs.onCancel },
        });
      },
    } : 'div';

    return m(Search, Object.assign(
      {},
      {
        textfield: {
          label: 'type here',
          onChange: (newState) => {
            state.value(newState.value);
            state.setInputState(newState.setInputState);
            // onChange callback added for result list example:
            if (attrs.onChange) attrs.onChange(newState, state.setInputState);
          },
          value,
          defaultValue: attrs.defaultValue,
        },
        buttons: {
          none: {
            before: m.trust(''),
            after: m(ExitButton),
          },
          focus: {
            before: m(BackButton, { leave: state.leave }),
            after: m(ExitButton),
          },
          focus_dirty: {
            before: m(BackButton, { leave: state.leave }),
            after: m(ClearButton, { clear: state.clear }),
          },
          dirty: {
            before: m(BackButton, { leave: state.leave }),
            after: m(ClearButton, { clear: state.clear }),
          },
        },
        before: m(Shadow),
      },
      attrs,
    ));
  }
}

export default class SelectList {
  constructor({ attrs: { listTileAttrs, onSelect = false } }) {
    this.showList = false;
    this.searchValue = '';
    this.listTileAttrs = listTileAttrs;
    this.onSelect = onSelect;
    // initialize the Selection
    this.selected = null;
  }

  onupdate({ attrs: { selection = null } }) {
    //console.log(selection);
    if (selection) this.selected = selection;
  }

  item() {
    return (data) => {
      const attrs = {
        compactFront: true,
        hoverable: true,
        className: 'themed-list-tile',
        events: {
          onclick: () => {
            if (this.onSelect) { this.onSelect(data); }
            this.selected = data;
            this.showList = false;
          },
        },
      };
      // Overwrite default attrs
      Object.assign(attrs, this.listTileAttrs(data));
      return m(ListTile, attrs);
    };
  }

  view({
    attrs: {
      controller,
      onSubmit = false,
      onCancel = false,
      selectedText,
    },
  }) {
    return m('div', [
      this.selected ? m(Toolbar, { compact: true, style: { background: 'rgb(78, 242, 167)' } }, [
        m(IconButton, {
          icon: { svg: m.trust(icons.clear) },
          ink: false,
          events: {
            onclick: () => {
              if (this.onSelect) { this.onSelect(null); }
              this.selected = null;
            },
          },
        }),
        m(ToolbarTitle, { text: selectedText(this.selected) }),
        onSubmit ? m(Button, {
          label: 'Submit',
          className: 'blue-button',
          events: {
            onclick: () => {
              onSubmit(this.selected);
              this.selected = null;
              controller.setSearch('');
              controller.refresh();
            },
          },
        }) : '',
      ]) : m(SearchField, Object.assign({}, {
        style: { background: 'rgb(78, 242, 167)' },
        onCancel,
        onChange: ({ value, focus }) => {
          // onChange is called either if the value or focus fo the SearchField
          // changes.
          // At value change we want to update the search
          // at focus changt we hie the list of results. As focus change also
          // happens while clicking on an item in the list of results, the list
          // is hidden after a short Timeout that has to be sufficiently long
          // to register the onclick of the listitem. Can be a problem for different
          // OS and browsers.
          if (focus) {
            this.showList = true;
          } else if (!focus) {
            // don't close the list immidiately, as 'out of focus' could 
            // also mean that the user is clicking on a list item
            setTimeout(() => { this.showList = false; m.redraw(); }, 500);
          }
          if (value !== this.searchValue) {
            // if we always update the search value, this would also happen
            // immidiately in the moment where we click on the listitem.
            // Then, the list get's updated before the click is registered.
            // So, we make sure this state change is due to value change and
            // not due to focus change.
            this.searchValue = value;
            //controller.setSearch(value);
            controller.debouncedSearch(value);
          }
        },
      })),
      (this.showList && !this.selected) ? m(List, {
        style: { height: '400px', 'background-color': 'white' },
        tiles: m(infinite, controller.infiniteScrollParams(this.item())),
      }) : '',
    ]);
  }
}
