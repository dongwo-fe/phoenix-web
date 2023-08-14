import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
            {
                path: 'authority',
                name: 'UserAuthority',
                hidden: true, // 不在侧边栏显示
                component: () => import('@/views/user/authority'),
                meta: { title: `设置权限`, activeMenu: '/user/index', roles: ['User:u'] },
            },
        ],
    },
    {
        path: '/rules',
        component: Layout,
        meta: { title: '权限管理', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('@/views/rules/menu'),
                meta: { title: '菜单管理', icon: 'el-icon-guide' },
            },
            {
                path: 'project',
                name: 'project',
                component: () => import('@/views/rules/project'),
                meta: { title: '项目管理', icon: 'el-icon-guide' },
            },
            {
                path: 'set_menu',
                name: 'set_menu',
                hidden: true, // 不在侧边栏显示
                component: () => import('@/views/rules/set_menu'),
                meta: { title: '设置菜单权限', icon: 'el-icon-guide' },
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
