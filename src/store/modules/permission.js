import { asyncRoutes, constantRoutes } from '@/router';

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];

    routes.forEach((route) => {
        const tmp = { ...route };
        // if (hasPermission(roles, tmp)) {
        if (tmp.children) {
            tmp.children = filterAsyncRoutes(tmp.children, roles);
        }
        res.push(tmp);
        // }
    });
    return res;
}

const state = {
    routes: constantRoutes,
    addRoutes: [],
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = routes;
    },
};

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise((resolve) => {
            let accessedRoutes;
            if (roles.includes('admin')) {
                accessedRoutes = asyncRoutes || [];
            } else {
                accessedRoutes = filterAsyncRoutes(constantRoutes, roles);
            }
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes);
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
