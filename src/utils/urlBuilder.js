
export function getHomePath() {
    return '/';
}
getHomePath.mask = '/'; //for routing regexp


export function getLoginPath(mail = null) {
    return `/login/${mail || ''}`;
}
getLoginPath.mask = '/login/:mail?';

export function getRegistrationPath() {
    return '/registration/';
}
getRegistrationPath.mask = '/registration/:referrer?';

export function getRestorePath() {
    return '/restore/';
}
getRestorePath.mask = '/restore/';

export function getConfirmNewPasswordPath(uidb64, token) {
    return `/restore/apply/${uidb64}/:${token}?`;
}
getConfirmNewPasswordPath.mask = '/restore/apply/:uidb64?/:token?';

/*User Admin*/
export function getUserDashboardPath() {
    return '/user-admin/';
}
getUserDashboardPath.mask = '/user-admin/';

const userAdminPath = getUserDashboardPath();
const userAdminMask = getUserDashboardPath.mask;

export function getUserDepositPath() {
    return `${userAdminPath}deposit/`;
}
getUserDepositPath.mask = `${userAdminMask}deposit/`;


export function getUserPromotionPath() {
    return `${userAdminPath}promotion/`;
}
getUserPromotionPath.mask = `${userAdminMask}promotion/`;

export function getUserWorkPath() {
    return `${userAdminPath}work/`;
}
getUserWorkPath.mask = `${userAdminMask}work/`;

export function getUserWorkWebsitePath() {
    return `${userAdminPath}work/browse-websites/`;
}
getUserWorkWebsitePath.mask = `${userAdminMask}work/browse-websites/`;

export function getUserWorkVideoPath() {
    return `${userAdminPath}work/watch-video/`;
}
getUserWorkVideoPath.mask = `${userAdminMask}work/watch-video/`;

export function getUserReferPath() {
    return `${userAdminPath}refer-earn/`;
}
getUserReferPath.mask = `${userAdminMask}refer-earn/`;

export function getUserReferralsPath() {
    return `${userAdminPath}my-referrals/`;
}
getUserReferralsPath.mask = `${userAdminMask}my-referrals/`;

export function getUserKycPath() {
    return `${userAdminPath}kyc/`;
}
getUserKycPath.mask = `${userAdminPath}kyc/`;


export function getUserPaymentDetailsPath() {
    return `${userAdminPath}payment-details/`;
}
getUserPaymentDetailsPath.mask = `${userAdminPath}payment-details/`;


export function getUserTransferFundsPath() {
    return `${userAdminPath}transfer-funds/`;
}
getUserTransferFundsPath.mask = `${userAdminPath}transfer-funds/`;


export function getUserWithdrawPath() {
    return `${userAdminPath}withdraw/`;
}
getUserWithdrawPath.mask = `${userAdminPath}withdraw/`;


export function getUserSettingsPath() {
    return `${userAdminPath}settings/`;
}
getUserSettingsPath.mask = `${userAdminPath}settings/`;
