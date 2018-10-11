import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
import {Menu, Button, Icon, Avatar} from 'antd';
import {getActiveMenuIndex} from '../../../utils/miscUtils';
import {logout} from '../../../services/session/authorization';
import './left-side-menu.scss';

import {
    getUserPaymentDetailsPath,
    getHomePath,
    getUserDepositPath,
    getUserPromotionPath,
    getUserWorkPath,
    getUserWorkVideoPath,
    getUserWorkWebsitePath,
    getUserReferPath,
    getUserReferralsPath,
    getUserKycPath,
    getUserTransferFundsPath,
    getUserWithdrawPath,
    getUserSettingsPath,
    getUserDashboardPath,
} from '../../../utils/urlBuilder';

const {SubMenu} = Menu;

const defaultMenuItems = [
    {title: '', link: getHomePath},
    {title: 'Dashboard', link: getUserDashboardPath, icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507495/dashboard.png'},
    {title: 'Deposit', link: getUserDepositPath, icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525366313/deposit.png'},
    {title: 'Promotion', link: getUserPromotionPath, icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525366315/promotion.png'},
    {
        title: 'Work',
        link: getUserWorkPath,
        icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507517/work.png',
        subItems: [
            {title: 'Browse websites', link: getUserWorkWebsitePath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507483/browse_website.png'},
            {title: 'Watch Videos', link: getUserWorkVideoPath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507518/watch_video.png'},
        ],
    },
    {title: 'Refer & Earn', link: getUserReferPath, icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525366316/refer.png'},
    {title: 'My Referrals', link: getUserReferralsPath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507529/referrals.png'},
    {title: 'KYC', link: getUserKycPath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507529/kyc.png'},
    {title: 'Transfer Funds', link: getUserTransferFundsPath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525366317/transfer_fund.png'},
    {title: 'Withdraw', link: getUserWithdrawPath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525507496/withdraw.png'},
    {title: 'Settings', link: getUserSettingsPath,icon:'http://res.cloudinary.com/sheilafox/image/upload/v1525366320/settings.png'},
];

export default function LeftSideMenu({menuItems = defaultMenuItems, showLogout = true, activeMenuKey}) {
    const menuMatched = getActiveMenuIndex(menuItems);
    const defaultSelectedKey = activeMenuKey || menuMatched.index;
    const defaultOpenKeys = menuMatched.subMenu;

    return (
        <div className="left-side-menu">
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[`${defaultSelectedKey}`]}
                defaultOpenKeys={defaultOpenKeys}
                style={{height: '100%'}}>
                {menuItems.map((item, index) => {
                    return !item.subItems ?
                        <Menu.Item key={index}><NavLink to={item.link()}><img src={item.icon} alt='' />{item.title}</NavLink></Menu.Item> :
                        <SubMenu key="sub0" title={<NavLink to={item.link()}><img src={item.icon} alt='' />{item.title}</NavLink>}>
                            {item.subItems.map((subItem, subIndex) =>
                                (<Menu.Item key={`sub${subIndex}`}><NavLink
                                    to={subItem.link()}><img src={subItem.icon} alt='' />{subItem.title}</NavLink></Menu.Item>)
                            )}
                        </SubMenu>;
                }
                )}
            </Menu>
            {showLogout && <div style={{textAlign: 'center'}}>
                <Button type="primary" icon="logout" style={{margin: '3rem auto 2rem auto'}}
                    onClick={() => logout()}> <span>Logout</span></Button>
            </div>}
        </div>
    );
}
LeftSideMenu.propTypes = {
    menuItems: PropTypes.array,
    showLogout: PropTypes.bool,
    activeMenuKey: PropTypes.string,
};
