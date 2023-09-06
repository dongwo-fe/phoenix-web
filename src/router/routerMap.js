// :a 添加  :e 编辑   :t 暂停/关闭/停止/失效   :d 删除   :r 设置权限

export const routers = [
    {
        path: '/dashboard',
        title: '首页',
        key: 'dashboard',
    },
    {
        path: '/website/index',
        title: '发布列表',
        key: 'Website',
        children: [
            {
                path: '/website/edit',
                title: '编辑',
                key: 'Website:e',
                roles: ['Website:e'],
            },
            {
                path: '/website/stop',
                title: '使用/暂停',
                key: 'Website:t',
                roles: ['Website:t'],
            },
        ],
    },
    {
        path: '/user/index',
        title: '用户管理',
        key: 'User',
        children: [
            {
                path: '/user/add',
                title: '添加',
                key: 'User:a',
                roles: ['User:a'],
            },
            {
                path: '/user/close',
                title: '启用/关闭',
                key: 'User:t',
                roles: ['User:t'],
            },
            {
                path: '/user/del',
                title: '删除',
                key: 'User:d',
                roles: ['User:d'],
            },
            {
                path: '/user/authority',
                title: '设置权限',
                key: 'User:r',
                roles: ['User:r'],
            },
        ],
    },
];
