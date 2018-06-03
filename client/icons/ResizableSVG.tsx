// Dependencies
import * as React from 'react';

// Types
import ReactProps from '@models/ReactProps';
import ReactState from '@models/ReactState';

// Utilities
import { MOBILE_WIDTH, TABLET_WIDTH } from '@client/utils/constants';
import debounce from '@client/utils/debounce';

type SVGSize = {
  width: number;
  height: number;
};

type Config = {
  coefficient: SVGSize;
  mobile: SVGSize;
  tablet: SVGSize;
};

type Props = ReactProps & {
  viewBox?: string;
  waitTime?: number;
  config: Config;
};

type State = ReactState & {
  updated: Date;
};

class ResizableSVG extends React.PureComponent<Props, State> {
  public static defaultProps = {
    viewBox: '0 0 0 0',
  };

  private width: number;
  private height: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      updated: new Date(),
    };
  }

  componentWillMount() {
    const { waitTime: WAIT_TIME } = this.props;
    this.updateSize();
    this.updateSize = debounce(this.updateSize, WAIT_TIME || 0).bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  updateSize() {
    const { clientWidth } = document.body;
    const { coefficient, mobile, tablet } = this.props.config;

    if (clientWidth <= MOBILE_WIDTH) {
      this.width = mobile.width;
      this.height = mobile.height;
    } else if (clientWidth <= TABLET_WIDTH) {
      this.width = tablet.width;
      this.height = tablet.height;
    } else {
      this.width = document.body.clientWidth * coefficient.width;
      this.height = this.width * coefficient.height;
    }

    this.setState({ updated: new Date() });
  }

  render() {
    const { width, height } = this;
    const { id, viewBox, children } = this.props;
    const props = { id, width, height, viewBox };
    return (
      <svg {...props} version="1.1">
        {children}
      </svg>
    );
  }
}

export default ResizableSVG;
