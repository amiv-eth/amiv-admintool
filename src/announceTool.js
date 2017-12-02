import renderAnnounce from 'announcetool';

const m = require('mithril');

export default class AnnounceTool {
  oninit() {
    console.log(renderAnnounce);
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
