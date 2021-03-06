import m from 'mithril';
import { Card, Toolbar, ToolbarTitle, Button, Snackbar } from 'polythene-mithril';
import { ListSelect, DatalistController, Chip } from 'amiv-web-ui-components';
import ItemView from '../views/itemView';
import TableView from '../views/tableView';
import RelationlistController from '../relationlistcontroller';
import { ResourceHandler } from '../auth';
import { icons, Property } from '../views/elements';
import { colors } from '../style';

export default class UserView extends ItemView {
  constructor(vnode) {
    super(vnode);
    // a controller to handle the groupmemberships of this user
    this.groupmemberships = new RelationlistController({
      primary: 'groupmemberships', secondary: 'groups', query: { where: { user: this.data._id } },
    });
    // a controller to handle the eventsignups of this user
    this.eventsignups = new RelationlistController({
      primary: 'eventsignups', secondary: 'events', query: { where: { user: this.data._id } },
    });
    // initially, don't display the choice field for a new group
    // (this will be displayed once the user clicks on 'new')
    this.groupchoice = false;
    // a controller to handle the list of possible groups to join
    this.groupHandler = new ResourceHandler('groups', ['name']);
    this.groupController = new DatalistController(
      (query, search) => this.groupHandler.get({ search, ...query }),
    );
    // exclude the groups where the user is already a member
    this.groupmemberships.handler.get({ where: { user: this.data._id } })
      .then((data) => {
        const groupIds = data._items.map(item => item.group);
        this.groupController.setQuery({
          where: { _id: { $nin: groupIds } },
        });
      });
    this.sessionsHandler = new ResourceHandler('sessions');
  }

  oninit() {
    this.groupmemberships.refresh();
  }

  view() {
    const stdMargin = { margin: '5px' };

    let membership = m(Chip, {
      svg: icons.clear,
      svgBackground: colors.amiv_red,
      style: stdMargin,
    }, 'No Member');
    if (this.data.membership === 'regular') {
      membership = m(Chip, {
        svg: icons.checked,
        svgBackground: colors.green,
        style: stdMargin,
      }, 'Regular Member');
    } else if (this.data.membership === 'extraordinary') {
      membership = m(Chip, {
        svg: icons.checked,
        svgBackground: colors.green,
        style: stdMargin,
      }, 'Extraordinary Member');
    } else if (this.data.membership === 'honorary') {
      membership = m(Chip, {
        svg: icons.star,
        svgBackground: colors.orange,
        style: stdMargin,
      }, 'Honorary Member');
    }

    // Selector that is only displayed if "new" is clicked in the
    // groupmemberships. Selects a group to request membership for.
    const groupSelect = m(ListSelect, {
      controller: this.groupController,
      listTileAttrs: group => Object.assign({}, { title: group.name }),
      selectedText: group => group.name,
      onSubmit: (group) => {
        this.groupchoice = false;
        this.groupmemberships.handler.post({
          user: this.data._id,
          group: group._id,
        }).then(() => {
          this.groupmemberships.refresh();
          m.redraw();
        });
      },
      onCancel: () => { this.groupchoice = false; m.redraw(); },
    });

    const now = new Date();

    return this.layout([
      m('div.maincontainer', [
        m('h1', `${this.data.firstname} ${this.data.lastname}`),
        membership,
        this.data.department && m(
          Chip,
          { svg: icons.department, style: stdMargin },
          this.data.department,
        ),
        this.data.gender && m(Chip, { style: stdMargin }, this.data.gender),
        m(Chip, {
          svg: this.data.send_newsletter ? icons.checked : icons.clear,
          style: stdMargin,
        }, 'newsletter'),
        m('div', { style: { display: 'flex' } }, [
          this.data.nethz && m(Property, { title: 'NETHZ', style: stdMargin }, this.data.nethz),
          this.data.email && m(Property, { title: 'Email', style: stdMargin }, this.data.email),
          m(Property, { title: 'Legi', style: stdMargin }, this.data.legi ? this.data.legi : '-'),
          m(Property, { title: 'RFID', style: stdMargin }, this.data.rfid ? this.data.rfid : '-'),
          this.data.phone && m(Property, { title: 'Phone', style: stdMargin }, this.data.phone),
        ]),
      ]),
      m('div.viewcontainer', [
        m('div.viewcontainercolumn', m(Card, {
          style: { height: '350px' },
          content: m('div', [
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'Event Signups' }),
            ]),
            m(TableView, {
              tableHeight: '175px',
              controller: this.eventsignups,
              tileContent: item => m('div', item.event.title_en || item.event.title_de),
              titles: ['Event'],
              clickOnRows: (data) => { m.route.set(`/events/${data.event._id}`); },
              filters: [[{
                name: 'upcoming',
                query: { 'event.time_start': { $gte: `${now.toISOString().slice(0, -5)}Z` } },
              }, {
                name: 'past',
                query: { 'event.time_start': { $lt: `${now.toISOString().slice(0, -5)}Z` } },
              }]],
              // per default, enable the 'upcoming' filter
              initFilterIdxs: [[0, 0]],
            }),
          ]),
        })),
        m('div.viewcontainercolumn', m(Card, {
          style: { height: '350px' },
          content: m('div', [
            this.groupchoice && groupSelect,
            m(Toolbar, { compact: true }, [
              m(ToolbarTitle, { text: 'Group Memberships' }),
              m(Button, {
                className: 'blue-button',
                label: 'add',
                events: { onclick: () => { this.groupchoice = true; } },
              }),
            ]),
            m(TableView, {
              tableHeight: '225px',
              controller: this.groupmemberships,
              keys: ['group.name', 'expiry'],
              titles: ['Group Name', 'Expires'],
              clickOnRows: (data) => { m.route.set(`/groups/${data.group._id}`); },
            }),
          ]),
        })),
      ]),
    ], [
      m(Button, {
        label: 'log out all Sessions',
        className: 'itemView-delete-button',
        border: true,
        events: {
          onclick: () => {
            this.sessionsHandler.get({
              where: { user: this.data._id },
            }).then((response) => {
              if (response._items.length === 0) {
                Snackbar.show({ title: 'No active sessions for this user.' });
              } else {
                response._items.forEach((session) => {
                  this.sessionsHandler.delete(session);
                });
              }
            });
          },
        },
      }),
    ]);
  }
}
