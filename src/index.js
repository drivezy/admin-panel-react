import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Landing from './Components/Landing/landing.component';

import BasicRoute from './Routers/basic.router';

import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<BasicRoute />, document.getElementById('admin-root'));
ReactDOM.render(<BasicRoute />, document.getElementById('admin-root'));

registerServiceWorker();
