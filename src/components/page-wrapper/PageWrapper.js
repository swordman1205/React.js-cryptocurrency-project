import React, {Component} from 'react';
import {Layout} from 'antd';
import PropTypes from 'prop-types';
import Header from './header/Header';
import history from '../../utils/history';
import './page-wrapper.scss';

const {Footer, Content} = Layout;

const ContextType = {
    history: PropTypes.object.isRequired,
};


export default class PageWrapper extends Component {

    static childContextTypes = ContextType;

    getChildContext() {
        return {
            history: history,
        };
    }

    render() {
        return (
            <div className="page-wrapper">
                <Header />
                <Content>
                    {this.props.children}
                </Content>
                <Footer>
                    <div className="footer-menu">
                        <a href='FAQ.html'>FAQ</a>
                        <a href="TermsOfUse.html">Terms & Condition</a>
                        <a href="AboutUs.html">About Us</a>
                        <a href="PrivacyPolicy.html">Privacy Policy</a>
                        <a href="ContactUs.html">Contact Us</a>
                    </div>
                </Footer>
            </div>
        );
    }
}
