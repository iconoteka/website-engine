import React from 'react';
import ReactDOM from 'react-dom';
import 'common-styles/index.scss';

import App from './App';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
unregisterServiceWorker();
