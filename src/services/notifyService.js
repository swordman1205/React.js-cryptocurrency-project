import React from 'react';
import ReactDOM from 'react-dom/server';
import {Alert} from 'antd';

function hideAlert(domElem) {
    const alert = domElem.querySelector('.ant-alert');
    alert && alert.classList.remove('show');
    domElem.innerHTML = '';
}

function show(type, delay = 6000, domElem, message, description) {
    const onHide = () => hideAlert(domElem);
    domElem.innerHTML = ReactDOM.renderToString(
        <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', maxWidth: '500px', display: 'inline-flex'}}>
            <Alert className="custom-alert" show type={type} description={description} message={message} closable
                   showIcon/>
        </div>);
    domElem.classList.add('showed');

    setTimeout(() => {
        const alert = domElem.querySelector('.ant-alert');
        const closeBtn = domElem.querySelector('.ant-alert-close-icon');
        closeBtn && closeBtn.addEventListener('click', onHide);
        alert.classList.add('show');
    }, 300);

    setTimeout(() => {
        const closeBtn = domElem.querySelector('.ant-alert-close-icon');
        closeBtn && closeBtn.removeEventListener('click', onHide);
        onHide();
    }, delay);
}

const domElem = document.querySelector('#alert-portal');

export function showInfo(title, description, delay) {
    show('info', delay, domElem, title, description);
}

export function showSuccess(title, description, delay) {
    show('success', delay, domElem, title, description);
}

export function showWarning(title, description, delay) {
    show('warning', delay, domElem, title, description);
}

export function showDanger(title, description, delay) {
    show('error', delay, domElem, title, description);
}

