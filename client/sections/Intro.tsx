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
import '@client/styles/intro.scss';

class Intro extends React.PureComponent {
  private _typed?: Typed;

  constructor(props: object) {
    super(props);
  }

  componentDidMount() {
    this._typed = new Typed('.role', {
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
      <section id="intro">
        <h1>
          Hi, I'm&nbsp;
          <ResizableSVG
            id="logo"
            viewBox={LOGO_VIEWBOX}
            waitTime={LOGO_WAIT_TIME}
            config={LOGO_SIZE_CONFIG}
          >
            <Icon.Logo />
          </ResizableSVG>
          rian!
        </h1>
        <h4 className="role" />
        <br />
        <a id="resume" href="/resume" target="_blank">
          Open Résumé
        </a>
      </section>
    );
  }
}

export default Intro;
