import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BasicRoute from './Routers/index.router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BasicRoute />, document.getElementById('root'));
registerServiceWorker();
