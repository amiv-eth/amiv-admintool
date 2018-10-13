import m from 'mithril';
import { RaisedButton, RadioGroup, Switch } from 'polythene-mithril';
import { fileInput } from 'amiv-web-ui-components';
import { styler } from 'polythene-core-css';
// eslint-disable-next-line import/extensions
import { apiUrl } from 'networkConfig';
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
    super(vnode);
    this.currentpage = 1;
    if (!this.form.data.priority) this.form.data.priority = 1;

    // read additional_fields to make it editable
    if (this.form.data.additional_fields) {
      const copy = JSON.parse(this.form.data.additional_fields);
      this.form.data.add_fields_sbb = 'SBB_Abo' in copy.properties;
      this.form.data.add_fields_food = 'Food' in copy.properties;
      this.form.data.additional_fields = null;
    }

    // price can either not be set or set to null
    // if it is 0 however, that would mean that there actually is a price that
    // you can edit
    this.hasprice = 'price' in this.form.data && this.form.data.price !== null;
    this.hasregistration = 'time_advertising_start' in this.form.data;
  }

  beforeSubmit() {
    // Collect images seperate from everything else
    const images = {};
    ['thumbnail', 'banner', 'infoscreen', 'poster'].forEach((key) => {
      if (this.form.data[`new_${key}`]) {
        images[`img_${key}`] = this.form.data[`new_${key}`];
        delete this.form.data[`new_${key}`];
      }
      if (this.form.data[`img_${key}`]) {
        delete this.form.data[`img_${key}`];
      }
    });

    // Merge Options for additional fields
    const additionalFields = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      additionalProperties: false,
      title: 'Additional Fields',
      type: 'object',
      properties: {},
      required: [],
    };
    if (this.form.data.add_fields_sbb) {
      additionalFields.properties.SBB_Abo = {
        type: 'string',
        enum: ['None', 'GA', 'Halbtax', 'Gleis 7'],
      };
      additionalFields.required.push('SBB_Abo');
    }

    if (this.form.data.add_fields_food) {
      additionalFields.properties.Food = {
        type: 'string',
        enum: ['Omnivor', 'Vegi', 'Vegan', 'Other'],
      };
      additionalFields.properties['Special Food Requirements'] = {
        type: 'string',
      };
      additionalFields.required.push('Food');
    }
    if ('add_fields_sbb' in this.form.data) delete this.form.data.add_fields_sbb;
    if ('add_fields_food' in this.form.data) delete this.form.data.add_fields_food;

    // if the properties are empty, we null the whole field, otherwise we send a json string
    // of the additional fields object
    if (Object.keys(additionalFields.properties).length > 0) {
      this.form.data.additional_fields = JSON.stringify(additionalFields);
    } else {
      this.form.data.additional_fields = null;
    }


    // if spots is not set, also remove 'allow_email_signup'
    if (!('spots' in this.form.data) && 'allow_email_signup' in this.form.data
        && !this.form.data.allow_email_signup) {
      delete this.form.data.allow_email_signup;
    }

    console.log(this.form.data);
    if (Object.keys(images).length > 0) {
      images._id = this.form.data._id;
      images._etag = this.form.data._etag;
      // first upload the images as formData, then the rest as JSON
      this.controller.handler.patch(images, true).then(({ _etag }) => {
        this.form.data._etag = _etag;
        this.submit();
      });
    } else {
      this.submit();
    }
  }

  view() {
    const buttonRight = m(RaisedButton, {
      label: 'next',
      disabled: this.currentpage === 5,
      events: {
        onclick: () => {
          this.currentpage = Math.min(this.currentpage + 1, 5);
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
        this.form.data.selection_strategy = state.value;
        console.log(this.form.data); // Temp proof of concept.
      },
      value: this.selection_strategy,
    });

    const title = [
      'Event Description', 'When and Where?', 'Signups', 'Advertisement', 'Images',
    ][this.currentpage - 1];

    // checks currentPage and selects the fitting page
    return this.layout([
      m('h3', title),
      buttonLeft,
      m.trust('&nbsp;'),
      buttonRight,
      m('br'),
      m('div', {
        style: { display: (this.currentpage === 1) ? 'block' : 'none' },
      }, this.form.renderPage({
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
      }, this.form.renderPage({
        time_start: { type: 'datetime', label: 'Event Start Time' },
        time_end: { type: 'datetime', label: 'Event End Time' },
        location: { type: 'text', label: 'Location' },
      })),
      m('div', {
        style: { display: (this.currentpage === 3) ? 'block' : 'none' },
      }, [
        m(Switch, {
          label: 'people have to pay something to attend this event',
          style: { 'margin-bottom': '5px' },
          checked: this.hasprice,
          onChange: ({ checked }) => {
            this.hasprice = checked;
            if (!checked) {
              // if it originally had a price, set to null, otherwise delete
              if (this.controller.data.price) this.form.data.price = null;
              else delete this.form.data.price;
            }
          },
        }),
        ...this.hasprice && this.form.renderPage({
          price: { type: 'number', label: 'Price', min: 0, step: 0.01 },
        }),
        m('br'),
        m(Switch, {
          label: 'people have to register to attend this event',
          checked: this.hasregistration,
          onChange: ({ checked }) => {
            this.hasregistration = checked;
            if (!checked) {
              delete this.form.data.spots;
              delete this.form.data.time_register_start;
              delete this.form.data.time_register_end;
              delete this.form.data.add_fields_sbb;
              delete this.form.data.add_fields_food;
              delete this.form.data.allow_email_signup;
              delete this.form.data.selection_strategy;
            }
          },
        }),
        ...this.hasregistration && this.form.renderPage({
          spots: {
            type: 'number',
            label: 'Number of Spots',
            help: '0 for open event',
            focusHelp: true,
            min: 0,
          },
          time_register_start: { type: 'datetime', label: 'Start of Registration' },
          time_register_end: { type: 'datetime', label: 'End of Registration' },
          add_fields_food: { type: 'checkbox', label: 'Food limitations' },
          add_fields_sbb: { type: 'checkbox', label: 'SBB Abbonement' },
        }),
        m('br'),
        ...this.hasregistration && this.form.renderPage({
          allow_email_signup: { type: 'checkbox', label: 'Allow Email Signup' },
        }),
        this.hasregistration && radioButtonSelectionMode,
      ]),
      m('div', {
        style: { display: (this.currentpage === 4) ? 'block' : 'none' },
      }, [
        ...this.form.renderPage({
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
        // TODO is deactivated now
        /*m.trust('Priority<br>'),
        m(Slider, {
          min: 1,
          max: 10,
          stepSize: 1,

          // value: this.data.priority || 1,
          // onChange: ({ value }) => { this.data.priority = value; },
        }),*/
        ...this.form.renderPage({
          show_website: { type: 'checkbox', label: 'Advertise on Website' },
          show_announce: { type: 'checkbox', label: 'Advertise in Announce' },
          show_infoscreen: {
            type: 'checkbox',
            label: 'Advertise on Infoscreen',
          },
        }),
      ]),
      m('div', {
        style: { display: (this.currentpage === 5) ? 'block' : 'none' },
      }, [
        ['thumbnail', 'banner', 'poster', 'infoscreen'].map(key => [
          this.form.data[`img_${key}`] ? m('img', {
            src: `${apiUrl}${this.form.data[`img_${key}`].file}`,
            style: { 'max-height': '50px', 'max-width': '100px' },
          }) : m('div', `currently no ${key} image set`),
          m(fileInput, this.form.bind({
            name: `new_${key}`,
            label: `New ${key} Image`,
            accept: 'image/png, image/jpeg',
          })),
        ]),
      ]),
    ]);
  }
}
