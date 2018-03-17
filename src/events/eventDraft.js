import m from 'mithril';
import { Button, Card } from "polythene-mithril"
import EditView from '../views/editView';
import { styler } from 'polythene-core-css';

const draftStyle = [
	{
		'.footer': {
		    position: 'fixed',
		    left: 0,
		    bottom: 0,
		    width: '100%', 
		    'background-color': 'red',
		    color: 'white',
		    'text-align': 'center',
		}
	}
]

styler.add('eventDraft', draftStyle);


export default class eventDraft extends EditView {
  constructor(vnode) {
    super(vnode, 'events');
  }

  view() {
  	
  	
    const buttonMaker = m(Button, {
    	label: "Submit Request",

    });


    //	])
    return m('div',[
    	m('h1', {class: "title"}, "Request a new event"),
    	m('div.footer', buttonMaker),
    ]);
  }
}
