import React from 'react';
import PropTypes from 'prop-types';
import {Form, Icon, Input, Button, Row, Col, Spin} from 'antd';
import {isLoggedIn, registration} from '../../../services/session/authorization';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {getUserDashboardPath} from '../../../utils/urlBuilder';
import '../index.scss';
import Recaptcha from 'react-recaptcha';
const FormItem = Form.Item;

import {showSuccess, showWarning} from '../../../services/notifyService';

class Registration extends React.Component {

    callback() {
        console.log('Done!!!!');
    }

    verifyCallback(response) {
        console.log('verifyCallback');
        console.log(response);
        this.setState({recaptcha_verified:true});
    }

    expiredCallback() {
        console.log(`Recaptcha expired`);
    };

    resetRecaptcha() {
        this.state.recaptchaInstance.reset();
    };

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            recaptchaInstance:null,
            recaptcha_verified:false
        };
        if (isLoggedIn()) {
            props.history.push(getUserDashboardPath());
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(this.state.recaptcha_verified === false) {
            showWarning("Registration Error", "Please input Recaptcha!");
            return;
        }

        const {referrer} = this.props.match.params;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.referrer = referrer || '';
                this.setState({loading: true});
                const {error} = await registration(values);
                this.setState({loading: false});
                if (error && error.data) {
                    validateResponseError.call(this, error.data);
                }
            }
        });
    };

    getForm(getFieldDecorator) {
        return (
            <Form onSubmit={this.handleSubmit} className="auth-form">
                <Row className="form-line">
                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">First name:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('first_name', {
                                rules: [{required: true, message: 'Please input your first name!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="First name"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Last name:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('last_name', {
                                rules: [{required: true, message: 'Please input your last name!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Last name"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Username:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Username"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Email:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [{required: true, message: 'Please input your email!'}],
                            })(
                                <Input prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Email"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Confirm password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('password_confirm', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"/>
                            )}
                        </FormItem>
                    </Col>  

                    <Col sm={{span: 16}} xs={{span: 10}} className="form-field-label">
                    <FormItem>
                     <Recaptcha
                      ref={e => this.state.recaptchaInstance = e}
                      sitekey="6LfcLFcUAAAAAI-8ukN1O6WZdpL8AHjUgOKkd6nn"

                      verifyCallback={this.verifyCallback.bind(this)}
                      onloadCallback={this.callback.bind(this)}
                      expiredCallback={this.expiredCallback.bind(this)}
                    />
                    </FormItem>
                    </Col>

                    <Col sm={{span: 16, offset: 8}} xs={{offset: 0, span: 24}}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">Register</Button>
                        </FormItem>
                    </Col>
                </Row>

               
            </Form>
        );
    }

    render() {
        return (
            <div className="auth-type-page">
                <h1>Register your account </h1>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>

        

            </div>
        );
    }
}

const RegistrationPage = Form.create()(Registration);
export default RegistrationPage;
