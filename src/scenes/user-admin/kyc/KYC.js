import React, {Component} from 'react';
import { Upload, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Menu, Dropdown, message, InputNumber, Spin } from 'antd';
import { addCustomer, getProfile } from '../../../services/session/authorization';
import { showWarning } from '../../../services/notifyService';

import './kyc.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const options = [
    {title: 'Passport', key: '0'},
    {title: 'Government ID', key: '1'},
    {title: 'Driving License', key: '2'}
];

class KYC extends Component {

	constructor() {
		super();

		this.state = {
			confirmDirty: false,
			autoCompleteResult: [],
			imageUrl: '',
			loading: false,
			customer: null
		};
	}

	async componentDidMount() {
		this.setState({ loading: true });

		const res = await getProfile();
		this.setState({
				customer: res.data.customer,
				loading: false
		});

		if (res.data.customer) {
			this.props.form.setFields({
				first_name: {
					value: res.data.customer.first_name
				},
				last_name: {
					value: res.data.customer.last_name
				},
				address: {
					value: res.data.customer.address
				},
				city: {
					value: res.data.customer.city
				},
				country: {
					value: res.data.customer.country
				},
				phone: {
					value: res.data.customer.phone.replace('+', '')
				},
				id_kind: {
					value: `${res.data.customer.id_kind}`
				}
			})
		}
	}

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

	validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleButtonClick = (e) => {
	  message.info('Click on left button.');
	  console.log('click left button', e);
	}

	handleMenuClick = (e) => {
	  message.info('Click on menu item.');
	  console.log('click', e);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		if (this.state.customer) {
			showWarning('Warning', 'You need to contact with support team to do this!');
			return;
		}
		this.props.form.validateFields(async (err, values) => {
      if (!err) {
				values.identification = this.state.imageUrl;
				values.phone = `${values.prefix}${values.phone}`;
				values.id_kind = parseInt(values.id_kind);

				delete values.prefix;

				this.setState({ loading: true });
				
				const res = await addCustomer(values);
				if (res) {
					this.setState({ customer: values });
				}

				this.setState({ loading: false });
      }
    });
	}

  render() {
  	const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const { getFieldDecorator } = this.props.form;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+',
    })(
			<div>+</div>
    );

    const menu = (
		  <Menu onClick={this.handleMenuClick}>
		    <Menu.Item key="0">Passport</Menu.Item>
		    <Menu.Item key="1">Government ID</Menu.Item>
		    <Menu.Item key="2">Driving License</Menu.Item>
		  </Menu>
		);

    const props = {
		  name: 'file',
		  action: 'https://api.cloudinary.com/v1_1/sheilafox/image/upload?upload_preset=nmypifsc',
		  onChange: (info) => {
		    if (info.file.status !== 'uploading') {
		      console.log(info.file, info.fileList);
		    }
		    if (info.file.status === 'done') {
					message.success(`${info.file.name} file uploaded successfully`);
					this.setState({ imageUrl: info.file.response.secure_url });
		    } else if (info.file.status === 'error') {
		      message.error(`${info.file.name} file upload failed.`);
		    }
		  },
		};

		const imgUrl = this.state.customer? this.state.customer.identification : this.state.imageUrl;

    return (
      <div className="user-admin-kyc">
        <h2>Contact details</h2>
        <Row>
        	<Col span={12}>
						<Spin spinning={this.state.loading}>
							<Form onSubmit={this.handleSubmit}>
								<FormItem
										{...formItemLayout}
										label="First name"
									>
									{getFieldDecorator('first_name', {
										rules: [{
											required: true, message: 'Please input your firstname!',
										}],
									})(
										<Input disabled={!!this.state.customer}/>
									)}
								</FormItem>
								<FormItem
										{...formItemLayout}
										label="Last name"
									>
									{getFieldDecorator('last_name', {
										rules: [{
											required: true, message: 'Please input your lastname!',
										}],
									})(
										<Input disabled={!!this.state.customer}/>
									)}
								</FormItem>
								<FormItem
										{...formItemLayout}
										label="Address"
									>
									{getFieldDecorator('address', {
										rules: [{
											required: true, message: 'Please input your address!',
										}],
									})(
										<Input disabled={!!this.state.customer}/>
									)}
								</FormItem>
								<FormItem
										{...formItemLayout}
										label="City"
									>
									{getFieldDecorator('city', {
										rules: [{
											required: true, message: 'Please input your city!',
										}],
									})(
										<Input disabled={!!this.state.customer}/>
									)}
								</FormItem>
								<FormItem
										{...formItemLayout}
										label="Country"
									>
									{getFieldDecorator('country', {
										rules: [{
											required: true, message: 'Please input your country!',
										}],
									})(
										<Input disabled={!!this.state.customer}/>
									)}
								</FormItem>
								<FormItem
									{...formItemLayout}
									label="Phone Number"
								>
									{getFieldDecorator('phone', {
										rules: [{ required: true, message: 'Please input your phone number!' }],
									})(
										<Input addonBefore={prefixSelector} type="number" disabled={!!this.state.customer} style={{ width: '100%' }} />
									)}
								</FormItem>
								<FormItem
										{...formItemLayout}
										label="ID Type"
									>
									{getFieldDecorator('id_kind')(
										<Select disabled={!!this.state.customer}>
												{options.map((item, index) =>
														<Option key={index} value={item.key}>{item.title}</Option>
												)}
										</Select>
									)}
								</FormItem>
								<FormItem
										{...formItemLayout}
										label="Upload your ID"
									>
										<Upload {...props}>
											<Button disabled={!!this.state.customer}>
												<Icon type="upload" /> Click to Upload
											</Button>
										</Upload>
								</FormItem>
								{
									imgUrl && <div className="ant-row">
										<div className="ant-col-xs-24 ant-col-sm-8"></div>
										<div className="ant-col-xs-24 ant-col-sm-16">
											<img className="attachment" src={imgUrl} />
										</div>
									</div>
								}
								<FormItem {...tailFormItemLayout}>
									<Button type="primary" htmlType="submit" disabled={!!this.state.customer}>Submit</Button>
								</FormItem>
							</Form>
						</Spin>
			    </Col>
			  </Row>
      </div>
    );
  }
}

const WrappedKYCForm = Form.create()(KYC);
export default WrappedKYCForm;
