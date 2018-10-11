import React, {Component} from 'react';
import {Table, Icon, Divider, Row, Col, DatePicker} from 'antd';
import './dashboard.scss';

import { showTransactions, getProfile} from '../../../services/session/authorization';

import {parseServerDate,validateResponseError} from '../../../utils/miscUtils';
import {showSuccess, showWarning} from '../../../services/notifyService';

const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
const {Column, ColumnGroup} = Table;

const activities = ['Deposit','Reward','Transfer','Withdraw' , 'Referral Bonus'];
const states = ['Processing','Completed','Failed'];
export default class Dashboard extends Component {
    constructor() {
        super();
        
        this.state = {
            username:'',
            main_balance:'$0',
            referral_balance:'$0',
            transfer_balance:'$0',
            transactions: [],
            start_date:'',
            end_date:'',
            loading: false,
            pagination: {
                pageSize: 5,
                defaultCurrent: 1,
                onChange: (page) => {
                    let data = {};

                    if (this.state.start_date) {
                        data.start_date = this.state.start_date;
                    }

                    if (this.state.end_date) {
                        data.end_date = this.state.end_date;
                    }

                    this.loadTransactions(data, page);
                }
            }
        };
    }

    onToDateChange = (date, dateString) => {
        console.log(date);
        console.log(dateString);
        this.setState({end_date:dateString});

        let data = {};

        if (dateString) {
            data = {
                end_date:dateString
            };
        }

        if(this.state.start_date !== '')
            data.start_date = this.state.start_date;

        this.loadTransactions(data, this.state.pagination.defaultCurrent);
    }

    onFromDateChange = (date, dateString) => {
        console.log(date);
        console.log(dateString);
        this.setState({start_date:dateString});

        let data = {};

        if (dateString) {
            data = {
                start_date:dateString
            };
        }

        if(this.state.end_date !== '') {
            data.end_date = this.state.end_date;
        }

        this.loadTransactions(data, this.state.pagination.defaultCurrent);
    }

    async loadTransactions(data, page){
        const params = {
            limit: this.state.pagination.pageSize,
            offset: (page - 1) * this.state.pagination.pageSize,
            ...data
        }

        this.setState({loading: true});
        const balance = await showTransactions(params);
        console.log('----Ballance--------');
        console.log(balance);
        var transactionsList = [];
        try {
            var result = balance.data;
            this.setState({main_balance:result.main_balance});
            this.setState({referral_balance:result.referral_balance});
            this.setState({transfer_balance:result.transfer_balance});
            this.setState({pagination: { ...this.state.pagination, ...{ total: result.count } }});

            var transactions = balance.data.results;
            for(var i=0; i<transactions.length; i++) {
                var transaction = transactions[i];
                console.log(transaction);
                transaction.key = transaction.id;
                transaction.value = transaction.amount;
                transaction.amount = "$" + transaction.amount;
                if(transaction.action>=0)
                    transaction.activityName = activities[transaction.action];
                else 
                    transaction.activityName = "Unknown";

                transaction.state = transaction.status;
                transaction.status = states[transaction.state];
                var modified_date = new Date(transaction.modified);
                var date = parseServerDate(modified_date);
                transaction.date = date;
                transactionsList.push(transaction);
                }

             this.setState({
                transactions: transactionsList,
                loading: false
             });

        }
        catch(e){
            this.setState({
                loading: false
             });
        }
    }

    async loadProfile(){
            const profile = await getProfile();
            console.log('----profile--------');
            console.log(profile);
            try {
                this.setState({username:profile.data.username});
            } catch(error){
        
        }
    }


    componentDidMount() {
        this.loadTransactions({}, this.state.pagination.defaultCurrent);
        this.loadProfile();
    }

    render() {
        return (
            <div className="user-admin-dashboard">
                <p> Welcome {this.state.username} </p>
                <h2>Dashboard</h2>
                <h3>Main wallet balance: {this.state.main_balance}</h3>
                <h3>Referral wallet balance: {this.state.referral_balance}</h3>
                <h3>Transfer wallet balance: {this.state.transfer_balance}</h3>


                <h2>Recent Activity</h2>
                <Row>
                    <Col span={10}><p>Activity Logs</p></Col>
                    <Col span={14}>
                        <DatePicker className="datepicker" onChange={this.onFromDateChange} placeholder="From"/>
                        <DatePicker className="datepicker" onChange={this.onToDateChange} placeholder="To"/>
                    </Col>
                </Row>

                <Table pagination={this.state.pagination} loading={this.state.loading} dataSource={this.state.transactions}>
                    <Column
                        title="#"
                        dataIndex="key"
                        key="key"
                    />
                    <Column
                        title="Activity Name"
                        dataIndex="activityName"
                        key="activityName"
                    />
                    <Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                    />
                    <Column
                        title="Date"
                        dataIndex="date"
                        key="date"
                    />
                    <Column
                        title="Status"
                        dataIndex="status"
                        key="status"
                    />
                </Table>

            </div>
        );
    }
}
