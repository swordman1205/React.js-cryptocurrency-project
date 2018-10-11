import React, {Component} from 'react';
import { Table, Icon, Divider, Row, Col, DatePicker } from 'antd';

import './myreferral.scss';
import { getReferrals } from '../../../services/session/authorization';
import {parseServerDate} from '../../../utils/miscUtils';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Column, ColumnGroup } = Table;

const activities = ['Unknown','Deposit','Reward','Transfer','Withdraw'];
const states = ['Inactive','Active'];
export default class MyReferrals extends Component {
	 constructor() {
        super();
        
        this.state = {
            referrals: [],
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

                    this.loadReferrals(data, page);
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

        this.loadReferrals(data, this.state.pagination.defaultCurrent);
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

        this.loadReferrals(data, this.state.pagination.defaultCurrent);
    }

    async loadReferrals(data, page){
        const params = {
            limit: this.state.pagination.pageSize,
            offset: (page - 1) * this.state.pagination.pageSize,
            ...data
        }

        this.setState({loading: true});

        const response = await getReferrals(params);
        console.log('----Referrals--------');
        console.log(response);
        var referralsList = [];
        try {
            var result = response.data;
            this.setState({main_balance:result.main_balance});
            this.setState({referral_balance:result.referral_balance});
            this.setState({transfer_balance:result.transfer_balance});
            this.setState({pagination: { ...this.state.pagination, ...{ total: result.count } }});

            var referrals = response.data.results;
            for(var i=0; i<referrals.length; i++) {
                var referral = referrals[i];
                console.log(referral);
                referral.key = referral.id;
                referral.state = referral.status;
                referral.status = states[referral.state];
                var modified_date = new Date(referral.date_joined);
                var date = parseServerDate(modified_date);
                referral.date = date;
                referralsList.push(referral);
                }


             console.log(referralsList);
             this.setState({
                 referrals: referralsList,
                 loading: false
            });

        } 
        catch(e){
            this.setState({
                loading: false
             });
        }
    }

    componentDidMount() {
        this.loadReferrals({}, this.state.pagination.defaultCurrent);
    }


  render() {

    return (
      <div className="user-admin-my-referrals">
      	<h2>My Referred Users</h2>

        <Row>
					<Col span={10}><p>Users list</p></Col>
					<Col span={14}>
						<DatePicker className="datepicker" onChange={this.onFromDateChange} placeholder="From" />
						<DatePicker className="datepicker" onChange={this.onToDateChange} placeholder="To"/>
					</Col>
				</Row>

				<Table pagination={this.state.pagination} loading={this.state.loading} dataSource={this.state.referrals}>
					<Column
						title="#"
						dataIndex="key"
						key="key"
					/>
					<Column
						title="Username"
						dataIndex="username"
						key="username"
					/>
					<Column
						title="Email"
						dataIndex="email"
						key="email"
					/>
					<Column
						title="Joined On"
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
