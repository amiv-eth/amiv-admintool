import m from 'mithril';
import {
  List,
  ListTile,
  Icon,
  Toolbar,
  Dialog,
  SVG,
  Button,
  IconButton,
  Snackbar,
} from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import { icons } from './views/elements';
import { deleteSession, getUserRights, getSchema } from './auth';
import { colors } from './style';

const layoutStyle = [
  {
    body: { padding: 0, margin: 0, overflow: 'hidden' },
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
      '@media (min-width:1200px)': { 'grid-column': 1 },
      '@media (max-width:1200px)': {
        position: 'absolute',
        top: '64px',
        left: '-200px',
        width: '200px',
        'z-index': 100000,
      },
      height: '100%',
      'grid-row': 2,
      'overflow-y': 'auto',
      background: '#cccccc',
      color: 'white',
    },
    '.wrapper-content': {
      '@media (min-width:1200px)': { 'grid-column': 2 },
      '@media (max-width:1200px)': { 'grid-column': '1 / span 2' },
      height: 'calc(100vh - 64px)',
      'grid-row': 2,
      background: '#eee',
      overflow: 'hidden',
    },
    '.menu-button': {
      '@media (min-width:1200px)': { display: 'none' },
      '@media (max-width:1200px)': { display: 'inline' },
    },
    '.content-hider': {
      display: 'none',
      position: 'absolute',
      top: '64px',
      left: '200px',
      width: '100%',
      height: '100%',
      background: '#000000aa',
      'z-index': 100000000,
    },
  },
];
styler.add('layout', layoutStyle);

function toggleDrawer() {
  const drawer = document.querySelector('.wrapper-sidebar');
  const shadow = document.querySelector('.content-hider');
  if (drawer.style.left === '0px') {
    drawer.style.left = '-200px';
    shadow.style.display = 'none';
  } else {
    drawer.style.left = '0px';
    shadow.style.display = 'block';
  }
}

class Menupoint {
  view({ attrs: { title, href, icon = null } }) {
    return m(ListTile, {
      url: { href, oncreate: m.route.link },
      front: icon ? m(Icon, { svg: m.trust(icon) }) : '',
      ink: true,
      title,
    });
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
        'animation-name': 'popup',
        'animation-duration': '2000ms',
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

export class Layout {
  view({ children }) {
    if (!getSchema()) return m(loadingScreen);
    const userRights = getUserRights();
    return m('div', [
      m('div.wrapper-main.smooth', [
        m(Toolbar, {
          className: 'main-toolbar',
          tone: 'dark',
          style: { backgroundColor: colors.amiv_blue, color: '#ffffff' },
        }, [
          m('div.menu-button', m(IconButton, {
            className: 'menu-button',
            icon: { svg: { content: m.trust(icons.menu) } },
            events: { onclick: () => { toggleDrawer(); } },
            style: { color: '#ffffff' },
          })),
          m('div', { style: { 'font-size': '18px', 'margin-left': '20px' } }, 'AMIV Admintools'),
          m('a', {
            href: 'https://gitlab.ethz.ch/amiv/amiv-admintool/issues/new?issuable_template=Bug',
            target: '_blank',
            style: {
              color: '#888888',
              'text-decoration': 'none',
              'text-align': 'right',
              'margin-right': '20px',
              'margin-left': 'auto',
            },
          }, 'Is something not working? Report a bug!'),
          m(Button, {
            label: 'logout',
            events: { onclick: deleteSession },
          }),
        ]),
        m(
          'div.mdc-typography.wrapper-sidebar',
          { style: { width: '200px' } },
          m(List, {
            header: { title: 'Menu' },
            hoverable: true,
            tiles: [
              userRights.users.indexOf('POST') > -1 && m(Menupoint, {
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
              userRights.joboffers.indexOf('POST') > -1 && m(Menupoint, {
                href: '/joboffers',
                icon: icons.iconJobsSVG,
                title: 'Job offers',
              }),
              m(Menupoint, {
                href: '/studydocuments',
                icon: icons.studydoc,
                title: 'Studydocs',
              }),
              m(Menupoint, {
                href: '/blacklist',
                icon: icons.blacklist,
                title: 'Blacklist',
              }),
            ],
          }),
        ),
        m('div.wrapper-content', children),
        // shadow over content in case drawer is out
        m('div.content-hider'),
      ]),
      m(Snackbar),
      // dialog element will show when Dialog.show() is called, this is only a placeholder
      m(Dialog),
    ]);
  }
}

export class Error404 {
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
    }, [
      m('div', { style: { height: '5vh', 'font-size': '4em' } }, 'Error 404: Item Not Found!'),
    ]);
  }
}
