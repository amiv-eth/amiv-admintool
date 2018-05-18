import { ButtonCSS, addTypography } from 'polythene-css';
import { styler } from 'polythene-core-css';

addTypography();

export const colors = {
	amiv_blue: '#1F2D54',
	amiv_red: '#e8462b',
	green: '#4ef599',
	light_blue: '#5378E1',
	orange: 'orange',
}

ButtonCSS.addStyle('.blue-button', {
  color_light_text: colors.light_blue,
});

ButtonCSS.addStyle('.blue-button-filled', {
  color_light_background: colors.amiv_blue,
  color_light_text: 'white',
});

ButtonCSS.addStyle('.red-row-button', {
  color_light_text: 'white',
  color_light_background: colors.amiv_red,
  padding_h: 0,
  font_size: 12,
  margin_h: 0,
});

// style for general containers
const style = [
  {
    '.maincontainer': {
      padding: '10px',
    },
    '.viewcontainer': {
      display: 'flex',
      'flex-wrap': 'wrap',
    },
    '.viewcontainercolumn': {
      width: '500px',
      'flex-grow': 1,
      padding: '10px',
    },
  },
];
styler.add('containers', style);