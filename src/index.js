import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Configurator from './Configurator';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Configurator />, document.getElementById('root'));
registerServiceWorker();
