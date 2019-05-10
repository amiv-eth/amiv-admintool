import m from 'mithril';
import { TextField } from 'polythene-mithril';
import { ListSelect, DatalistController } from 'amiv-web-ui-components';
import { ResourceHandler } from '../auth';
import EditView from '../views/editView';

class NanoController {
  constructor(resource) {
    this.resource = resource;
    this.handler = new ResourceHandler(resource, false);
    this.data = {};
  }

  post(data) {
    return new Promise((resolve, reject) => {
      this.handler.post(data).then(() => {
        this.cancel();
      }).catch(reject);
    });
  }

  cancel() {
    m.route.set(`/${this.resource}`);
  }
}

/**
 * Table of all possible permissions to edit
 *
 * @class      PermissionEditor (name)
 */

export default class NewBlacklist extends EditView {
  constructor({ attrs }) {
    super({ attrs: { controller: new NanoController('blacklist'), ...attrs } });
    this.userHandler = new ResourceHandler('users', ['firstname', 'lastname', 'email', 'nethz']);
    this.userController = new DatalistController((query, search) =>
      this.userHandler.get({ search, ...query }));
  }

  beforeSubmit() {
    const { data } = this.form;
    // exchange user object with string of id
    this.submit({ ...data, user: data.user ? data.user._id : undefined }).then(() => {
      this.controller.changeModus('view');
    });
  }

  view() {
    return this.layout([
      m('div', { style: { display: 'flex' } }, [
        m(TextField, { label: 'User: ', disabled: true, style: { width: '160px' } }),
        m('div', { style: { 'flex-grow': 1 } }, m(ListSelect, {
          controller: this.userController,
          selection: this.form.data.user,
          listTileAttrs: user => Object.assign({}, { title: `${user.firstname} ${user.lastname}` }),
          selectedText: user => `${user.firstname} ${user.lastname}`,
          onSelect: (data) => { console.log('data'); this.form.data.user = data; },
        })),
      ]),
      ...this.form.renderSchema(['reason', 'start_time', 'price']),
    ]);
  }
}
