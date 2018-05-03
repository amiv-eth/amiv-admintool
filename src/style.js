import { ButtonCSS, addTypography } from 'polythene-css';
import { styler } from 'polythene-core-css';

addTypography();

ButtonCSS.addStyle('.blue-button', {
  color_light_text: 'blue',
});

ButtonCSS.addStyle('.red-row-button', {
  color_light_text: 'white',
  color_light_background: 'red',
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
      'min-width': '400px',
      'flex-grow': 1,
      padding: '10px',
    },
  },
];
styler.add('containers', style);
