import request from '@/utils/request';

// 获取发布列表
export function getWebsite(params) {
    return request.get('/website', params);
}
export function getWebsiteInfo(id) {
    return request.get('/website/info', { id });
}
// 编辑发布内容
export function editWebsite(data) {
    return request.post('/website/edit', data);
}

// 更新发布状态
export function updateWebsiteStatus(data) {
    return request.post('/website/use', data);
}

// 设置删除状态
export function deleteWebsiteStatus(data) {
    return request.post('/website/del', data);
}
export function getWebsiteLast(params) {
    return request.get('/website/last', params);
}
