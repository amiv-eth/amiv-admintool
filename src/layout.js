import m from 'mithril';
import '@material/drawer';
import { List, ListTile, Icon, Toolbar, ToolbarTitle } from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import { icons } from './views/elements';

const layoutStyle = [
  {
    body: {
      padding: 0,
      margin: 0,
    },
    '.main-toolbar': {
      backgroundColor: '#1f2d54',
      color: '#fff',
      height: '72px',
      'grid-column': '1 / span 2',
      'grid-row': 1,
    },
    '.wrapper-main': {
      height: '100%',
      width: '100%',
      display: 'grid',
      'grid-template-columns': '200px auto',
      'grid-template-rows': '72px auto',
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
      url: {
        href,
        oncreate: m.route.link,
      },
      front: icon ? m(Icon, {
        avatar: true,
        svg: m.trust(icon),
      }) : '',
      title,
    });
  }
}

export default class Layout {
  view({ children }) {
    return m('div', [
      m('div.wrapper-main.smooth', [
        m(Toolbar, { className: 'main-toolbar' }, [
          m(ToolbarTitle, { text: 'AMIV Admintools' }),
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
                title: 'Groups',
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

    /*return m('div.wrapper-sidebar.smooth', m('div.container-fluid', [
      m('a[href=/]', { oncreate: m.route.link }, [
        m('img.sidebar-logo[src="res/logo/main.svg"]'),
      ]),
      m('ul.nav.nav-pills.nav-stacked.nav-sidebar', [
      ]),
    ]));*/
    ]);
  }
}