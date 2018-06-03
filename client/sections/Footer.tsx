// Dependencies
import * as React from 'react';

// Types
import Profile from '@models/Profile';

// Components
import Icon, { ResizableSVG } from '@client/icons';

// Utilities
import { SOCIAL_ICON_VIEWBOX } from '@client/utils/constants';

// Styles
import '@client/styles/footer.scss';

const profiles: Profile[] = [
  Profile.LINKEDIN,
  Profile.GITHUB,
  Profile.TWITTER,
  Profile.PINTEREST,
];

const Footer = () => (
  <footer>
    <small>&copy; 2018 • Brian Soe • Custom Built.</small>
    <section id="social">
      {profiles.map(profile => (
        <a
          key={profile.label}
          href={profile.link}
          target="_blank"
          className="social"
        >
          <svg id={profile.label} version="1.1" viewBox={SOCIAL_ICON_VIEWBOX}>
            <Icon.Social type={profile} />
          </svg>
        </a>
      ))}
    </section>
  </footer>
);

export default Footer;
