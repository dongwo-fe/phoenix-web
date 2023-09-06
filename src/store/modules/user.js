import { login, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
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
        commit('SET_uidentity', data.uidentity);
    },

    // get user info
    async getInfo({ commit, state }) {
        const data = await getInfo();
        if (!data) {
            throw new Error('Verification failed, please Login again.');
        }
        const { nickname, avatar, username, uidentity } = data;
        if (avatar) commit('SET_AVATAR', avatar);
        commit('SET_NAME', nickname || username);
        commit('SET_uidentity', uidentity);
        return data;
    },

    // user logout
    logout({ commit, state }) {
        removeToken(); // must remove  token  first
        commit('RESET_STATE');
        resetRouter();
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
