import { login, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        roles: [],
        uidentity: '',
    };
};

const state = getDefaultState();

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_uidentity: (state, uidentity) => {
        state.uidentity = uidentity;
    },
};

const actions = {
    // user login
    async login({ commit }, userInfo) {
        const { username, password } = userInfo;
        const data = await login({ username: username.trim(), password: password });
        commit('SET_TOKEN', data.token);
        setToken(data.token);
    },

    // get user info
    async getInfo({ commit, state }) {
        const data = await getInfo();
        if (!data) {
            throw new Error('Verification failed, please Login again.');
        }
        const { nickname, roles, avatar, username, uidentity } = data;
        if (avatar) commit('SET_AVATAR', avatar);
        commit('SET_NAME', nickname || username);
        commit('SET_uidentity', uidentity);
        commit('SET_ROLES', roles ? roles.split(',') : []);
        return data;
    },

    // user logout
    logout({ commit, state }) {
        removeToken(); // must remove  token  first
        commit('RESET_STATE');
        resetRouter();
        // return new Promise((resolve, reject) => {
        //   logout(state.token).then(() => {
        //     removeToken(); // must remove  token  first
        //     resetRouter();
        //     commit('RESET_STATE');
        //     resolve();
        //   }).catch(error => {
        //     reject(error);
        //   });
        // });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken(); // must remove  token  first
            commit('RESET_STATE');
            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
