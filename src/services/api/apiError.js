import {showDanger} from '../notifyService';
import {logout} from '../session/authorization';
import {getLoginPath} from '../../utils/urlBuilder';

const showErrorTime = 5000;

function parseHttpError(error) {
    return new Promise((resolve, reject) => {
        const response = error.response;
        
        if (response) { //api errors

            if (response.status === 400) { //api data error
                if (response.data.non_field_errors) {
                    resolve({
                        error: {
                            message: response.data.non_field_errors,
                        },
                    });
                } else {
                    resolve({
                        error: {
                            data: response.data,
                        },
                    });
                }
                return;
            }
            if (response.status === 403) { //api permission error
                showDanger('Access denied', response.data.detail, showErrorTime);
                logout(getLoginPath());
                return;
            }
            if (response.status === 401) { //api permission error
                showDanger('Unauthorized', response.data.detail, showErrorTime);
                logout(getLoginPath());
                //checkRedirectPermission();
                return;
            }
            if (response.status === 500) { //api server internal error
                showDanger('Internal server error', 'Please try again late', showErrorTime);
                reject({
                    message: response.message,
                    data: response.data,
                });
            }
        }

        //parse network error and server internal error
        const internalError = (error && error.message) || 'Please try again late';
        showDanger('Network or internal server error', internalError, showErrorTime);
        reject({error: internalError});
    });
}

export default {parseHttpError};
