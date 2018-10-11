import React, {Component} from 'react';
import {Form, Icon, Input, Button, Row, Col, Spin} from 'antd';
import {getRegistrationPath} from '../../../utils/urlBuilder';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {updatePassword} from '../../../services/session/authorization';

const FormItem = Form.Item;

class Settings extends Component {

    constructor() {
        super();

        this.state = {
            loading: false
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({loading: true});
                const {error} = await updatePassword(values);
                this.setState({loading: false});
                if (error && error.data) {
                    validateResponseError.call(this, error.data);
                }
            }
        });
    };

    getForm = (getFieldDecorator) => {
        return (
            <Form onSubmit={this.handleSubmit} className="auth-form" style={{maxWidth: '70rem'}}>
                <Row className="form-line">
                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Current password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('old_password', {
                                rules: [{required: true, message: 'Please input your current password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Current password" type="password"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">New password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('new_password', {
                                rules: [{required: true, message: 'Please input your new password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="New password" type="password"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Confirm new password:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('new_password_confirm', {
                                rules: [{required: true, message: 'Please confirm password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Confirm password" type="password"/>
                            )}
                        </FormItem>
                    </Col>


                    <Col sm={{span: 16, offset: 8}} xs={{offset: 0, span: 24}}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">Reset
                                password</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };

    render() {
        return (
            <div className="user-admin-settings">
                <h1 className="text-left">Settings</h1>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
            </div>
        );
    }
}

const SettingsForm = Form.create()(Settings);
export default SettingsForm;
