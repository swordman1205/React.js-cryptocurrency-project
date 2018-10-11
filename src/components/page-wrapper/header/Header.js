import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Button, Layout} from 'antd';
import img from './logo.svg';
import {isLoggedIn, logout} from '../../../services/session/authorization';
import {getLoginPath, getRegistrationPath, getHomePath} from '../../../utils/urlBuilder';
import './header.scss';


const {Header} = Layout;

export default class HeaderComponent extends Component {
    render() {
        return (
            <Header className="header">
                <Layout>
                    <div className="logo">
                        <Link to={getHomePath()}><img alt='logo' src='http://res.cloudinary.com/sheilafox/image/upload/v1525361993/logo.png' /></Link>
                    </div>
                    <div className="nav-items">
                        {!isLoggedIn() && <Link to={getLoginPath()}>Login</Link>}
                        {!isLoggedIn() && <Link to={getRegistrationPath()}><Button type="primary">Register</Button></Link>} 
                        {isLoggedIn() && <Button type="primary" onClick={() => logout()}>Logout</Button>}
                    </div>
                </Layout>
            </Header>
        );
    }
}
