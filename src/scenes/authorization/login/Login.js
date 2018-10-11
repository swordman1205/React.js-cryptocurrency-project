import React from 'react';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Form, Icon, Input, Button, Row, Col, Spin} from 'antd';
import {getRestorePath, getRegistrationPath, getUserDashboardPath} from '../../../utils/urlBuilder';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {login, isLoggedIn} from '../../../services/session/authorization';
import '../index.scss';


const FormItem = Form.Item;

class SimpleLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        if (isLoggedIn()) {
            this.props.history.push(getUserDashboardPath());
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({loading: true});
                console.log(values);
                const {error} = await login(values);
                this.setState({loading: false});
                if (error && error.data) {
                    validateResponseError.call(this, error.data);
                }
            }
        });
    };


    getForm(getFieldDecorator) {
        const defaultMail = this.props.match.params.mail;
        return (
            <Form onSubmit={this.handleSubmit} className="auth-form">
                <Row className="form-line">
                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Email:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                initialValue: defaultMail,
                                rules: [{required: true, message: 'Please input your email!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
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
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Password"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 16, offset: 8}} xs={{offset: 0, span: 24}}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                            <span style={{paddingLeft: '2rem'}}>Or <NavLink
                                to={getRegistrationPath()}>register now!</NavLink></span>
                        </FormItem>
                    </Col>
                    <Col xs={{span: 24}} className="form-field-label">Forgot you password?</Col>
                    <Col sm={{span: 16, offset: 8}} xs={{offset: 0, span: 24}}>
                        <Button type="primary" htmlType="submit" className="login-form-button"><NavLink
                            to={getRestorePath()}>Reset Password</NavLink></Button>
                    </Col>
                </Row>
            </Form>
        );
    }


    render() {
        return (
            <div className="auth-type-page">
                <h1>Login to your account</h1>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(SimpleLogin);
export default WrappedNormalLoginForm;
