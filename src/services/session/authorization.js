import request from 'axios';
import {post, get, put} from '../api/index';
import {getLoginPath, getUserDashboardPath, getHomePath} from '../../utils/urlBuilder';
import history from '../../utils/history';
import {showSuccess, showWarning, showDanger} from '../notifyService';

const TOKEN_KEY = 'AUTH_TOKEN';
const regPath = '/users/register/';
const authPath = 'obtain-auth-token/';
const resetPath = '/users/password/reset/';
const updatePath = '/users/change-password/';
const referralPath = '/users/me/';
const walletsPath = '/wallets/';
const transactionsPath = "/transactions/";
const confirmPasswordPath = '/users/password/reset/confirm/';
const tasksPath = '/tasks/';
const profilePath = '/users/me/';
const showTransactionsPath = '/transactions/show/';
const getReferralsPath = '/users/referrals';
const userActivatePath = '/users/activate/';

const withdrawPaymentMethodsPath = '/payment_methods/?filter=withdraw';
const depositPaymentMethodsPath = '/payment_methods/?filter=deposit';
const transferFundPath = '/transactions/transfer/';
const withdrawPath = '/transactions/withdraw/';
const depositPath = '/transactions/deposit/';


const usersPath = '/users/';

export function getProfile(){
    return new Promise(resolve =>
        get(profilePath).then((resp) => {

            if (!resp.error) {
                console.log('-------login response---------');
                console.log(resp);
                const token = resp.data.token;
                showSuccess('Success', 'You have been successfully login');
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}


export function login(data) {
    return new Promise(resolve =>
        post(authPath, data, false).then((resp) => {
            if (!resp.error) {
                const token = resp.data.token;
                setRestClientToken(token);
                saveToken(token);
                showSuccess('Success', 'You have been successfully login');
                setTimeout(() => history.push(getUserDashboardPath()), 0);
            }
            if (resp.error && resp.error.message) {
                showWarning('Authorization error!', resp.error.message);
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}

export function registration(data) {
    return new Promise(resolve =>
        post(regPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'You have been successfully registered');
                history.push(getLoginPath(resp.data.email));
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}

export function updatePassword(data) {
    return new Promise(resolve =>
        post(updatePath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', resp.data.message);
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}

export function resetPassword(email) {
    return new Promise(resolve =>
        post(resetPath, email).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', resp.data.detail);
                history.push(getLoginPath(resp.data.email));
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}

export function confirmNewPassword(data, uidb64, token) {
    const preparedPath = `${confirmPasswordPath}${uidb64}/${token}/`;
    return new Promise(resolve =>
        post(preparedPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', resp.data.detail);
                history.push(getLoginPath(resp.data.email));
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}

export function getReferral() {
    return new Promise(resolve =>
        get(referralPath).then((resp) => {
            if (!resp.error) {
                console.log(resp.data.referral_link);
                showSuccess('Success', resp.data.referral_link);
            }
            resolve(resp);
        })
            .catch(err => {
                resolve(false); // not provide internal server error
            })
    );
}

export function logout(redirectPath = getHomePath()) {
    setRestClientToken(null);
    dropToken();
    setTimeout(() => history.push(redirectPath), 10);
}

export function restoreSession() {
    const token = loadToken();
    setRestClientToken(token);
}

export function isLoggedIn() {
    const storageToken = loadToken();
    return storageToken && getRestClientToken();
}

function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function dropToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function loadToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setRestClientToken(token) {
    if (token) {
        request.defaults.headers.common.Authorization = `Token ${token}`;
    } else {
        delete request.defaults.headers.common.Authorization;
    }
}

function getRestClientToken() {
    return request.defaults.headers.common.Authorization;
}


export function getWallets(data) {
    const token = loadToken();
    return new Promise(resolve =>
        get(walletsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Wallets Have been successfully fetched');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function postWallets(data) {
    const token = loadToken();
    return new Promise(resolve =>
        post(walletsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Wallets Have been successfully posted');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function getTransactions(data) {
    return new Promise(resolve =>
        get(transactionsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Transactions Have been successfully fetched');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}


export function postTransferFund(data) {
    console.log(data);
    return new Promise(resolve =>
        post(transferFundPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Funds Have been successfully transferred');
            } 

        
            resolve(resp);
        })
        .catch(err => {
          
            resolve(false); // not provide internal server error
        })
    );
}

export function createWithdraw(data) {
    console.log(data);
    return new Promise(resolve =>
        post(withdrawPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Withdraw request posted successfully!');
            } 
            resolve(resp);
        })
        .catch(err => {
          
            resolve(false); // not provide internal server error
        })
    );
}

export function createDeposit(data) {
    console.log(data);
    return new Promise(resolve =>
        post(depositPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Deposit request posted successfully!');
            } 
            resolve(resp);
        })
        .catch(err => {
          
            resolve(false); // not provide internal server error
        })
    );
}


export function postTransactions(data) {
    console.log(data);
    return new Promise(resolve =>
        post(transactionsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Transactions Have been successfully posted');
            } 

        
            resolve(resp);
        })
        .catch(err => {
          
            resolve(false); // not provide internal server error
        })
    );
}

export function showTransactions(data){
    console.log(data);
    return new Promise(resolve =>
        get(showTransactionsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Transactions Have been successfully fetched');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function getTasks(data) {
    return new Promise(resolve =>
        get(tasksPath, data).then((resp) => {
            resolve(resp.data); 
        })
        .catch(err => resolve(false))
    );
}

export function updateTask(data) {
    const path = `${tasksPath}${data.id}/`;
    return new Promise(resolve => {
        put(path, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Task has been successfully updated');
            }
            resolve(resp.data);
        })
        .catch((err) => resolve(false))
    });
}

export function getWithdrawPaymentMethods(data){
    return new Promise(resolve =>
        get(withdrawPaymentMethodsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Withdraw Payment Methods Have been successfully fetched');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function getDepositPaymentMethods(data){
    return new Promise(resolve =>
        get(depositPaymentMethodsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Deposit Payment Methods Have been successfully fetched');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}


export function getReferrals(data){
    console.log(data);
    return new Promise(resolve =>
        get(getReferralsPath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Referrals Have been successfully fetched');
            }
            resolve(resp);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function activateUser(data) {
    return new Promise(resolve =>
        post(userActivatePath, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'User Have been successfully Activated!');
            } else {
                showDanger('Error', resp.error.data.message);
            }
            resolve(resp.data);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function addCustomer(data) {
    const url = `${usersPath}kyc_post/`;
    return new Promise(resolve =>
        post(url, data).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'KYC Data Have been successfully Created!');
            } else {
                let message;
                for (let key in resp.error.data) {
                    message = resp.error.data[key][0];
                }
                showDanger('Error', message);
            }
            resolve(resp.data);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}

export function interactTask(id) {
    const url = `${tasksPath}${id}/interact/`;
    return new Promise(resolve =>
        post(url).then((resp) => {
            if (!resp.error) {
                showSuccess('Success', 'Task Have been successfully Updated!');
            }
            resolve(resp.data);
        })
        .catch(err => {
            resolve(false); // not provide internal server error
        })
    );
}
