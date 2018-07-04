// Dependencies
import * as React from 'react';
import * as Typed from 'typed.js';

// Components
import Icon, { ResizableSVG } from '@client/icons';

// Utilities
import {
  LOGO_SIZE_CONFIG,
  LOGO_VIEWBOX,
  LOGO_WAIT_TIME,
  ROLES,
} from '@client/utils/constants';

// Styles
import * as styles from '@client/styles/intro.scss';

console.log(styles); // tslint:disable-line

enum StyleIdentifier {
  INTRO = 'intro',
  ROLE = 'role',
  LOGO = 'logo',
  RESUME = 'resume',
}

class Intro extends React.PureComponent {
  private _typed?: Typed;

  constructor(props: object) {
    super(props);
  }

  componentDidMount() {
    this._typed = new Typed(`.${styles[StyleIdentifier.ROLE]}`, {
      strings: ROLES,
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    });
  }

  componentWillUnmount() {
    this._typed.destroy();
  }

  render() {
    return (
      <section id={styles[StyleIdentifier.INTRO]}>
        <h1>
          Hi, I'm&nbsp;
          <ResizableSVG
            id={styles[StyleIdentifier.LOGO]}
            viewBox={LOGO_VIEWBOX}
            waitTime={LOGO_WAIT_TIME}
            config={LOGO_SIZE_CONFIG}
          >
            <Icon.Logo />
          </ResizableSVG>
          rian!
        </h1>
        <h4 className={styles[StyleIdentifier.ROLE]} />
        <br />
        <a id={styles[StyleIdentifier.RESUME]} href="/resume" target="_blank">
          Open Résumé
        </a>
      </section>
    );
  }
}

export default Intro;
