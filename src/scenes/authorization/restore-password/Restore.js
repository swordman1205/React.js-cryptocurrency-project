import React from 'react';
import {NavLink} from 'react-router-dom';
import {Form, Icon, Input, Button, Row, Col, Spin} from 'antd';
import {getRegistrationPath} from '../../../utils/urlBuilder';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {resetPassword} from '../../../services/session/authorization';
import '../index.scss';

const FormItem = Form.Item;

class Restore extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({loading: true});
                const {error} = await resetPassword(values);
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
                    <Col sm={{span: 8}} xs={{span: 24}} className="form-field-label">Email:</Col>
                    <Col sm={{span: 16}} xs={{span: 24}}>
                        <FormItem>
                            {getFieldDecorator('email', {
                                rules: [{required: true, message: 'Please input your email!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Email"/>
                            )}
                        </FormItem>
                    </Col>

                    <Col sm={{span: 16, offset: 8}} xs={{offset: 0, span: 24}}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">Restore
                                password</Button>
                            <span style={{paddingLeft: '2rem'}}>Or <NavLink
                                to={getRegistrationPath()}>register now!</NavLink></span>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    };

    render() {
        return (
            <div className="auth-type-page">
                <h1>Restore password</h1>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(Restore);
export default WrappedNormalLoginForm;
