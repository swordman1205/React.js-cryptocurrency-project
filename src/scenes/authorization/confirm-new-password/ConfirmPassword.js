import React from 'react';
import {Form, Icon, Input, Button, Row, Col, Spin} from 'antd';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {confirmNewPassword} from '../../../services/session/authorization';
import {getLoginPath} from "../../../utils/urlBuilder";
import '../index.scss';

const FormItem = Form.Item;

class ConfirmPassword extends React.Component {

    constructor(props) {
        super(props);

        const {token, uidb64} = this.props.match.params;
        if (!token || !uidb64) {
            this.props.history.push(getLoginPath());
        }
        this.state = {
            loading: false,
            token,
            uidb64,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {uidb64, token} = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.uidb64 = uidb64;
                values.token = token;
                this.setState({loading: true});
                const {error} = await confirmNewPassword(values, uidb64, token);
                this.setState({loading: false});
                if (error && error.data) {
                    validateResponseError.call(this, error.data);
                }
            }
        });
    };


    getForm = (getFieldDecorator) => {
        return (
            <Form onSubmit={this.handleSubmit} className="auth-form">
                <Row className="form-line">
                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">New password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('new_password1', {
                                rules: [{required: true, message: 'Please input your new password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="New password" type="password"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Confirm password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('new_password2', {
                                rules: [{required: true, message: 'Please confirm your password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Confirm password" type="password"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 16, offset: 8}} xs={{offset: 0, span: 24}}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">Set new
                                password</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };

    render() {
        return (
            <div className="auth-type-page">
                <h1>Set new password</h1>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(ConfirmPassword);
export default WrappedNormalLoginForm;
