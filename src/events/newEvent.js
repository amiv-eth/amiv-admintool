import m from 'mithril';
import { TextField, Button, Checkbox, RadioGroup, IconButton, SVG } from 'polythene-mithril';
import EditView from '../views/editView';
import { icons } from '../views/elements';

export default class newEvent extends EditView {
  constructor(vnode) {
    super(vnode, 'events');
    this.currentpage = 1;
  }

  addOne() {
    this.currentpage = this.currentpage + 1;
    if (this.currentpage === 4) {
      this.currentpage = 3;
    }
  }

  subOne() {
    this.currentpage = this.currentpage - 1;
    if (this.currentpage === 0) {
      this.currentpage = 1;
    }
  }

  view(vnode) {
    if (!this.currentpage) return '';
    // German and English Information
    const fieldTitleEn = m(TextField, {
      label: 'Event Title [EN]',
      required: true,
      floatingLabel: true,
      dense: true,
      onChange: (newState) => { this.title_en = newState.value; console.log(this.title_en); },
      value: vnode.state.title_en,
    });

    const fieldCatchphraseEn = m(TextField, {
      label: 'Catchphrase [EN]',
      floatingLabel: true,
      dense: true,
      help: 'Fun description to make your event look more interesting than it is',
      focusHelp: true,
    });

    const fieldDescriptionEn = m(TextField, {
      label: 'Description [EN]',
      required: true,
      floatingLabel: true,
      dense: true,
      multiLine: true,
      rows: 6,
    });

    const fieldTitleDe = m(TextField, {
      label: 'Event Title [DE]',
      floatingLabel: true,
      dense: true,
    });

    const fieldCatchphraseDe = m(TextField, {
      label: 'Catchphrase [DE]',
      floatingLabel: true,
      dense: true,
      help: 'Fun description to make your event look more interesting than it is',
      focusHelp: true,
    });

    const fieldDescriptionDe = m(TextField, {
      label: 'Description [DE]',
      floatingLabel: true,
      dense: true,
      multiLine: true,
      rows: 6,
    });

    // Start of relevant data

    const fieldPrice = m(TextField, {
      label: 'Price:',
      type: 'number',
      help: 'In Rappen/Cents',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });
    const fieldStartDate = m(TextField, {
      label: 'Event Start[Date and Time]:',
      help: 'Format: 01.01.1970-18:00',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });
    const fieldEndDate = m(TextField, {
      label: 'Event End[Date and Time]:',
      help: 'Format: 01.01.1970-1800',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });
    const fieldStartRegDate = m(TextField, {
      label: 'Registration Start[Date and Time]:',
      help: 'Format: 01.01.1970-18:00',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });
    const fieldEndRegDate = m(TextField, {
      label: 'Registration End[Date and Time]:',
      help: 'Format: 01.01.1970-1800',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });
    const fieldLocation = m(TextField, {
      label: 'Location:',
      floatingLabel: true,
      required: true,
    });
    const fieldNumberOfParticipants = m(TextField, {
      label: 'Number of open spots:',
      type: 'number',
      floatingLabel: true,
      required: true,
    });

    // Everything above is working fine atm. (13:35)

    const fieldAdvStart = m(TextField, {
      label: 'Registration Start[Date and Time]:',
      type: 'datetime',
      help: 'Format: 01.01.1970-18:00',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });
    const fieldAdvEnd = m(TextField, {
      label: 'Registration End[Date and Time]:',
      help: 'Format: 01.01.1970-1800',
      focusHelp: true,
      floatingLabel: true,
      required: true,
    });

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
      return m('div', page);
    }
    // checks currentPage and selects the fitting page
    if (this.currentpage === 1) {
      return layoutWith(m(
        'h1', 'Event description:', iconLeft, iconRight, m('br'),
        fieldTitleEn, fieldCatchphraseEn, fieldDescriptionEn, fieldTitleDe,
        fieldCatchphraseDe, fieldDescriptionDe,
      ));
    } else if (this.currentpage === 2) {
      return layoutWith(m(
        'h1', 'Critical Information:', iconLeft, iconRight, m('br'), fieldStartDate,
        fieldEndDate, fieldStartRegDate, fieldEndRegDate, fieldLocation, fieldPrice,
        fieldNumberOfParticipants,
      ));
    } else if (this.currentpage === 3) {
      return layoutWith(m(
        'h1', 'Advertise Information', iconLeft, iconRight, m('br'), fieldAdvStart,
        fieldAdvEnd, checkboxWebsite, checkboxAnnounce, checkboxInfoScreen,
        buttonBannerUp, buttonInfoUp, buttonPosterUp, buttonThumbUp, m('br'),
        buttonUploadAll, m('br'), checkboxAllowMail, radioButtonSelectionMode,
      ));
    }
    return layoutWith(m(''));
  }
}
