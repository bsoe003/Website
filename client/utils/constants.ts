/* Screen Size */
export const TABLET_WIDTH = 992;
export const MOBILE_WIDTH = 600;

/* Logo SVG Size */
export const LOGO_SIZE_CONFIG = {
  coefficient: { width: 0.02564102564, height: 1.25 },
  mobile: { width: 25, height: 30 },
  tablet: { width: 35, height: 40 },
};
export const LOGO_WAIT_TIME = 25;
export const LOGO_VIEWBOX = '0 0 90 120';

/* Social Icon SVG Size */
export const SOCIAL_ICON_VIEWBOX = '0 0 32 32';

/* Typing Animation */
const BLINK_PAUSE_TIME = 3000;
export const ROLES = [
  'Software Engineer',
  'Front-End Engineer',
  'Full-Stack Engineer',
].map(role => `${role}^${BLINK_PAUSE_TIME}`);
