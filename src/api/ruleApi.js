import request from '@/utils/request';

export function getProject() {
    return request.get('/rules/project');
}

export function editProject(data) {
    return request.post('/rules/project/edit', data);
}
export function useProject(data) {
    return request.post('/rules/project/use', data);
}
export function getProjects() {
    return request.get('/rules/projects');
}
// ====
export function getMenu(data) {
    return request.get('/rules/menu', data);
}
export function getMenus(data) {
    return request.get('/rules/menus', data);
}
export function editMenu(data) {
    return request.post('/rules/menu/edit', data);
}
export function useMenu(data) {
    return request.post('/rules/menu/use', data);
}
export function delMenu(data) {
    return request.post('/rules/menu/del', data);
}
// =====
export function getUserMenu(data) {
    return request.get('/rules/user_menu', data);
}
export function setUserMenu(data) {
    return request.post('/rules/user_menu/set', data);
}
