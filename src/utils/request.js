import store from '@/store';
import { getToken } from '@/utils/auth';
import QF from './http_request';

function CreateRequest(prefix = '', code = 1) {
    const request = new QF(prefix);
    request.code = code;
    request.setHeads = function (data) {
        if (!data) data = {};
        if (store.getters.token) {
            return Object.assign(data, { token: getToken() });
        }
        return data;
    };

    request.afterFetch = function (res) {
        if (res.code === 401) {
            store.dispatch('user/resetToken').then(() => {
                location.reload();
            });
        }
    };
    return request;
}

export default CreateRequest('/api');
