// Dependencies
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Components
import Application from '@client/Application';

// Utils
import Analytics from '@client/utils/analytics';

ReactDOM.render(<Application />, document.getElementById('root'), () => {
  if (process.env.NODE_ENV === 'production') {
    Analytics.start();
  }
});
