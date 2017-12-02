import tool from 'announcetool';

const m = require('mithril');

export default class AnnounceTool {
  oncreate() {
    if (tool.wasRenderedOnce()) {
      // jQuery catches the first document.ready, but afterwards we have to
      // trigger a render
      tool.render();
    }
  }

  view() {
    return m('div', [
      m('div#tableset', [
        m('p#events'),
        m('div#buttonrow', [
          m('button#preview.btn.btn-default', 'Preview'),
          m('button#reset.btn.btn-default', 'Reset'),
          m('button#send.btn.btn-default', 'Send'),
        ]),
      ]),
      m('br'),
      m('hr'),
      m('textarea#target'),
    ]);
  }
}
