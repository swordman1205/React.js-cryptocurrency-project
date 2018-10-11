import React, {Component} from 'react';
import {Layout, Menu, Dropdown, Button, Icon, message, Select, Input, Form, Spin} from 'antd';
import {formValidationDecorator,validateResponseError} from '../../../utils/miscUtils';
import {getRegistrationPath, getRestorePath} from "../../../utils/urlBuilder";
import { getWallets, createWithdraw, getWithdrawPaymentMethods } from '../../../services/session/authorization';

import {showSuccess, showWarning} from '../../../services/notifyService';

const Option = Select.Option;

const FormItem = Form.Item;

const walletsTitle = ['Main wallet','Transfer wallet','Referral wallet','External wallet'];

class Withdraw extends Component {
    constructor(){
        super();
        this.sender = 0;
    }

    state = {
        loading: false,
        email:'',
        amount:0,
        sender:0,
        payment_method:0,
        payment_methods:[],
        wallets: [],
        referral_wallet_id:0
    };

     handleSubmit(){
        console.log('handleSubmit');
        console.log(document.getElementById('email').value);
        console.log(document.getElementById('amount').value);
        
        console.log(this.props.form);
        console.log(this.state.payment_method);
        var data =  {
                        "amount": parseInt(document.getElementById('amount').value),
                        "sender": this.state.sender,
                        "payment_method": this.state.payment_method,
                        "email": document.getElementById('email').value,
                    };

        this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    this.setState({loading: true});
                    console.log(values);
                    const error = await createWithdraw(data);
                    this.setState({loading: false});

                    console.log('------ERROR-------');
                    console.log(error);
                    if (error && error.error.data) {
                        if(error.error.data.detail) {
                            validateResponseError.call(this, error.error.data.detail);
                            showWarning("Withdraw Error!", error.error.data.detail);
                        }
                        if(error.error.data.amount) {
                            validateResponseError.call(this, error.error.data.amount);
                            showWarning("Withdraw Error!", error.error.data.amount);
                        }
                        if(error.error.data.sender) {
                            validateResponseError.call(this, error.error.data.sender);
                            showWarning("Withdraw Error!", error.error.data.sender);
                        }

                        if(error.error.data.payment_method) {
                            validateResponseError.call(this, error.error.data.payment_method);
                            showWarning("Withdraw Error!", error.error.data.payment_method);
                        }

                        if(error.error.data.email) {
                            validateResponseError.call(this, error.error.data.email);
                            showWarning("Withdraw Error!", error.error.data.email);
                        }
                    }
                }
        });
    }
    

    async loadWithdrawPaymentMethods(){
        const response = await getWithdrawPaymentMethods();
        console.log('payment_methods');
        console.log(response);

        var paymentMethods = [];
        try {
            var results = response.data.results;
            for(var i=0; i<results.length; i++) {
                var result = results[i];
                result.key = result.id;
                paymentMethods.push(result);
            }
            this.setState({payment_methods:paymentMethods});
        } 
        catch(e){
        }
    }
    
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

                if(result.kind !=1 && result.kind !=3) {
                    walletsArray.push(result);
                }

                if(result.kind == 2)
                    this.setState({referral_wallet_id: result.id});
            }
            this.setState({wallets:walletsArray});
        } 
        catch(e){
        }
    }

    componentDidMount() {
        this.loadWallets();
        this.loadWithdrawPaymentMethods();
    }

    handleMethodChange(value){
        this.setState({payment_method:value});
    }

    handleWalletChange(value){
        this.setState({sender:value});
        this.sender = value;

        const form = this.props.form;
        form.validateFields(['amount'], { force: true });
    }


    checkAmount = (rule, value, callback) => {
        const form = this.props.form;
        var amount = form.getFieldValue('amount');

        if(this.sender !=this.state.referral_wallet_id) {
            if(amount<25)
                callback('Minimum amount to withdraw: $25.');
            else {
                callback();
            }
        }  else {
            if(amount<5)
                callback('Minimum amount to withdraw: $5.');
            else {
                callback();
            }
        }
    }

    getForm(getFieldDecorator){
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="withdraw-form" style={{maxWidth: '50rem'}}>
                <h3>From wallet.</h3>
                <FormItem>
                    {getFieldDecorator('from_wallet', {
                        rules: [{required: true, message: 'Please input from wallet!'}],
                    })(
                        <Select onChange={ this.handleWalletChange.bind(this)}>
                            {this.state.wallets.map((item, index) =>
                                <Option key={index} value={item.key}>{item.title}</Option>
                            )}
                        </Select>
                    )}
                </FormItem>

                <h3>To wallet.</h3>
               <FormItem>
                    {getFieldDecorator('to_wallet', {
                        rules: [{required: true, message: 'Please input to wallet!'}],
                    })(
                        <Select onChange={ this.handleMethodChange.bind(this)}>
                            {this.state.payment_methods.map((item, index) =>
                                <Option key={index} value={item.key}>{item.name}</Option>
                            )}
                        </Select>
                    )}
                </FormItem>

                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{required: true, message: 'Please input email!'}], 
                    })(
                        <Input prefix={<Icon type="pay-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Enter the email address of your external wallet." type="email" />
                    )}
                </FormItem>


                <FormItem>
                    {getFieldDecorator('amount', {
                        rules: [{required: true, message: 'Please input amount!'}, {validator: this.checkAmount}, {validateOn:"change"}],
                    })(
                        <Input prefix={<Icon type="pay-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Enter an amount" type="number"/>
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
                <h2 className="text-left">Withdraw</h2>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
                <div className="pt-3">
                    <h3>* Must have 1 active referral.</h3>
                    <h3>* Transfer balance can't be withdrawn.</h3>
                </div>
            </div>
        );
    }
}

const WithdrawForm = Form.create()(Withdraw);
export default WithdrawForm;
