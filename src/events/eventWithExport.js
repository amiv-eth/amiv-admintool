import m from 'mithril';
import { TextField } from 'polythene-mithril';
import { Button } from 'polythene-mithril';
import EditView from '../views/editView';

export default class eventWithExport extends EditView {
    constructor(vnode) {
        super(vnode, 'events');
    }

    view() {
        // German and English Information
        const fieldTitleEn = m(TextField, {
            label: 'Event Title [EN]',
            required: true,
            floatingLabel: true,
            dense: true,
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

        return m('div', [
            //m('h1', 'Event description:', fieldTitleEn, fieldCatchphraseEn, fieldDescriptionEn,
            //fieldTitleDe, fieldCatchphraseDe, fieldDescriptionDe),
            m('h1', 'Critical Information:', fieldStartDate, fieldEndDate, fieldStartRegDate, fieldEndRegDate, fieldLocation, fieldPrice, fieldNumberOfParticipants),
        ]);
    }
}