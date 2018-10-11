import React, {Component} from 'react';
import {Table, Button, Collapse} from 'antd';
import {Link} from 'react-router-dom';
import {getUserWorkVideoPath, getUserWorkWebsitePath} from '../../../../utils/urlBuilder';
import {getTasks, interactTask} from '../../../../services/session/authorization';

import IframeModal from '../../../../components/iframe-modal/IframeModal';

const {Panel} = Collapse;
const {Column, ColumnGroup} = Table;

export default class BrowseWebsite extends Component {

    constructor() {
        super();

        this.state = {
            data: [],
            activeKey: '0',
            loading: false,
            pagination: {
                pageSize: 5,
                defaultCurrent: 1,
                onChange: (page) => {
                    this.updateTable(page);
                }
            },
            siteUrl: ''
        }

        this.selectedSite = {};
    }

    componentDidMount() {
        this.updateTable(this.state.pagination.defaultCurrent);
    }

    async updateTable(page) {
        const params = {
            limit: this.state.pagination.pageSize,
            offset: (page - 1) * this.state.pagination.pageSize,
            kind: 1
        }

        this.setState({
            loading: true
        });

        const res = await getTasks(params);

        if (!res) {
            this.setState({
                data: [],
                loading: false
            });
            return;
        }

        this.setState({
            data: res.results,
            activeKey: '1',
            loading: false,
            pagination: { ...this.state.pagination, ...{ total: res.count } }
        });
    }

    onCollapseChange(key) {
        this.setState({
            activeKey: this.state.activeKey === '0' ? '1' : '0'
        });
    }

    openSite(item) {
        this.selectedSite = item;
        const siteUrl = item.link;
        this.setState({
            siteUrl
        });
    }

    async onSiteClose() {
        this.setState({
            siteUrl: '',
            loading: true
        });

        const res = await interactTask(this.selectedSite.id);

        this.setState({
            loading: false
        });

        if (res) {
            this.selectedSite = null;
            this.updateTable(this.state.pagination.defaultCurrent);
        }
    }

    render() {
        return (
            <div className="user-admin-browse-website">
                <h2 className="text-left">Browse Website</h2>
                <Link to={getUserWorkWebsitePath()}><Button type="primary" size="large" className="mr-1">Browse Website</Button></Link>
                <Link to={getUserWorkVideoPath()}><Button type="primary" size="large" className="ml-1">Watch Videos</Button></Link>
                
                <div className="mt-3">
                    <Collapse accordion activeKey={this.state.activeKey} onChange={this.onCollapseChange.bind(this)}>
                        <Panel header="Available tasks" key="1">
                            <Table pagination={this.state.pagination} loading={this.state.loading} dataSource={this.state.data} rowKey="id">
                                <Column
                                    title="#"
                                    key="index"
                                    render={(text, record, index) => index + 1}
                                />
                                <Column
                                    title="TVC Name"
                                    dataIndex="name"
                                    key="name"
                                />
                                <Column
                                    title="Reward amount"
                                    dataIndex="reward"
                                    key="reward"
                                    render={(text) => `$${text}`}
                                />
                                <Column
                                    title="Visit"
                                    key="btn"
                                    render={(text, record) => (
                                        <Button 
                                            type="primary" 
                                            onClick={() => this.openSite(record)}>
                                            Visit
                                        </Button>
                                    )}
                                />
                            </Table>
                        </Panel>
                    </Collapse>
                </div>
                <IframeModal
                    url={this.state.siteUrl}
                    onClose={this.onSiteClose.bind(this)}/>
            </div>
        );
    }
}
