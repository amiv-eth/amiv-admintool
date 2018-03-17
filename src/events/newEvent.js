import m from 'mithril';
import { Button, Checkbox, RadioGroup, IconButton, SVG } from 'polythene-mithril';
import { styler } from 'polythene-core-css';
import EditView from '../views/editView';
import { icons, textInput } from '../views/elements';

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
  }

  addOne() {
    this.currentpage = this.currentpage + 1;
    if (this.currentpage === 4) {
      this.currentpage = 3;
    }
    //m.redraw();
  }

  subOne() {
    this.currentpage = this.currentpage - 1;
    if (this.currentpage === 0) {
      this.currentpage = 1;
    }
    //m.redraw();
  }

  view() {
    if (!this.currentpage) return '';
    // German and English Information
    const fieldTitleEn = m(textInput, this.bind({
      name: 'title_en',
      label: 'Event Title [EN]',
      required: true,
      floatingLabel: true,
    }));

    const fieldCatchphraseEn = m(textInput, this.bind({
      name: 'catchphrase_en',
      label: 'Catchphrase [EN]',
      floatingLabel: true,
      help: 'Fun description to make your event look more interesting than it is',
      focusHelp: true,
    }));

    const fieldDescriptionEn = m(textInput, this.bind({
      name: 'description_en',
      label: 'Description [EN]',
      required: true,
      floatingLabel: true,
      multiLine: true,
      rows: 6,
    }));

    const fieldTitleDe = m(textInput, this.bind({
      name: 'title_de',
      label: 'Event Title [DE]',
      floatingLabel: true,
    }));

    const fieldCatchphraseDe = m(textInput, this.bind({
      name: 'catchphrase_de',
      label: 'Catchphrase [DE]',
      floatingLabel: true,
      help: 'Fun description to make your event look more interesting than it is',
      focusHelp: true,
    }));

    const fieldDescriptionDe = m(textInput, this.bind({
      name: 'description_de',
      label: 'Description [DE]',
      floatingLabel: true,
      multiLine: true,
      rows: 6,
    }));

    // Start of relevant data

    const fieldPrice = m(textInput, this.bind({
      name: 'price',
      label: 'Price:',
      type: 'number',
      help: 'In Rappen/Cents',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));
    const fieldStartDate = m(textInput, this.bind({
      name: 'time_start',
      label: 'Event Start[Date and Time]:',
      help: 'Format: 01.01.1970-18:00',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));
    const fieldEndDate = m(textInput, this.bind({
      name: 'time_end',
      label: 'Event End[Date and Time]:',
      help: 'Format: 01.01.1970-1800',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));
    const fieldStartRegDate = m(textInput, this.bind({
      name: 'time_register_start',
      label: 'Registration Start[Date and Time]:',
      help: 'Format: 01.01.1970-18:00',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));
    const fieldEndRegDate = m(textInput, this.bind({
      name: 'time_register_end',
      label: 'Registration End[Date and Time]:',
      help: 'Format: 01.01.1970-1800',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));
    const fieldLocation = m(textInput, this.bind({
      name: 'location',
      label: 'Location:',
      floatingLabel: true,
      required: true,
    }));
    const fieldNumberOfParticipants = m(textInput, this.bind({
      name: 'spots',
      label: 'Number of open spots:',
      type: 'number',
      floatingLabel: true,
      required: true,
    }));
    const fieldAdvStart = m(textInput, this.bind({
      name: 'time_advertising_start',
      label: 'Registration Start[Date and Time]:',
      type: 'datetime',
      help: 'Format: 01.01.1970-18:00',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));
    const fieldAdvEnd = m(textInput, this.bind({
      name: 'time_advertising_end',
      label: 'Registration End[Date and Time]:',
      help: 'Format: 01.01.1970-1800',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    }));

    const buttonBannerUp = m(Button, {
      label: 'Select Banner File',
      events: {
        onclick: () => console.log('click'),
      },
    });

    const buttonInfoUp = m(Button, {
      label: 'Select Infoscreen File',
      events: {
        onclick: () => console.log('click'),
      },
    });

    const buttonPosterUp = m(Button, {
      label: 'Select Poster File',
      events: {
        onclick: () => console.log('click'),
      },
    });

    const buttonThumbUp = m(Button, {
      label: 'Select Thumbnail File',
      events: {
        onclick: () => console.log('click'),
      },
    });

    const buttonUploadAll = m(Button, {
      label: 'Upload',
      events: {
        onclick: () => console.log('click'),
      },
    });

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
    });

    const checkboxWebsite = m(Checkbox, {
      defaultChecked: false,
      label: 'Advertise on Website?',
      value: '100',
    });

    const checkboxInfoScreen = m(Checkbox, {
      defaultChecked: false,
      label: 'Advertise on Infoscreen?',
      value: '100',
    });

    const checkboxAllowMail = m(Checkbox, {
      defaultChecked: false,
      label: 'Allow non AMIV Members?',
      value: '100',
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
    });

    function layoutWith(page) {
      return m('div.mywrapper', page);
    }

    const page1 = {
      view: function () {
        return layoutWith(m(
          'h1', 'Event description:', m('br'), iconLeft, iconRight, m('br'),
          fieldTitleEn, fieldCatchphraseEn, fieldDescriptionEn, fieldTitleDe,
        ));
      },
    };
    const page2 = {
      view: function () {
        return layoutWith(m(
          'h1', 'Critical Information:', m('br'), iconLeft, iconRight, m('br'), fieldStartDate, fieldEndDate, fieldStartRegDate,
          fieldEndRegDate, fieldLocation, fieldPrice, fieldNumberOfParticipants,
        ));
      },
    };
    const page3 = {
      view: function () {
        return layoutWith(m(
          'h1', 'Advertise Information', m('br'), iconLeft, iconRight, m('br'), fieldAdvStart, fieldAdvEnd, checkboxWebsite,
          checkboxAnnounce, checkboxInfoScreen, m('br'), buttonBannerUp, buttonInfoUp, buttonPosterUp,
          buttonThumbUp, m('br'), buttonUploadAll, m('br'), checkboxAllowMail, radioButtonSelectionMode,
        ));
      },
    };   
    // checks currentPage and selects the fitting page
    if (this.currentpage === 1) {
      return m(page1);
    } else if (this.currentpage === 2) {
      return m(page2);
    } else if (this.currentpage === 3) {
      return m(page3);
    }
    return layoutWith(m(''));
  }
}
