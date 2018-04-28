import m from 'mithril';
import { RaisedButton, RadioGroup, Slider } from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import EditView from '../views/editView';

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
    this.data = { priority: 1 };
  }

  view() {
    if (!this.currentpage) return '';

    const buttonRight = m(RaisedButton, {
      label: 'next',
      disabled: this.currentpage === 4,
      events: {
        onclick: () => {
          this.currentpage = Math.min(this.currentpage + 1, 4);
        },
      },
    });

    const buttonLeft = m(RaisedButton, {
      label: 'previous',
      disabled: this.currentpage === 1,
      events: {
        onclick: () => {
          this.currentpage = Math.max(1, this.currentpage - 1);
        },
      },
    });

    const radioButtonSelectionMode = m(RadioGroup, {
      name: 'Selection Mode',
      buttons: [
        {
          value: 'fcfs',
          label: 'First come, first serve',
        },
        {
          value: 'manual',
          label: 'Selection made by organizer',
        },
      ],
      onChange: (state) => {
        this.selection_strategy = state.value;
        this.data.selection_strategy = state.value;
        console.log(this.data); // Temp proof of concept.
      },
      value: this.selection_strategy,
    });

    const buttonFinish = m(RaisedButton, {
      disabled: !this.valid,
      label: 'Create event',
      events: {
        onclick: () => {
          const additionalFields = {
            schema: 'http://json-schema.org/draft-04/schema#',
            additionalProperties: false,
            title: 'Additional Fields',
            type: 'object',
            properties: {},
            required: [],
          };
          if (this.data.add_fields_sbb) {
            additionalFields.properties.SBB_Abo = {
              type: 'string',
              enum: ['None', 'GA', 'Halbtax', 'Gleis 7'],
            };
            additionalFields.required.push('SBB_Abo');
            delete this.data.add_fields_sbb;
          }

          if (this.data.add_fields_food) {
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
            delete this.data.add_fields_food;
          }
          if (this.data.add_fields_food || this.data.add_fields_sbb) {
            this.data.additional_fields = JSON.stringify(additionalFields);
          }
          console.log(this.data);
          this.submit('POST');
        },
      },
    });

    const title = [
      'Create an Event', 'When and Where?', 'Signups', 'Advertisement',
    ][this.currentpage - 1];

    // checks currentPage and selects the fitting page
    return m('div.mywrapper', [
      m('h3', title),
      buttonLeft,
      m.trust('&nbsp;'),
      buttonRight,
      m('br'),
      m('div', {
        style: { display: (this.currentpage === 1) ? 'block' : 'none' },
      }, this.renderPage({
        title_en: { type: 'text', label: 'English Event Title' },
        catchphrase_en: { type: 'text', label: 'English Catchphrase' },
        description_en: {
          type: 'text',
          label: 'English Description',
          multiLine: true,
          rows: 5,
        },
        title_de: { type: 'text', label: 'German Event Title' },
        catchphrase_de: { type: 'text', label: 'German Catchphrase' },
        description_de: {
          type: 'text',
          label: 'German Description',
          multiLine: true,
          rows: 5,
        },
      })),
      m('div', {
        style: { display: (this.currentpage === 2) ? 'block' : 'none' },
      }, this.renderPage({
        time_start: { type: 'datetime', label: 'Event Start Time' },
        time_end: { type: 'datetime', label: 'Event End Time' },
        location: { type: 'text', label: 'Location' },
      })),
      m('div', {
        style: { display: (this.currentpage === 3) ? 'block' : 'none' },
      }, [
        ...this.renderPage({
          spots: {
            type: 'number',
            label: 'Number of Spots',
            help: '0 for open event',
            focusHelp: true,
            min: 0,
          },
          price: {
            type: 'number',
            label: 'Price',
            min: 0,
            step: 0.01,
          },
          time_register_start: {
            type: 'datetime',
            label: 'Start of Registration',
          },
          time_register_end: {
            type: 'datetime',
            label: 'End of Registration',
          },
          add_fields_food: { type: 'checkbox', label: 'Food limitations' },
          add_fields_sbb: { type: 'checkbox', label: 'ABB Abbonement' },
        }),
        m('br'),
        ...this.renderPage({
          allow_email_signup: {
            type: 'checkbox',
            label: 'Allow non AMIV Members?',
          },
        }),
        radioButtonSelectionMode,
      ]),
      m('div', {
        style: { display: (this.currentpage === 4) ? 'block' : 'none' },
      }, [
        ...this.renderPage({
          time_advertising_start: {
            type: 'datetime',
            label: 'Start of Advertisement',
            required: true,
          },
          time_advertising_end: {
            type: 'datetime',
            label: 'End of Advertisement',
            required: true,
          },
        }),
        m.trust('Priority<br>'),
        m(Slider, {
          min: 1,
          max: 10,
          stepSize: 1,
          // value: this.data.priority || 1,
          // onChange: ({ value }) => { this.data.priority = value; },
        }),
        ...this.renderPage({
          show_website: { type: 'checkbox', label: 'Advertise on Website' },
          show_announce: { type: 'checkbox', label: 'Advertise in Announce' },
          show_infoscreen: {
            type: 'checkbox',
            label: 'Advertise on Infoscreen',
          },
        }),
        m('br'),
        buttonFinish,
      ]),
    ]);
  }
}
