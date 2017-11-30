import { login } from './auth';

const m = require('mithril');

const FormState = {
  username: '',
  setUsername(v) { FormState.username = v; },
  password: '',
  setPassword(v) { FormState.password = v; },
};

export default class LoginScreen {
  view() {
    return m('div', { class: 'loginPanel smooth' }, [
      m('div.col-sm-4'),
      m('div.col-sm-4', [
        m('img.login-logo', { src: 'res/logo/main.svg' }),
        m('div.input-group', [
          m('input.form-control', {
            oninput: m.withAttr('value', FormState.setUsername),
            placeholder: 'user',
          }),
          m('span.input-group-addon', '@student.ethz.ch'),
        ]),
        m('br'),
        m('input.form-control', {
          oninput: m.withAttr('value', FormState.setPassword),
          placeholder: 'password',
          type: 'password',
        }),
        m('br'),
        m('button.btn.btn-default', {
          onclick() {
            login(FormState.username, FormState.password).then(() => {
              m.route.set('/users');
            });
          },
        }, 'Submit'),
      ]),
      m('div.col-sm-4'),
      m('div', [
        m('span', FormState.username),
        m('span', FormState.password),
      ]),
    ]);
  }
}
