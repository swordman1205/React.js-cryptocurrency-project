import React, { Component } from 'react';
import { getReferral } from '../../../services/session/authorization';

export default class ReferEarn extends Component {
    constructor() {
        super();

        this.state = {
            referLink: ''
        }
    }

    async componentDidMount() {
        const referral =  await getReferral();

        this.setState({
            referLink: referral.data.referral_link
        });
    }

    render() {
        return (
            <div className="user-admin-refer-earn">
                <h1 className="text-left">Refer & Earn</h1>
                <h3>Your referral link is {this.state.referLink}</h3>
                <h3>* Earn $5 for each referral</h3>
            </div>
        );
    }
}
