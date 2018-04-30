import { ButtonCSS, addTypography } from 'polythene-css';

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
