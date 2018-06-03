// Dependencies
import * as React from 'react';

// Types
import ReactProps from '@models/ReactProps';
import Profile from '@models/Profile';

// Components
import LinkedIn from '@client/icons/social/LinkedIn';
import Github from '@client/icons/social/Github';
import Twitter from '@client/icons/social/Twitter';
import Pinterest from '@client/icons/social/Pinterest';

type Props = ReactProps & {
  type?: Profile;
};

const Social = (props: Props) => {
  switch (props.type) {
    case Profile.LINKEDIN:
      return React.createElement(LinkedIn);
    case Profile.GITHUB:
      return React.createElement(Github);
    case Profile.TWITTER:
      return React.createElement(Twitter);
    case Profile.PINTEREST:
      return React.createElement(Pinterest);
    default:
      return null;
  }
};

export default Social;
