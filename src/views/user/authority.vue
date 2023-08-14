<template>
    <div class="app-container">
        <el-form label-width="80px" label-position="left">
            <el-form-item label="用户名">
                <span class="textName" v-text="params.username" />
            </el-form-item>

            <el-form-item label="权限列表">
                <el-tree
                    ref="tree"
                    :check-strictly="checkStrictly"
                    :data="routesData"
                    default-expand-all
                    :default-checked-keys="params.roles"
                    :props="defaultProps"
                    show-checkbox
                    node-key="key"
                    class="permission-tree"
                />
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="confirmRole">确认</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { routers } from '@/router/routerMap';
import { setUserRoles } from '@/api/userManage';

export default {
    name: 'UserAuthority',
    data() {
        return {
            checkStrictly: false,
            routes: routers,
            uuId: '',
            name: '',
            defaultProps: {
                children: 'children',
                label: 'title',
            },
            params: {},
        };
    },
    computed: {
        routesData() {
            return this.routes;
        },
    },
    created() {
        this.getUuId();
    },
    methods: {
        getUuId() {
            console.log(this.$store.getters);
            const aRoles = this.$store.getters.roles ? this.$store.getters.roles : [];
            this.params = { ...this.$route.params, roles: aRoles };
        },
        async confirmRole() {
            const checkedKeys = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
            // const parentCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
            const rolesKey = [...new Set(checkedKeys)];

            console.log(rolesKey);
            setUserRoles({ uuid: this.params.uuid, roles: rolesKey.join(',') })
                .then((res) => {
                    if (res.code) {
                        if (window.history.length <= 1) {
                            // 提示不能跳转
                            this.$message({
                                message: '上级页面路由丢失！',
                                type: 'warning',
                            });
                        } else {
                            // 返回上级路由
                            this.$message({
                                message: `权限设置成功`,
                                type: 'success',
                            });
                            // this.$notify({
                            //   title: 'Success',
                            //   dangerouslyUseHTMLString: true,
                            //   message: `
                            //   <div>Role Update successfully</div>
                            // `,
                            //   type: 'success'
                            // });
                            this.$router.go(-1);
                        }
                    }
                })
                .catch((err) => console.log(err));
        },
        onCancel() {
            if (window.history.length <= 1) {
                // 提示不能跳转
                this.$message({
                    message: '上级页面路由丢失！',
                    type: 'warning',
                });
            } else {
                // 返回上级路由
                this.$router.go(-1);
            }
        },
    },
};
</script>

<style scoped>
.line {
    text-align: center;
}
.textName {
    font-size: 16px;
}
</style>

