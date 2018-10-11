import React from 'react';
import {Layout} from 'antd';
import PropTypes from 'prop-types';
import LeftMenu from '../common/left-side-menu/LeftSideMenu';
import {isLoggedIn} from '../../services/session/authorization';
import {getHomePath} from '../../utils/urlBuilder';

const {Sider, Content} = Layout;


class RouteWrapper extends React.Component {

    static contextTypes = {
        history: PropTypes.object,
    };

    static propTypes = {
        needAuthorization: PropTypes.bool,
        showLeftSide: PropTypes.bool,
    };

    render() {
        const {needAuthorization, showLeftSide, children} = this.props;
        if (needAuthorization && !isLoggedIn()) {
            this.context.history.push(getHomePath());
        }
        return (
            <Layout>
                {showLeftSide && <Sider key={0} collapsible><LeftMenu/></Sider>}
                <Content>
                    <div className="content-wrapper">{children}</div>
                </Content>
            </Layout>
        );
    }
}

export default function (Component, needAuthorization, showLeftSide, ...wrapperProps) {
    return (...props) => {
        let newProps = {};
        if (props && props.length) {
            props.forEach(item => newProps = {...newProps, ...item});
        } else {
            newProps = props;
        }

        return (
            <RouteWrapper needAuthorization={needAuthorization} showLeftSide={showLeftSide} {...wrapperProps}>
                <Component {...newProps}/>
            </RouteWrapper>
        )
    };
}
