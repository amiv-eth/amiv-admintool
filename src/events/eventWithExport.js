import m from 'mithril';
import { 
    TextField,
    Button,
    Card
} from 'polythene-mithril';
import EditView from '../views/editView';
import {styler} from 'polythene-core-css';

const draftStyle = [
    {
        '.footer': {
            position: 'fixed',
            left: 0,
            bottom: 0,
            width: '100%', 
            'background-color': '#E8462B',
            'text-align': 'right',
        }
    }
]

styler.add('eventDraft', draftStyle);

export default class eventWithExport extends EditView {
    constructor(vnode) {
        super(vnode, 'events');
        this.performedEdits = 0;
    }

    view() {
        // Editable by event creator.
        const fieldTitleEn = m(TextField, {
            label: 'Event Title [EN]',
            required: true,
            floatingLabel: true,
            dense: true,
            onChange : (newState) => {this.title_en = newState.value; console.log(this.title_en);},
            value: this.title_en,
        });
        const fieldDescriptionEn = m(TextField, { 
            label: 'Description [EN]', 
            required: true, 
            floatingLabel: true, 
            dense: true, 
            multiLine: true, 
            rows: 6,
            onChange : (newState) => {this.fieldDescriptionEn = newState.value; console.log(this.fieldDescriptionEn);},
            value: this.fieldDescriptionEn,
        });

        // Needs administrator (Kulturi).
        const fieldLocation = m(TextField, {
            label: 'Location:',
            floatingLabel: true,
            required: true,
            onChange : (newState) => {this.fieldLocation = newState.value; console.log(this.fieldLocation);},
            value: this.fieldLocation,
        });
        
        // Bottom.
        const buttonMaker = m(Button, {
            // console.log(JSON.stringify(this.keyDescriptors)),
            label: "Submit Request!",
            onClick: () => alert("You did not finish the editing of the fields.")
        });

        // Return!
        return m('div', {
            style: { height: '100%', 'overflow-y': 'scroll'}
            }, [
            m('h1', 'For the event creator:', fieldTitleEn  , fieldDescriptionEn, 'For the AMIV administrator:', fieldLocation),
            m('div.footer', buttonMaker),
        ]);
    }
}