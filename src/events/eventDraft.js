import { styler } from 'polythene-core-css';
import m from 'mithril';
import { Button, RadioGroup, TextField } from 'polythene-mithril';
import EditView from '../views/editView';


const draftStyle = [
	{
		'.footer': {
		    position: 'fixed',
		    left: 0,
		    bottom: 0,
		    width: '100%', 
		    'background-color': '#E8462B',
		    color: '#FFFFFF',
		    'text-align': 'right',
		}
	}
]

styler.add('eventDraft', draftStyle);


export default class eventDraft extends EditView {
  constructor(vnode) {
    super(vnode, 'events');

    this.data = {};
  }

  view(){
	const radioButtonSelectionMode = m(RadioGroup, {
	      name: 'Selection Mode',
	      buttons: [
	        {
	          value: true,
	          label: 'Yes, create the project.',
	        },
	        
	        
	        {
	          value: false,
	          label: 'No, deny the request.',
            },
	      ],
          onChange: ({ value }) => { this.data.create = value; console.log(this.data); }
	    });

    const Comment = m(TextField, {
                label: 'Comment',
                required: true,
                onChange: ({ value }) => this.data.comment = value,
            });
    
     // Submit Button
     const buttonMaker = m(Button, {
        label: 'Submit Request',
        color: 'white',

        // Error pop-up in case not all mandatory fields were completed
        // CURRENTLY: Error triggered onclick
        //if(one of the fields isn't )
        events: {
                    onclick: () => alert('You did not complete all prioritary fields!'),
                }
     });



    return m('div', [
    	m("main", [
            m('h2', { class: 'title' }, 'Creating a new event:'),
            m('h3', 'Do you wish to create this event?(Admin only): '),
            radioButtonSelectionMode,
            Comment,
    	   m('div.footer', buttonMaker),
            ]
        )
        ]
        )
  }
}
