import m from 'mithril';
import { Button} from "polythene-mithril"
import EditView from '../views/editView';
import { styler } from 'polythene-core-css';



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
  }

  view() {
  	//Submit Button
  	 const buttonMaker = m(Button, {
    	label: "Submit Request",
    	color:   "white",

    	 //Error pop-up in case not all mandatory fields were completed
    	 //CURRENTLY: Error triggered onclick
    	events: {
					onclick: () => alert("You did not complete all prioritary fields!")
				}
     });


    return m('div',[
    	m('h2', {class: "title"}, "Creating a new event:"),
    	m('div.footer', buttonMaker),
    ]);
  }
}
