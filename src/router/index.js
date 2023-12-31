import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
    },
    {
        path: '/loginos',
        component: () => import('@/views/login/public'),
        hidden: true,
    },
    {
        path: '/onLogin',
        component: () => import('@/views/login/onLogin'),
        hidden: true,
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true,
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: { title: '首页', icon: 'dashboard' },
            },
        ],
    },

    {
        path: '/website',
        component: Layout,
        meta: { roles: ['Website'] },
        children: [
            {
                path: 'index',
                name: 'Website',
                alwaysShow: true, // 一直显示根路由
                component: () => import('@/views/website/index'),
                meta: { title: '发布列表', icon: 'el-icon-position', roles: ['Website'] },
            },
            {
                path: 'edit',
                name: 'WebsiteEdit',
                hidden: true, // 不在侧边栏显示
                component: () => import('@/views/website/edit'),
                meta: { title: '编辑', activeMenu: '/website/index', roles: ['Website:e'] },
            },
        ],
    },
    {
        path: '/user',
        component: Layout,
        meta: { roles: ['User'] },
        children: [
            {
                path: 'index',
                name: 'User',
                alwaysShow: true, // 一直显示根路由
                component: () => import('@/views/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-s-custom', roles: ['User'] },
            },
        ],
    },
    {
        path: '/logs',
        component: Layout,
        meta: { roles: [] },
        children: [
            {
                path: 'index',
                name: 'logs',
                alwaysShow: true, // 一直显示根路由
                component: () => import('@/views/logs/index'),
                meta: { title: '日志管理', icon: 'el-icon-s-order', roles: [] },
            },
        ],
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true },
];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes,
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}
export default router;

export const asyncRoutes = [];
