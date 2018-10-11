import React from 'react';
import {
    Carousel,
    Row,
    Col,
} from 'antd';
import {getUserDashboardPath} from '../../utils/urlBuilder';
import {isLoggedIn} from '../../services/session/authorization';
import banner1 from './banner-1.jpg';
import banner2 from './banner-2.jpg';
import banner3 from './banner-3.jpg';
import './index.scss';


export default class Homepage extends React.Component {

    constructor(props){
        super(props);
        if (isLoggedIn()) {
            props.history.push(getUserDashboardPath());
        }
    }

    onChange = () => {
        console.log('onChange');
    }

    render() {
        return (
            <div className="homepage">
                <div className="carousel" >
                    <Carousel afterChange={this.onChange}autoplay>
                        <div><img src="http://res.cloudinary.com/sheilafox/image/upload/v1525010194/banner-1-min.jpg"/></div>
                        <div><img src="http://res.cloudinary.com/sheilafox/image/upload/v1525010194/banner-2-min.jpg"/></div>
                        <div><img src="http://res.cloudinary.com/sheilafox/image/upload/v1525010194/banner-3-min.jpg"/></div>
                    </Carousel>
                </div>
                <div className="contents">
                    <div className="sections">
                        <Row gutter={16}>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <h1>1</h1>
                                    <h2>Register</h2>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <h1>2</h1>
                                    <h2>Work</h2>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div className="gutter-box">
                                    <h1>3</h1>
                                    <h2>Earn</h2>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="tutors">
                        <Row gutter={32} type="flex">
                            <Col className="gutter-row" span={12}>
                                <div className="gutter-box">
                                    <h2>Visit Website</h2>
                                    <p>You have to visit our partners website and <br/>
                                        you have to stay there for some seconds <br/>
                                        to earn money.</p>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={12}>
                                <div className="gutter-box">
                                    <h2>Watch Videos</h2>
                                    <ul>
                                        <li>Watch sponsored videos.</li>
                                        <li>Just watch and earn everyday.</li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}
