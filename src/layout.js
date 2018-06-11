import m from 'mithril';
import '@material/drawer';
import { List, ListTile, Icon, Toolbar, ToolbarTitle, Dialog, SVG } from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import { icons } from './views/elements';
import { resetSession } from './auth';
import { colors } from './style'

const layoutStyle = [
  {
    body: {
      padding: 0,
      margin: 0,
    },
    '.main-toolbar': {
      'grid-column': '1 / span 2',
      'grid-row': 1,
    },
    '.wrapper-main': {
      height: '100%',
      width: '100%',
      display: 'grid',
      'grid-template-columns': '200px auto',
      'grid-template-rows': '64px auto',
    },
    '.wrapper-sidebar': {
      'grid-column': 1,
      'grid-row': 2,
      height: '100%',
      'overflow-y': 'auto',
      background: '#cccccc',
      color: 'white',
    },
    '.wrapper-content': {
      height: 'calc(100vh - 72px)',
      'grid-column': 2,
      'grid-row': 2,
      background: '#eee',
      overflow: 'hidden',
    },
  },
];
styler.add('layout', layoutStyle);

class Menupoint {
  view({ attrs: { title, href, icon = null } }) {
    return m(ListTile, {
      url: { href, oncreate: m.route.link },
      front: icon ? m(Icon, { svg: m.trust(icon) }) : '',
      title,
    });
  }
}

export class Layout {
  view({ children }) {
    return m('div', [
      m('div.wrapper-main.smooth', [
        m(Toolbar, {
          className: 'main-toolbar',
          style: { backgroundColor: colors.amiv_blue, color: '#ffffff' },
        }, [
          m(ToolbarTitle, { text: 'AMIV Admintools' }),
          m('a', { onclick: resetSession }, 'Logout'),
        ]),
        m(
          'nav.mdc-drawer.mdc-drawer--permanent.mdc-typography.wrapper-sidebar',
          { style: { width: '200px' } },
          m(List, {
            className: 'drawer-menu',
            header: {
              title: 'Menu',
            },
            tiles: [
              m(Menupoint, {
                href: '/users',
                icon: icons.iconUsersSVG,
                title: 'Users',
              }),
              m(Menupoint, {
                href: '/events',
                icon: icons.iconEventSVG,
                title: 'Events',
              }),
              m(Menupoint, {
                href: '/groups',
                icon: icons.group,
                title: 'Groups',
              }),
              m(Menupoint, {
                href: '/joboffers',
                icon: icons.iconJobsSVG,
                title: 'Job offers',
              }),
              m(Menupoint, {
                href: '/announce',
                title: 'Announce',
              }),
            ],
          }),
        ),
        m('div.wrapper-content', children),
      ]),
      // dialog element will show when Dialog.show() is called, this is only a placeholder
      m(Dialog),
    ]);
  }
}

export class loadingScreen {
  view() {
    return m('div', {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'center',
        'align-items': 'center',
      },
    }, m('div', { style: { height: '5vh', 'font-size': '4em' } }, 'Loading...'), m('div', {
      style: {
        height: '20vh',
        width: '20vh',
        'animation-name': 'spin',
        'animation-duration': '2500ms',
        'animation-iteration-count': 'infinite',
        'animation-timing-function': 'linear',
      },
    }, m('div', {
      style: { height: '20vh', width: '20vh', display: 'inline-block' },
    }, m(SVG, {
      style: { width: 'inherit', height: 'inherit' },
      content: m.trust(icons.amivWheel),
    }))));
  }
}
