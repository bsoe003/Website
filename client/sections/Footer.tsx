// Dependencies
import * as React from 'react';

// Types
import Profile from '@models/Profile';

// Components
import Icon from '@client/icons';

// Utilities
import { SOCIAL_ICON_VIEWBOX } from '@client/utils/constants';

// Styles
import * as styles from '@client/styles/footer.scss';

const profiles: Profile[] = [
  Profile.LINKEDIN,
  Profile.GITHUB,
  Profile.TWITTER,
  Profile.PINTEREST,
];

enum Style {
  SOCIAL = 'social',
}

const Footer = () => (
  <footer>
    <small>&copy; 2018 • Brian Soe • Custom Built.</small>
    <section id={styles[Style.SOCIAL]}>
      {profiles.map(profile => (
        <a
          key={profile.label}
          href={profile.link}
          target="_blank"
          className={styles[Style.SOCIAL]}
        >
          <svg
            version="1.1"
            id={styles[profile.label]}
            viewBox={SOCIAL_ICON_VIEWBOX}
          >
            <Icon.Social type={profile} />
          </svg>
        </a>
      ))}
    </section>
  </footer>
);

export default Footer;
