import request from '@/utils/request';

// 获取项目列表
export function getHouses() {
    return request.get('/house');
}

export function createHouses(data) {
    return request.post('/house/create_house', data);
}

export function deleteHouse(id) {
    return request.post('/house/delete_house', { id });
}
export function createEnv(data) {
    return request.post('/house/create_env', data);
}
export function deleteEnv(id) {
    return request.post('/house/delete_env', { id });
}
export function getHouseJson(id, type) {
    return request.get('/house/json', { id, type });
}
export function updateHouseJson(id, type, json_data) {
    return request.post('/house/json', { id, type, json_data });
}
