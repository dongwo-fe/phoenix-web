import request from '@/utils/request';

export function login(data) {
    return request.post('/auth/login', data);
}

export function getInfo() {
    return request.get('/users/profile');
}

export function logout() {}

export function users(data) {
    return request.post('/users', data);
}
