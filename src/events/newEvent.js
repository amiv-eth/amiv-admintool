import m from 'mithril';
import { Button, Checkbox, RadioGroup, IconButton, SVG, TextField } from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import EditView from '../views/editView';
import { icons, textInput, datetimeInput } from '../views/elements';

const style = [
  {
    '.mywrapper': {
      padding: '10px',
    },
  },
];
styler.add('event-add', style);


export default class newEvent extends EditView {
  constructor(vnode) {
    super(vnode, 'events', {});
    this.currentpage = 1;
    this.food = false;
    this.sbbAbo = false;
  }

  addOne() {
    this.currentpage = this.currentpage + 1;
    if (this.currentpage === 5) {
      this.currentpage = 4;
    }
    if (this.currentpage === 6) {
      this.currentpage = 6;
    }
  }

  subOne() {
    this.currentpage = this.currentpage - 1;
    if (this.currentpage === 0) {
      this.currentpage = 1;
    }
    if (this.currentpage === 6) {
      this.currentpage = 6;
    }
  }

  view() {
    if (!this.currentpage) return '';

    const firstTableInputs = {
      title_en: {
        label: 'English Event Title',
      },
      catchphrase_en: {
        label: 'English Catchphrase',
      },
      description_en: {
        label: 'English Description',
        multiLine: true,
        rows: 5,
      },
      title_de: {
        label: 'German Event Title',
      },
      catchphrase_de: {
        label: 'German Catchphrase',
      },
      description_de: {
        label: 'German Description',
        multiLine: true,
        rows: 5,
      },
    };

    const thirdTableInputs = {
      spots: {
        label: 'Number of Spots',
        help: '0 for open event',
        focusHelp: true,
      },
      price: {
        label: 'Price',
      },
      time_register_start: {
        label: 'Start of Registration',
      },
      time_register_end: {
        label: 'End of Registration',
      },
    };

    const forthTableInputs = {
      time_advertising_start: {
        label: 'Start of Advertisement',
        type: 'datetime',
        required: true,
      },
      time_advertising_end: {
        label: 'End of Advertisement',
        required: true,
      },
      priority: {
        label: 'Priority',
      },
    };

    const iconRight = m(
      IconButton, { events: { onclick: () => { this.addOne(); } } },
      m(SVG, m.trust(icons.ArrowRight)),
    );

    const iconLeft = m(
      IconButton, { events: { onclick: () => { this.subOne(); } } },
      m(SVG, m.trust(icons.ArrowLeft)),
    );

    const checkboxAnnounce = m(Checkbox, {
      defaultChecked: false,
      label: 'Advertise in Announce?',
      value: '100',
      onChange: (state) => {
        this.show_announce = state.checked;
        console.log(this.show_announce);
      },
    });

    const checkboxWebsite = m(Checkbox, {
      defaultChecked: false,
      label: 'Advertise on Website?',
      value: '100',
      onChange: (state) => {
        this.show_website = state.checked;
      },
    });

    const checkboxInfoScreen = m(Checkbox, {
      defaultChecked: false,
      label: 'Advertise on Infoscreen?',
      value: '100',
      onChange: (state) => {
        this.show_infoscreen = state.checked;
      },

    });

    const checkboxAllowMail = m(Checkbox, {
      defaultChecked: false,
      label: 'Allow non AMIV Members?',
      value: '100',
      onChange: (state) => {
        this.allow_email_signup = state.checked;
      },
      checked: this.allow_email_signup,
    });

    const addFood = m(Checkbox, {
      defaultChecked: false,
      label: 'Food limitations',
      value: '100',
      onChange: (state) => {
        this.food = state.checked;
        console.log(this.food);
      },
      checked: this.food,
    });

    const addSBB = m(Checkbox, {
      defaultChecked: false,
      label: 'SBB ABO',
      value: '100',
      onChange: (state) => {
        this.sbbAbo = state.checked;
        console.log(this.sbbAbo);
      },
      checked: this.sbbAbo,
    });

    const radioButtonSelectionMode = m(RadioGroup, {
      name: 'Selection Mode',
      buttons: [
        {
          value: 'fcfs',
          label: 'First come, first serve',
          defaultChecked: true,
        },
        {
          value: 'manual',
          label: 'Selection made by organizer',
        },
      ],
    });

    const buttonFinish = m(Button, {
      label: 'Create event',
      events: {
        onclick: () => {
          const additionalFields = {
            title: 'Additional Fields',
            type: 'object',
            properties: {},
            required: [],
          };
          if (this.sbbAbo) {
            additionalFields.properties.SBB_Abo = {
              type: 'string',
              enum: ['None', 'GA', 'Halbtax', 'Gleis 7'],
            };
            additionalFields.required.push('SBB_Abo');
          }

          if (this.food) {
            additionalFields.properties.Food = {
              type: 'string',
              enum: ['Omnivor', 'Vegi', 'Vegan', 'Other'],
            };
            additionalFields.properties.specialFood = {
              'Special Food Requirements': {
                type: 'string',
              },
            };
            additionalFields.required.push('Food');
          }
          this.data.additional_fields = additionalFields;
          console.log(this.data.additional_fields);
          this.submit('POST');
        },
      },
    });

    const title = [
      'Create an Event', 'When and Where?', 'Signups', 'Advertisement',
    ][this.currentpage - 1];

    // checks currentPage and selects the fitting page
    return m('div.mywrapper', [
      m('h1', title),
      m('br'),
      iconLeft,
      iconRight,
      m('br'),
      m('div', {
        style: {
          display: (this.currentpage === 1) ? 'block' : 'none',
        },
      }, Object.keys(firstTableInputs).map((key) => {
        const attrs = firstTableInputs[key];
        const attributes = Object.assign({}, attrs);
        attributes.name = key;
        attributes.floatingLabel = true;
        return m(textInput, this.bind(attributes));
      })),
      m('div', {
        style: {
          display: (this.currentpage === 2) ? 'block' : 'none',
        },
      }, [
        m(datetimeInput, this.bind({
          name: 'time_start',
          label: 'Event Start Time',
        })),
        m(datetimeInput, this.bind({
          name: 'time_end',
          label: 'Event End Time',
        })),
        m(textInput, this.bind({
          name: 'location',
          label: 'Location',
          floatingLabel: true,
        })),
      ]),
      m('div', {
        style: {
          display: (this.currentpage === 3) ? 'block' : 'none',
        },
      }, [
        Object.keys(thirdTableInputs).map((key) => {
          const attrs = thirdTableInputs[key];
          const attributes = Object.assign({}, attrs);
          attributes.name = key;
          attributes.floatingLabel = true;
          return m(textInput, this.bind(attributes));
        }),
        addFood, addSBB, m('br'), checkboxAllowMail, radioButtonSelectionMode,
      ]),
      m('div', {
        style: {
          display: (this.currentpage === 4) ? 'block' : 'none',
        },
      }, [
        Object.keys(forthTableInputs).map((key) => {
          const attrs = forthTableInputs[key];
          const attributes = Object.assign({}, attrs);
          attributes.name = key;
          attributes.floatingLabel = true;
          return m(textInput, this.bind(attributes));
        }),
        checkboxWebsite, checkboxAnnounce, checkboxInfoScreen, m('br'), buttonFinish,
      ]),

      m('div', {
        style: {
          display: (this.currentpage === 6) ? 'block' : 'none',
        },
      }, ['Event created!',
      ]),

    ]);
  }
}
