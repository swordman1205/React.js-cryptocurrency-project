import React, {Component} from 'react';
import { Upload, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Menu, Dropdown, message } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

class PaymentDetails extends Component {
    render() {
      const { getFieldDecorator } = this.props.form;

        return (
            <div className="user-admin-payment-details">
              <h2>PaymentDetails</h2>
              <Row>
			        	<Col span={12}>
			        		<h3>Enter your mobile wallet number:</h3>
		              <Form onSubmit={this.handleSubmit}>
				            <FormItem
							        >
						          {getFieldDecorator('firstname', {
						            rules: [{
						              required: true, message: 'Please input mobile wallet number!',
						            }],
						          })(
						            <Input />
						          )}
						        </FormItem>
						        <FormItem>
						          <Button type="primary" htmlType="submit">Submit</Button>
						        </FormItem>
						      </Form>
						    </Col>
						  </Row>
            </div>
        );
    }
}

const WrappedPaymentForm = Form.create()(PaymentDetails);
export default WrappedPaymentForm;
