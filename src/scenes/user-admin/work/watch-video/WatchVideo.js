import React, {Component} from 'react';
import {Button, List, Card, Icon, Modal} from 'antd';
import {Link} from 'react-router-dom';
import {getUserWorkVideoPath, getUserWorkWebsitePath} from '../../../../utils/urlBuilder';
import {getTasks, interactTask} from '../../../../services/session/authorization';
import YoutubePlayer from '../../../../components/youtube-player/YoutubePlayer';

import * as _ from 'lodash';

import './watchvideo.scss';

const {Item} = List;
const {Meta} = Card;

export default class WatchVideo extends Component {

    constructor() {
        super();

        this.state = {
            data: [],
            loading: false,
            pagination: {
                pageSize: 12,
                defaultCurrent: 1,
                onChange: (page) => {
                    this.updateList(page);
                }
            },
            videoUrl: ''
        }

        this.selectedVideo = {};
    }

    componentDidMount() {
        this.updateList(this.state.pagination.defaultCurrent);
    }

    async updateList(page) {
        const params = {
            limit: this.state.pagination.pageSize,
            offset: (page - 1) * this.state.pagination.pageSize,
            kind: 0
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
            loading: false,
            pagination: { ...this.state.pagination, ...{ total: res.count } }
        });
    }

    openPlayer(item) {
        this.selectedVideo = item;
        const videoUrl = item.link;
        this.setState({
            videoUrl
        });
    }

    async onClose(duration) {
        this.setState({
            videoUrl: ''
        });
        if (duration >= 20) {
            this.setState({
                loading: true
            });

            const res = await interactTask(this.selectedVideo.id);

            this.setState({
                loading: false
            });

            if (res) {
                this.selectedVideo = null;
                this.updateList(this.state.pagination.defaultCurrent);
            }
        }
    }

    render() {
        return (
            <div className="user-admin-watch-video">
                <h2 className="text-left">Watch Videos</h2>
                <Link to={getUserWorkWebsitePath()}><Button type="primary" size="large" className="mr-1">Browse Website</Button></Link>
                <Link to={getUserWorkVideoPath()}><Button type="primary" size="large" className="ml-1">Watch Videos</Button></Link>

                <div className="mt-3">
                    <List
                        grid={{ gutter: 16, xs: 1, md: 2, lg: 3, xl: 4, xxl: 6 }}
                        dataSource={this.state.data}
                        loading={this.state.loading}
                        pagination={this.state.pagination}
                        className="video-list"
                        renderItem={item => (
                        <Item>
                            <Card
                                hoverable
                                onClick={() => this.openPlayer(item)}
                                cover={<div className="cover-view"><Icon type="play-circle"/></div>}>
                                <Meta
                                    title={item.name}
                                    description={`Rewarded amount: $${item.reward}`}
                                />
                            </Card>
                        </Item>
                        )}
                    />
                </div>
                <YoutubePlayer
                    url={this.state.videoUrl}
                    onClose={this.onClose.bind(this)}/>
            </div>
        );
    }
}
