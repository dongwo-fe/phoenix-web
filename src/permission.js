import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/loginos', '/onLogin']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    // determine whether the user has logged in
    const hasToken = getToken();

    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done();
        } else {
            const hasGetUserInfo = store.getters.name;
            if (hasGetUserInfo) {
                // const resRoles = to.roles ? to.roles.some((r) => store.getters.roles.includes(r)) : true;
                // resRoles ? next() : next({ path: '/' });
                next();
            } else {
                try {
                    // get user info
                    await store.dispatch('user/getInfo');
                    next();
                } catch (error) {
                    console.log(error);
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken');
                    Message.error(error || 'Has Error');
                    next(`/login?redirect=${to.path}`);
                    NProgress.done();
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
