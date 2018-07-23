import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import BasicRoute from './Routers/basic.router';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BasicRoute />, document.getElementById('admin-root'));

registerServiceWorker();
