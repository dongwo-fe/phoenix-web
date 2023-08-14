import request from '@/utils/request';

// 获取项目列表
export function getLogs(data) {
    return request.get('/logs', data);
}
