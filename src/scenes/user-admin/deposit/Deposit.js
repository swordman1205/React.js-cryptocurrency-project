import React, {Component} from 'react';
import {Layout, Menu, Dropdown, Button, Icon, message, Select, Input, Form, Spin} from 'antd';
import {formValidationDecorator, validateResponseError} from '../../../utils/miscUtils';
import {getRegistrationPath, getRestorePath} from "../../../utils/urlBuilder";
import { getWallets, createDeposit,getDepositPaymentMethods } from '../../../services/session/authorization';
import {showSuccess, showWarning} from '../../../services/notifyService';

const Option = Select.Option;

const FormItem = Form.Item;


const walletsTitle = ['Main wallet','Transfer wallet','Referral wallet','External wallet'];

class Deposit extends Component {

    state = {
        loading: false,
        amount:0,
        payment_method:0,
        payment_methods:[],
        wallets: [],
        payment_email:''
    };

    handleSubmit(){
        console.log('handleSubmit');
        console.log(document.getElementById('transaction_id').value);
        console.log(document.getElementById('amount').value);

        var data =     {
                        "amount": parseInt(document.getElementById('amount').value),
                        "transaction_id": parseInt(document.getElementById('transaction_id').value),
                        "payment_method": this.state.payment_method
                        // "email": this.state.payment_email
                    };

        // if(this.state.payment_email == '') {
        //     showWarning("Error!", "Please input payment_email");
        //     return;
        // }

        this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    this.setState({loading: true});
                    console.log(values);
                  
                    const error = await createDeposit(data);        
                    this.setState({loading: false});
                    console.log(error);
                     if (error && error.error.data) {
                        if(error.error.data.detail) {
                            validateResponseError.call(this, error.error.data.detail);
                            showWarning("Deposit Error!", error.error.data.detail);
                        }
                        if(error.error.data.amount) {
                            validateResponseError.call(this, error.error.data.amount);
                            showWarning("Deposit Error!", error.error.data.amount);
                        }
                        if(error.error.data.transaction_id) {
                            validateResponseError.call(this, error.error.data.transaction_id);
                            showWarning("Deposit Error!", error.error.data.transaction_id);
                        }

                        if(error.error.data.payment_method) {
                            validateResponseError.call(this, error.error.data.payment_method);
                            showWarning("Deposit Error!", error.error.data.payment_method);
                        }
                    }
                }
        });
    }
    
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
                 if(result.kind != 3) 
                    walletsArray.push(result);
            }
            this.setState({wallets:walletsArray});
        } 
        catch(e){
        }
    }

    componentDidMount() {
        this.loadWallets();
        this.loadDepositPaymentMethods();
    }

    async loadDepositPaymentMethods(){
        const response = await getDepositPaymentMethods();
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

    handleMethodChange(value){
        console.log('handleMethodChange');
        console.log(value);
        this.setState({payment_method:value});

        for(var i=0; i<this.state.payment_methods.length; i ++){
            var payment_method = this.state.payment_methods[i];
            if(value == payment_method.id) {
                var email = payment_method.payment_information[0].email;
                console.log(email);
                this.setState({payment_email:email});
            }
        }
    }

    getForm(getFieldDecorator){
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className="withdraw-form" style={{maxWidth: '50rem'}}>
        
                <h2>Select a deposit method.</h2>
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

                <h2> Please send funds to {this.state.payment_email}</h2>

                <FormItem>
                    {getFieldDecorator('amount', {
                        rules: [{required: true, message: 'Please enter your Deposit amount.'}], 
                    })(
                        <Input prefix={<Icon type="pay-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Deposit amount" type="number" />
                    )}
                </FormItem>

               

                <FormItem>
                    {getFieldDecorator('transaction_id', {
                        rules: [{required: true, message: 'Please enter your transaction_id.'}],
                    })(
                        <Input prefix={<Icon type="pay-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Enter your transaction id."/>
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
            <div className="user-admin-deposit">
                <h2 className="text-left">Deposit</h2>
                <Spin spinning={this.state.loading}>
                    {formValidationDecorator.call(this, this.getForm)}
                </Spin>
              
            </div>
        );
    }
}

const DepositForm = Form.create()(Deposit);
export default DepositForm;
