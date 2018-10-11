import React, {Component} from 'react';
import {Layout, Menu, Dropdown, Button, Icon, message, Select, Input, Form, Spin} from 'antd';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {getRegistrationPath, getRestorePath} from "../../../utils/urlBuilder";
import { getWallets, postTransferFund } from '../../../services/session/authorization';
import {showSuccess, showWarning} from '../../../services/notifyService';
const Option = Select.Option;

const FormItem = Form.Item;

const walletsTitle = ['Main wallet','Transfer wallet','Referral wallet','External wallet'];

class TransferFunds extends Component {

    state = {
        loading: false,
        email:'',
        amount:0,
        sender:0,
        receiver:-1,
        wallets: []
    };

    handleMenuClick = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
        this.setState({
            selectValue: e.key,
        });
    };

    async loadWallets(){
        const wallets = await getWallets();
        console.log('----Walllets--------');
        console.log(wallets);

        var walletsArray = [];
        try {
            var results = wallets.data.results;
            for(var i=0; i<results.length; i++) {
                var result = results[i];
                result.title = walletsTitle[result.kind];
                result.key = result.id;
                if(result.kind == 3) {
                    this.setState({receiver:result.id});
                } else {
                    walletsArray.push(result);
                }
            }
            this.setState({wallets:walletsArray});
        } 
        catch(e){
        }
    }

    handleWalletChange(value){
        console.log('handleWalletChange');
        console.log(value);
        this.setState({sender:value});
    }


     handleSubmit(){
        console.log('handleSubmit');
        console.log(document.getElementById('recipientUser').value);
        console.log(document.getElementById('amount').value);
        
        var data =  {
                        "amount": parseInt(document.getElementById('amount').value),
                        "sender": this.state.sender,
                        "username": document.getElementById('recipientUser').value,
                    };

        this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    this.setState({loading: true});
                    console.log(values);
                    const error = await postTransferFund(data);
                    this.setState({loading: false});

                    console.log('------ERROR-------');
                    console.log(error);
                    if (error && error.error.data) {
                        if(error.error.data.detail) {
                            validateResponseError.call(this, error.error.data.detail);
                            showWarning("Transfer Error!", error.error.data.detail);
                        }
                        if(error.error.data.amount) {
                            validateResponseError.call(this, error.error.data.amount);
                            showWarning("Transfer Error!", error.error.data.amount);
                        }
                        if(error.error.data.sender) {
                            validateResponseError.call(this, error.error.data.sender);
                            showWarning("Transfer Error!", error.error.data.sender);
                        }
                        if(error.error.data.username) {
                            validateResponseError.call(this, error.error.data.username);
                            showWarning("Transfer Error!", error.error.data.username);
                        }
                    }
                }
        });
    }

    checkAmount = (rule, value, callback) => {
        const form = this.props.form;
        var amount = form.getFieldValue('amount');
        if(amount<25)
            callback('Minimum amount to transfer: $25.');
        else {
            callback();
        }
    }

    componentDidMount() {
        this.loadWallets();
    }

    getForm(getFieldDecorator){
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="withdraw-form" style={{maxWidth: '50rem'}}>
                <h3>Select an wallet to transfer:</h3>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input wallet!'}],
                    })(
                        <Select onChange={ this.handleWalletChange.bind(this)}>
                            {this.state.wallets.map((item, index) =>
                                <Option key={index} value={item.key}>{item.title}</Option>
                            )}
                        </Select>
                    )}
                </FormItem>
                <h3>Enter an amount:</h3>
                <FormItem>
                    {getFieldDecorator('amount', {
                        rules: [{required: true, message: 'Please input amount!'}, {validator: this.checkAmount}],
                    })(
                        <Input prefix={<Icon type="pay-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Amount" type="number"/>
                    )}
                </FormItem>
                <h3>Enter recipient username:</h3>
                <FormItem>
                    {getFieldDecorator('recipientUser', {
                        rules: [{required: true, message: 'Please input recipient username!'}],
                    })(
                        <Input placeholder="Recipient User" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        );
    }

    render() {
        return (
            <div className="user-admin-withdraw">
                <h2 className="text-left">Transfer</h2>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
                <div className="pt-3">
               
                </div>
            </div>
        );
    }
}

const TransferForm = Form.create()(TransferFunds);
export default TransferForm;
