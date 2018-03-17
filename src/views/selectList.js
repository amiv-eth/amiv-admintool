import m from 'mithril';
import Stream from 'mithril/stream';
import {
  List, ListTile, Search, IconButton, Button, Shadow, Toolbar,
  ToolbarTitle,
} from 'polythene-mithril';
import infinite from 'mithril-infinite';
import { debounce } from '../utils';
import { icons, BackButton, ClearButton, SearchIcon } from './elements';

const createSearchField = () => {
  return {
    oninit: (vnode) => {
      const value = Stream('');
      const setInputState = Stream();

      // const clear = () => setInputState()({ value: '', focus: false});
      const clear = () => value('');
      const leave = () => value('');

      vnode.state = {
        value, setInputState, clear, leave,
      };
    },
    view: ({ state, attrs }) => {
      // incoming value and focus added for result list example:
      const value = attrs.value !== undefined ? attrs.value : state.value();
      return m(Search, Object.assign(
        {},
        {
          textfield: {
            label: 'Search',
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
              before: m(SearchIcon),
            },
            focus: {
              before: m(BackButton, { leave: state.leave }),
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
    },
  };
};

const SearchField = createSearchField();


export default class SelectList {
  constructor({ attrs: { listTileAttrs } }) {
    this.selected = null;
    this.showList = false;
    this.searchValue = '';
    this.listTileAttrs = listTileAttrs;
  }

  item() {
    return (data) => {
      const attrs = {
        compactFront: true,
        hoverable: true,
        className: 'themed-list-tile',
        events: {
          onclick: () => { this.selected = data; this.showList = false; },
        },
      };
      // Overwrite default attrs
      Object.assign(attrs, this.listTileAttrs(data));
      return m(ListTile, attrs);
    };
  }

  view({ attrs: { controller, onSubmit = () => {} } }) {
    return m('div', [
      this.selected ? m(Toolbar, { compact: true }, [
        m(IconButton, {
          icon: { svg: m.trust(icons.iconClearSVG) },
          ink: false,
          events: { onclick: () => { this.selected = null; } },
        }),
        m(ToolbarTitle, { text: this.selected.name }),
        m(Button, {
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
        }),
      ]) : m(SearchField, Object.assign({}, {
        label: 'type here',
        onChange: ({ value, focus }) => {
          if (focus) {
            this.showList = true;
          }
          if (value !== this.searchValue) {
            // if we always update the search value, this would also happen
            // immidiately in the moment where we click on the listitem.
            // Then, the list get's updated before the click is registered.
            // So, we make sure this state change is due to value change and
            // not due to focus change.
            this.searchValue = value;
            controller.setSearch(value);
            debounce(() => { controller.refresh(); }, 500);
          }
        },
        defaultValue: '',
      })),
      this.showList ? m(List, {
        className: 'scrollTable',
        tiles: m(infinite, controller.infiniteScrollParams(this.item())),
      }) : null,
    ]);
  }
}
