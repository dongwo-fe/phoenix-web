import axios from 'axios';

class RError extends Error {
    constructor(msg, code = 0) {
        super(msg);
        this.code = code;
    }
    code = 0;
}

export default class {
    constructor(baseURL, timeout) {
        this.baseURL = baseURL || '';
        this.timeout = timeout || 10000;
    }
    /**
     * 请求前缀
     */
    baseURL = '';
    /**
     * 是否成功的状态码判断
     */
    code = '200';

    // 超时时间
    timeout = 10000;

    /**
     * 请求发出前的拦截方法
     * @param method 请求类型
     * @param url 请求地址
     * @param params url参数
     * @param data body参数
     */
    async beforFetch(method, url, params, data) {}
    /**
     * 请求返回之后的拦截方法
     * @param data 返回的参数
     */
    async afterFetch(data, res) {}
    /**
     * 设置head对象
     * @returns
     */
    async setHeads(headparam) {
        return headparam || {};
    }

    // 检查url是否需要添加前缀
    _checkURL(url) {
        if (/^http/.test(url)) return url;
        return this.baseURL + url;
    }
    // 检查code是否正确
    _checkCode(data) {
        if (data.code !== this.code) throw new RError(data.message || '请求失败', data.code);
    }

    // 请求方法
    async _fetch(method, url, params, data, responseType = 'json', headparam) {
        const { timeout } = this;
        const headers = await this.setHeads(headparam);
        const newURL = this._checkURL(url);
        if (this.beforFetch) await this.beforFetch(method, url, params, data);
        const config = { url: newURL, method, headers, params, data, responseType, timeout };
        const res = await axios(config);
        const body = res.data;
        if (this.afterFetch) await this.afterFetch(body, res);
        if (responseType === 'blob') return body;
        this._checkCode(body);
        return body.data;
    }
    /**
     * GET请求
     * @param url 请求地址，支持当前域和其他域
     * @param params 参数，url后面的参数
     * @returns
     */
    async get(url, params) {
        return this._fetch('GET', url, params);
    }
    async get_heads(url, params, heads) {
        return this._fetch('GET', url, params, undefined, undefined, heads);
    }
    /**
     * POST请求
     * @param url 请求地址，支持当前域和其他域
     * @param data 参数，body中的参数
     * @param params 参数，url中的参数
     * @returns
     */
    async post(url, data, params) {
        return this._fetch('POST', url, params, data);
    }
    async post_heads(url, data, params, heads) {
        return this._fetch('POST', url, params, data, undefined, heads);
    }
    /**
     * PUT请求
     * @param url 请求地址，支持当前域和其他域
     * @param data 参数，body中的参数
     * @param params 参数，url中的参数
     * @returns
     */
    async put(url, data, params) {
        return this._fetch('PUT', url, params, data);
    }
    /**
     * DELETE请求
     * @param url 请求地址，支持当前域和其他域
     * @param params 参数，url的参数
     * @returns
     */
    async delete(url, params) {
        return this._fetch('DELETE', url, params);
    }
}
