import m from 'mithril';
import Stream from 'mithril/stream';
import {
  List, ListTile, Search, IconButton, Button, Shadow, Toolbar,
  ToolbarTitle,
} from 'polythene-mithril';
import infinite from 'mithril-infinite';
import { debounce } from '../utils';

const iconSearchSVG = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z\"/></svg>";
const iconBackSVG = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z\"/></svg>";
const iconClearSVG = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/></svg>";

const createSearchField = () => {
  const BackButton = {
    view: ({ attrs }) => m(IconButton, {
      icon: { svg: m.trust(iconBackSVG) },
      ink: false,
      events: { onclick: attrs.leave },
    }),
  };
  const ClearButton = {
    view: ({ attrs }) => m(IconButton, {
      icon: { svg: m.trust(iconClearSVG) },
      ink: false,
      events: { onclick: attrs.clear },
    }),
  };
  const SearchIcon = {
    view: () => m(IconButton, {
      icon: { svg: m.trust(iconSearchSVG) },
      inactive: true,
    }),
  };

  return {
    oninit: vnode => {
      const value = Stream("");
      const setInputState = Stream();

      //const clear = () => setInputState()({ value: '', focus: false});
      const clear = () => value('');
      const leave = () => value('');

      vnode.state = {
        value,
        setInputState,
        clear,
        leave
      };
    },
    view: ({ state, attrs }) => {
      // incoming value and focus added for result list example:
      const value = attrs.value !== undefined ? attrs.value : state.value();
      return m(Search, Object.assign(
        {},
        {
          textfield: {
            label: "Search",
            onChange: (newState) => {
              state.value(newState.value);
              state.setInputState(newState.setInputState);
              // onChange callback added for result list example:
              attrs.onChange && attrs.onChange(newState, state.setInputState);
            },
            value,
            // incoming label and defaultValue added for result list example:
            label: attrs.label || "Search",
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
          icon: { svg: m.trust(iconClearSVG) },
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
