import { ButtonCSS, addTypography, CardCSS, ShadowCSS } from 'polythene-css';
import { styler } from 'polythene-core-css';

addTypography();

// https://material.io/tools/color/#!/?view.left=0&view.right=1&secondary.color=e8462b&primary.color=274284
export const colors = {
  amiv_blue: '#1F2D54',
  amiv_red: '#e8462b',
  green: '#4ef599',
  blue: '#274284',
  //light_blue: '#5378E1',
  light_blue: '#5a6db4',
  orange: 'orange',
};

ButtonCSS.addStyle('.blue-button', {
  color_light_text: colors.blue,
});

ButtonCSS.addStyle('.blue-button-filled', {
  color_light_background: colors.blue,
  color_light_text: 'white',
});

ButtonCSS.addStyle('.red-row-button', {
  color_light_text: 'white',
  color_light_background: colors.amiv_red,
  padding_h: 0,
  font_size: 12,
  margin_h: 0,
});

CardCSS.addStyle('.pe-card', {
  border_radius: '4',
});

ShadowCSS.addStyle('.pe-shadow', {
  'shadow-top-z-1': 'initial',
  'shadow-bottom-z-1': '0 0 1px 0 rgba(0, 0, 0, 0.37)',
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
    h1: {
      'margin-top': '0px',
      'margin-bottom': '0px',
    },
  },
];
styler.add('containers', style);