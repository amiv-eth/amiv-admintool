import m from 'mithril';
import { styler } from 'polythene-core-css';
import {
  RadioGroup, Switch, Dialog, Button, Tabs, Icon, TextField,
} from 'polythene-mithril';
import { FileInput, ListSelect, DatalistController } from 'amiv-web-ui-components';
import { TabsCSS, ButtonCSS } from 'polythene-css';
// eslint-disable-next-line import/extensions
import { apiUrl, ownUrl } from 'networkConfig';
import { ResourceHandler } from '../auth';
import { colors } from '../style';
import { loadingScreen } from '../layout';
import { icons } from '../views/elements';
import EditView from '../views/editView';

ButtonCSS.addStyle('.nav-button', {
  color_light_border: 'rgba(0, 0, 0, 0.09)',
  color_light_disabled_background: 'rgba(0, 0, 0, 0.09)',
  color_light_disabled_border: 'transparent',
});

TabsCSS.addStyle('.edit-tabs', {
  color_light: '#555555',
  // no hover effect
  color_light_hover: '#555555',
  color_light_selected: colors.amiv_blue,
  color_light_tab_indicator: colors.amiv_blue,
});

const styles = [
  {
    '.imgPlaceholder': {
      background: '#999',
      position: 'relative',
    },
    '.imgPlaceholder > div': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      'font-size': '16px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    },
    '.imgBackground': {
      'background-size': 'contain',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
    },
  },
];
styler.add('eventEdit', styles);

export default class newEvent extends EditView {
  constructor(vnode) {
    super(vnode);
    this.currentpage = 1;

    // Create a usercontroller to handle the moderator field
    this.userHandler = new ResourceHandler('users', ['firstname', 'lastname', 'email', 'nethz']);
    this.userController = new DatalistController((query, search) =>
      this.userHandler.get({ search, ...query }));

    // check whether the user has the right to create events or can only propose
    this.rightSubmit = !m.route.get().startsWith('/proposeevent');

    // proposition URL-link decoder
    if (this.rightSubmit && m.route.param('proposition')) {
      const data = JSON.parse(window.atob(m.route.param('proposition')));
      console.log(data);
      this.form.data = data;
    }
    if (this.form.data.priority === 10) this.form.data.high_priority = true;

    // read additional_fields to make it editable
    if (this.form.data.additional_fields) {
      const copy = JSON.parse(this.form.data.additional_fields);
      this.form.data.add_fields_sbb = 'sbb_abo' in copy.properties;
      this.form.data.add_fields_food = 'food' in copy.properties;
      this.form.data.additional_fields = null;
      let i = 0;
      while (`text${i}` in copy.properties) {
        this.form.data[`add_fields_text${i}`] = copy.properties[`text${i}`].title;
        i += 1;
      }
      // TODO: find a better solution to keep track of the additional textfields
      this.add_fields_text_index = i;
    } else {
      this.add_fields_text_index = 0;
    }

    // price can either not be set or set to null
    // if it is 0 however, that would mean that there actually is a price that
    // you can edit
    this.hasprice = 'price' in this.form.data && this.form.data.price !== null;
    this.hasregistration = 'spots' in this.form.data || 'time_registration_start' in this.form.data;
  }

  beforeSubmit() {
    // Here comes all the processing from the state of our input form into data send to the api.
    // In particular, we have to:
    // - remove images from the patch that should not get changed, add images in right format that
    //   should be changed
    // - transfer states like add_fields_sbb etc. into actual additional_fields
    // - dependent on user rights, either submit to API or create an event proposal link

    // Images that should be changed have new_{key} set, this needs to get uploaded to the API
    // All the other images should be removed from the upload to not overwrite them.
    const images = {};
    ['thumbnail', 'infoscreen', 'poster'].forEach((key) => {
      if (this.form.data[`new_${key}`]) {
        images[`img_${key}`] = this.form.data[`new_${key}`];
        delete this.form.data[`new_${key}`];
      }
      if (this.form.data[`img_${key}`] !== undefined && this.form.data[`img_${key}`] !== null) {
        delete this.form.data[`img_${key}`];
      }
    });

    // Merge Options for additional fields
    // This is the sceleton schema:
    const additionalFields = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      additionalProperties: false,
      title: 'Additional Fields',
      type: 'object',
      properties: {},
      required: [],
    };
    if (this.form.data.add_fields_sbb) {
      additionalFields.properties.sbb_abo = {
        type: 'string',
        title: 'SBB Abonnement',
        enum: ['None', 'GA', 'Halbtax', 'Gleis 7', 'HT + Gleis 7'],
      };
      additionalFields.required.push('sbb_abo');
    }
    if (this.form.data.add_fields_food) {
      additionalFields.properties.food = {
        type: 'string',
        title: 'Food',
        enum: ['Omnivor', 'Vegi', 'Vegan', 'Other'],
      };
      additionalFields.properties.food_special = {
        type: 'string',
        title: 'Special Food Requirements',
      };
      additionalFields.required.push('food');
    }
    // There can be an arbitrary number of text fields added.
    let i = 0;
    while (`add_fields_text${i}` in this.form.data) {
      const fieldName = `text${i}`;
      additionalFields.properties[fieldName] = {
        type: 'string',
        minLength: 1,
        title: this.form.data[`add_fields_text${i}`],
      };
      additionalFields.required.push(fieldName);
      delete this.form.data[`add_fields_text${i}`];
      i += 1;
    }
    // Remove our intermediate form states from the the data that is uploaded
    if ('add_fields_sbb' in this.form.data) delete this.form.data.add_fields_sbb;
    if ('add_fields_food' in this.form.data) delete this.form.data.add_fields_food;

    // If there are no additional_fields, the properties are empty, and we null the whole field,
    // otherwise we send a json string of the additional fields object
    if (Object.keys(additionalFields.properties).length > 0) {
      this.form.data.additional_fields = JSON.stringify(additionalFields);
    } else {
      this.form.data.additional_fields = null;
    }

    // Translate state high_priority into a priority for the event
    if (this.form.data.high_priority === true) this.form.data.priority = 10;
    else this.form.data.priority = 1;
    delete this.form.data.high_priority;

    // Change moderator from user object to user id
    if (this.form.data.moderator) this.form.data.moderator = this.form.data.moderator._id;

    // if spots is not set, also remove 'allow_email_signup'
    if (!('spots' in this.form.data) && 'allow_email_signup' in this.form.data
        && !this.form.data.allow_email_signup) {
      delete this.form.data.allow_email_signup;
    }

    // Propose Event <=> Submit Changes dependent on the user rights
    if (this.rightSubmit) {
      // Submition tool
      if (Object.keys(images).length > 0) {
        const imageForm = new FormData();
        Object.keys(images).forEach(key => imageForm.append(key, images[key]));
        imageForm.append('_id', this.form.data._id);
        imageForm.append('_etag', this.form.data._etag);
        // first upload the images as formData, then the rest as JSON
        this.controller.handler.patch(imageForm).then(({ _etag }) => {
          this.submit({ ...this.form.data, _etag });
        });
      } else this.submit(this.form.data);
    } else {
      // Propose tool
      Dialog.show({
        title: 'Congratulations!',
        body: [
          m(
            'div',
            'You sucessfuly setup an event.',
            'Please send this link to the respectiv board member for validation.',
          ),
          m('input', {
            type: 'text',
            style: { width: '335px' },
            value: `${ownUrl}/newevent?${m.buildQueryString({
              proposition: window.btoa(JSON.stringify(this.form.data)),
            })}`,
            id: 'textId',
          }),
        ],
        backdrop: true,
        footerButtons: [
          m(Button, {
            label: 'Copy',
            events: {
              onclick: () => {
                const copyText = document.getElementById('textId');
                copyText.select();
                document.execCommand('copy');
              },
            },
          }),
        ],
      });
    }
  }

  view() {
    if (!this.form.schema) return m(loadingScreen);

    // load image urls from the API data
    ['thumbnail', 'poster', 'infoscreen'].forEach((key) => {
      const img = this.form.data[`img_${key}`];
      if (typeof (img) === 'object' && img !== null && 'file' in img) {
        // the data from the API has a weird format, we only need the url to display the image
        this.form.data[`img_${key}`] = { url: `${apiUrl}${img.file}` };
      }
    });

    console.log(this.form.errors, this.form.valid);

    // Define the number of Tabs and their titles
    const titles = ['Event Description', 'When and Where?', 'Signups', 'Internal Info'];
    if (this.rightSubmit) titles.push('Images');
    // Data fields of the event in the different tabs. Ordered the same way as the titles
    const keysPages = [[
      'title_en',
      'catchphrase_en',
      'description_en',
      'title_de',
      'catchphrase_de',
      'description_de',
    ],
    ['time_start', 'time_end', 'location'],
    ['price', 'spots', 'time_register_start', 'time_register_end'],
    ['moderator', 'time_advertising_start', 'time_advertising_end'],
    [],
    ];
    // Look which Tabs have errors
    const errorPages = keysPages.map(keysOfOnePage => keysOfOnePage.map((key) => {
      if (this.form.errors && key in this.form.errors) return this.form.errors[key].length > 0;
      return false;
    }).includes(true));

    // Navigation Buttons to go to next/previous page
    const buttonRight = m(Button, {
      label: m('div.pe-button__label', m(Icon, {
        svg: { content: m.trust(icons.ArrowRight) },
        style: { top: '-5px', float: 'right' },
      }), 'next'),
      disabled: this.currentpage === titles.length,
      ink: false,
      border: true,
      className: 'nav-button',
      events: { onclick: () => { this.currentpage = Math.min(this.currentpage + 1, 5); } },
    });
    const buttonLeft = m(Button, {
      label: m('div.pe-button__label', m(Icon, {
        svg: { content: m.trust(icons.ArrowLeft) },
        style: { top: '-5px', float: 'left' },
      }), 'previous'),
      disabled: this.currentpage === 1,
      ink: false,
      border: true,
      className: 'nav-button',
      events: { onclick: () => { this.currentpage = Math.max(1, this.currentpage - 1); } },
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
      },
      value: this.selection_strategy,
    });

    // Processing for additional text fields users have to fill in for the signup.
    const addFieldsText = [];
    let i = 0;
    while (`add_fields_text${i}` in this.form.data) {
      addFieldsText.push(this.form._renderField(`add_fields_text${i}`, {
        type: 'string',
        label: `Label for Textfield ${i}`,
      }));
      const fieldIndex = i;
      addFieldsText.push(m(Button, {
        label: `Remove Textfield ${i}`,
        className: 'red-row-button',
        events: {
          onclick: () => {
            let index = fieldIndex;
            while (`add_fields_text${index + 1}` in this.form.data) {
              this.form.data[`add_fields_text${index}`] =
                this.form.data[`add_fields_text${index + 1}`];
              index += 1;
            }
            delete this.form.data[`add_fields_text${index}`];
            this.add_fields_text_index = index;
          },
        },
      }));
      i += 1;
    }

    // checks currentPage and selects the fitting page
    return this.layout([
      // navigation bar
      // all pages are displayed, current is highlighted,
      // validation errors are shown per page by red icon-background
      m(Tabs, {
        className: 'edit-tabs',
        // it would be too easy if we could set the background color in the theme class
        style: { backgroundColor: colors.orange },
        onChange: ({ index }) => { this.currentpage = index + 1; },
        centered: true,
        selectedTabIndex: this.currentpage - 1,
      }, [...titles.entries()].map((numAndTitle) => {
        const buttonAttrs = { label: numAndTitle[1] };
        if (errorPages[numAndTitle[0]]) {
          // in case of an error, put an error icon before the tab label
          buttonAttrs.label = m('div', m(Icon, {
            svg: { content: m.trust(icons.error) },
            style: { top: '-2px', 'margin-right': '4px' },
          }), numAndTitle[1]);
        }
        return buttonAttrs;
      })),
      m('div.maincontainer', { style: { height: 'calc(100vh - 180px)', 'overflow-y': 'auto' } }, [
        // page 1: title & description
        m('div', {
          style: { display: (this.currentpage === 1) ? 'block' : 'none' },
        }, [
          ...this.form.renderSchema(['title_en', 'catchphrase_en']),
          this.form._renderField('description_en', {
            type: 'string',
            label: 'English Description',
            multiLine: true,
            rows: 5,
          }),
          ...this.form.renderSchema(['title_de', 'catchphrase_de']),
          this.form._renderField('description_de', {
            type: 'string',
            label: 'German Description',
            multiLine: true,
            rows: 5,
          }),
        ]),
        // page 2: when & where
        m('div', {
          style: { display: (this.currentpage === 2) ? 'block' : 'none' },
        }, this.form.renderSchema(['time_start', 'time_end', 'location'])),
        // page 3: registration
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
          ...this.hasprice && this.form.renderSchema(['price']),
          m('br'),
          m(Switch, {
            label: 'people have to register to attend this event',
            checked: this.hasregistration,
            onChange: ({ checked }) => {
              this.hasregistration = checked;
              if (!checked) {
                // remove all the data connected to registration
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
          ...this.hasregistration && this.form.renderSchema([
            'spots', 'time_register_start', 'time_register_end']),
          this.hasregistration && this.form._renderField('add_fields_food', {
            type: 'boolean',
            label: 'Food Limitations',
          }),
          this.hasregistration && this.form._renderField('add_fields_sbb', {
            type: 'boolean',
            label: 'SBB Abonnement',
          }),


          m('br'),
          ...this.hasregistration && addFieldsText,
          m('br'),
          this.hasregistration && m(Button, {
            label: 'Additional Textfield',
            className: 'blue-button',
            border: true,
            events: {
              onclick: () => {
                this.form.data[`add_fields_text${this.add_fields_text_index}`] = '';
                this.add_fields_text_index += 1;
              },
            },
          }),
          m('br'),
          ...this.hasregistration && this.form.renderSchema(['allow_email_signup']),
          this.hasregistration && radioButtonSelectionMode,
        ]),
        // PAGE 4: Internal Info
        m('div', {
          style: { display: (this.currentpage === 4) ? 'block' : 'none' },
        }, [
          m('div', { style: { display: 'flex', 'margin-top': '5px' } }, [
            m(TextField, {
              label: 'Moderator: ',
              disabled: true,
              style: { width: '200px' },
              help: 'Can edit the event and see signups.',
            }),
            m('div', { style: { 'flex-grow': 1 } }, m(ListSelect, {
              controller: this.userController,
              selection: this.form.data.moderator,
              listTileAttrs: user => Object.assign(
                {},
                { title: `${user.firstname} ${user.lastname}` },
              ),
              selectedText: user => `${user.firstname} ${user.lastname}`,
              onSelect: (data) => { this.form.data.moderator = data; },
            })),
          ]),
          ...this.form.renderSchema(['time_advertising_start', 'time_advertising_end']),
          ...this.form.renderSchema(['show_website', 'show_announce', 'show_infoscreen']),
          // pritority update
          this.form._renderField('high_priority', {
            type: 'boolean',
            label: 'Set high Priority',
          }),
          m('div', 'Please send your announce text additionally via email to info@amiv.ch ' +
          'until the new announce tool is ready.'),
          m('div', 'Please send an email to info@amiv.ch in order to show your event on' +
            'the infoscreen until the new infoscreen tool is ready.'),

        ]),

        // page 5: images
        m('div', {
          style: { display: (this.currentpage === 5) ? 'block' : 'none' },

        }, [
          m('div', 'Formats for the files: Thumbnail: 1:1, Poster: Any DIN-A, Infoscreen: 16:9'),
          // All images and placeholders are placed next to each other in the following div:
          m('div', { style: { width: '90%', display: 'flex' } }, [
            // POSTER
            m('div', { style: { width: '30%' } }, [
              m('div', 'Poster'),
              // imgPlaceholder has exactly a 1:1 aspect ratio
              m('div.imgPlaceholder', { style: { width: '100%', 'padding-bottom': '141%' } }, [
                // inside, we display the image. if it has a wrong aspect ratio, grey areas
                // from the imgPlaceholder will be visible behind the image
                this.form.data.img_poster ? m('div.imgBackground', {
                  style: { 'background-image': `url(${this.form.data.img_poster.url})` },
                // Placeholder in case that there is no image
                }) : m('div', 'No Poster'),
              ]),
              m(Button, {
                className: 'red-row-button',
                borders: false,
                label: 'remove',
                events: { onclick: () => { this.form.data.img_poster = null; } },
              }),
            ]),
            // INFOSCREEN
            m('div', { style: { width: '50%', 'margin-left': '5%' } }, [
              m('div', 'Infoscreen'),
              // imgPlaceholder has exactly a 16:9 aspect ratio
              m('div.imgPlaceholder', { style: { width: '100%', 'padding-bottom': '56.25%' } }, [
                // inside, we display the image. if it has a wrong aspect ratio, grey areas
                // from the imgPlaceholder will be visible behind the image
                this.form.data.img_infoscreen ? m('div.imgBackground', {
                  style: { 'background-image': `url(${this.form.data.img_infoscreen.url})` },
                  // Placeholder in case that there is no image
                }) : m('div', 'No Infoscreen Image'),
              ]),
              m(Button, {
                className: 'red-row-button',
                borders: false,
                label: 'remove',
                events: { onclick: () => { this.form.data.img_infoscreen = null; } },
              }),
            ]),
            // THUMBNAIL
            m('div', { style: { width: '10%', 'margin-left': '5%' } }, [
              m('div', 'Thumbnail'),
              // imgPlaceholder has exactly a 16:9 aspect ratio
              m('div.imgPlaceholder', { style: { width: '100%', 'padding-bottom': '100%' } }, [
                // inside, we display the image. if it has a wrong aspect ratio, grey areas
                // from the imgPlaceholder will be visible behind the image
                this.form.data.img_thumbnail ? m('div.imgBackground', {
                  style: { 'background-image': `url(${this.form.data.img_thumbnail.url})` },
                  // Placeholder in case that there is no image
                }) : m('div', 'No Thumbnail'),
              ]),
              m(Button, {
                className: 'red-row-button',
                borders: false,
                label: 'remove',
                events: { onclick: () => { this.form.data.img_thumbnail = null; } },
              }),
            ]),
          ]),
          // old stuff, goes through all images
          ['thumbnail', 'poster', 'infoscreen'].map(key => [
            // input to upload a new image
            m(FileInput, this.form.bind({
              name: `new_${key}`,
              label: `New ${key} Image`,
              accept: 'image/png, image/jpeg',
              onChange: ({ value }) => {
                // if a new image file is selected, we display it using a data encoded url
                const reader = new FileReader();
                reader.onload = ({ target: { result } }) => {
                  this.form.data[`img_${key}`] = { url: result };
                  m.redraw();
                };
                reader.readAsDataURL(value);
                this.form.data[`new_${key}`] = value;
              },
            })),
          ]),

        ]),
        // bottom back & forth Buttons
        m('div', {
          style: {
            display: 'flex',
            'justify-content': 'space-between',
            padding: '35px',
            'padding-top': '20px',
          },
        }, [buttonLeft, buttonRight]),
      ]),
    ], this.rightSubmit ? 'submit' : 'propose', false);
  }
}
