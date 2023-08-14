<template>
    <div class="app-container">
        <el-form label-width="80px" label-position="left">
            <el-form-item label="权限列表">
                <el-tree ref="tree" :data="data" show-checkbox node-key="id" :props="defaultProps" :default-expand-all="true" :default-checked-keys="keys"></el-tree>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="confirmRole">确认</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getUserMenu, getMenus, getProjects, setUserMenu } from '@/api/ruleApi';

export default {
    name: 'SetMenu',
    data() {
        return {
            id: '',
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
            keys: [],
        };
    },
    created() {
        this.id = this.$route.query.id;
        this.getAllMenu();
        this.getMenuRule();
    },
    methods: {
        async getAllMenu() {
            const data = [];
            try {
                const list = await getProjects();
                list.forEach((item) => {
                    data.push({
                        id: item.id,
                        label: item.title,
                        children: [],
                    });
                });
            } catch (error) {
                console.log(error);
            }
            const data2 = [];
            try {
                const list = await getMenus();
                list.forEach((item) => {
                    if (item.pid === 0) {
                        data2.push({ id: item.name, label: item.title });
                    } else {
                        data.forEach((dataitem) => {
                            if (dataitem.id === item.pid) {
                                dataitem.children.push({
                                    id: item.name,
                                    label: item.title,
                                });
                            }
                        });
                    }
                });
            } catch (error) {
                console.log(error);
            }
            if (data2.length > 0) {
                data.push({
                    id: 0,
                    label: '其他',
                    children: data2,
                });
            }
            this.data = data;
        },
        async getMenuRule() {
            if (!this.id) return;
            try {
                const data = await getUserMenu({ uuid: this.id });
                if (data) {
                    this.keys = data.names.split(',');
                }
            } catch (error) {
                console.log(error);
            }
        },
        async confirmRole() {
            const checkedKeys = this.$refs.tree.getCheckedKeys();
            const list = checkedKeys.filter((item) => typeof item === 'string');
            console.log(list);
            if (list.length === 0) return;
            try {
                await setUserMenu({ uuid: this.id, keys: list.join() });
                this.$notify({
                    message: '更新成功',
                    type: 'success',
                });
            } catch (error) {
                console.log(error);
                this.$notify({
                    message: error.message,
                    type: 'error',
                });
            }
        },
        onCancel() {
            this.$router.go(-1);
        },
    },
};
</script>
<style lang="scss" scoped>
</style>
