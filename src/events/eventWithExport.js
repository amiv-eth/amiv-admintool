import m from 'mithril';
import { 
    TextField,
    Button,
    Card
} from 'polythene-mithril';
import EditView from '../views/editView';

export default class eventWithExport extends EditView {
    constructor(vnode) {
        super(vnode, 'events');
    }

    view() {
        // Editable by event creator.
        const fieldTitleEn = m(TextField, {
            label: 'Event Title [EN]',
            required: true,
            floatingLabel: true,
            dense: true,
        });
        const fieldDescriptionEn = m(TextField, { 
            label: 'Description [EN]', 
            required: true, 
            floatingLabel: true, 
            dense: true, 
            multiLine: true, 
            rows: 6, 
        });
        const creatorButton = m(Button, {
            label: 'EXPORT'
            // label: 'Create a hyperlink string describing your project.'
        });
        // Needs administrator (Kulturi).
        const fieldLocation = m(TextField, {
            label: 'Location:',
            floatingLabel: true,
            required: true,
        });

        return m('div', [
            m('h1', 'For the event creator:', fieldTitleEn, fieldDescriptionEn, 'For the AMIV administrator:', fieldLocation, creatorButton),
        ]);
    }
}