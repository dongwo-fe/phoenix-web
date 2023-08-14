import request from '@/utils/request';

// 获取用户列表
export function getUsers(params) {
    return request.get('/users', params);
}

// 添加用户
export function addUsers(data) {
    return request.post('/users/edit', data);
}

// 设置用户状态
export function updateUsers(data) {
    return request.post('/users/update', data);
}

// 设置权限
export function setUserRoles(data) {
    return request.post('/users/roles', data);
}

// 删除用户
export function delUsers(data) {
    return request.post('/users/del', data);
}
// 公开的登录行为
export function publicLogin(data) {
    return request.post('/auth/login2', data);
}
