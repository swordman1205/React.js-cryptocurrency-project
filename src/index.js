import {render} from 'react-dom';
import {restoreSession} from './services/session/authorization';
import Routes from './routes';
import './styles/base-styles.scss';
import 'antd/dist/antd.css';

import { SERVER_URL} from './utils/config';

init();

render(Routes, document.querySelector('#app'));


function init() {
	console.log(SERVER_URL);
    restoreSession();
}
