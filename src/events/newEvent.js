import m from 'mithril';
import { Button, Checkbox, RadioGroup, IconButton, SVG, TextField } from 'polythene-mithril';
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
    if (this.currentpage === 5) {
      this.currentpage = 4;
    }
  }

  subOne() {
    this.currentpage = this.currentpage - 1;
    if (this.currentpage === 0) {
      this.currentpage = 1;
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

    const secondTableInputs = {
      location: {
        label: 'Location',
      },
      time_start: {
        label: 'Event Start [Date and Time]:',
        help: 'Format: 01.01.1970-18:00',
        focusHelp: true,
      },
      time_end: {
        label: 'Event End [Date and Time]:',
        help: 'Format: 01.01.1970-1800',
        focusHelp: true,
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
      }
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

    const title = [
      'Create an Event', 'When and Where?', 'Signups', 'Advertisement'
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
      }, Object.keys(secondTableInputs).map((key) => {
        const attrs = secondTableInputs[key];
        const attributes = Object.assign({}, attrs);
        attributes.name = key;
        attributes.floatingLabel = true;
        return m(textInput, this.bind(attributes));
      })),
      m('div', {
        style: {
          display: (this.currentpage === 3) ? 'block' : 'none',
        },
      }, Object.keys(thirdTableInputs).map((key) => {
        const attrs = thirdTableInputs[key];
        const attributes = Object.assign({}, attrs);
        attributes.name = key;
        attributes.floatingLabel = true;
        return m(textInput, this.bind(attributes));
      })),
      m('div', {
        style: {
          display: (this.currentpage === 4) ? 'block' : 'none',
        },
      }, Object.keys(forthTableInputs).map((key) => {
        const attrs = forthTableInputs[key];
        const attributes = Object.assign({}, attrs);
        attributes.name = key;
        attributes.floatingLabel = true;
        return m(textInput, this.bind(attributes));
      })),
    ]);
  }
}
