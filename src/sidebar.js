const m = require('mithril');

class Button {
  view(vnode) {
    return m('li', m('a', { href: vnode.attrs.href, oncreate: m.route.link }, [
      m('span.glyphicon', { class: `glyphicon-${vnode.attrs.glyph}` }),
      m.trust(` ${vnode.attrs.title}`),
    ]));
  }
}

export default class Sidebar {
  view() {
    return m('div.wrapper-sidebar.smooth', m('div.container-fluid', [
      m('a[href=/]', { oncreate: m.route.link }, [
        m('img.sidebar-logo[src="res/logo/main.svg"]'),
      ]),
      m('ul.nav.nav-pills.nav-stacked.nav-sidebar', [
        m(Button, { href: '/users', glyph: 'list-alt', title: 'Users' }),
        m(Button, { href: '/events', glyph: 'calendar', title: 'Events' }),
        m(Button, { href: '/groups', glyph: 'blackboard', title: 'Groups' }),
      ]),
    ]));
  }
}
