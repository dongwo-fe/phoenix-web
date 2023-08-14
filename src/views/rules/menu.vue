<template>
    <!-- 用户管理 -->
    <div class="app-container">
        <el-row class="display headerBox">
            <el-col class="searchBox">
                <el-input v-model="listQuery.title" clearable placeholder="名称" style="width: 120px" class="filter-item" @keyup.enter.native="handleFilter" />
                <el-select v-model="listQuery.pid" clearable placeholder="请选择项目">
                    <el-option v-for="item in projects" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
                <el-select v-model="listQuery.status" clearable placeholder="请选择状态">
                    <el-option label="禁止" :value="0" />
                    <el-option label="启用" :value="1" />
                </el-select>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> Search </el-button>
            </el-col>
            <el-button v-waves v-permission="['User:a']" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()"> 添加 </el-button>
        </el-row>

        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column v-for="item in tableColumn" :key="item.id" :label="item.label" align="center" :width="item.width">
                <template slot-scope="{ row, $index }">
                    <el-tag v-if="item.showMode === 'tag'" :type="row.status | statusFilter">{{ row[item.content] ? '启用' : '关闭' }}</el-tag>
                    <span v-else-if="item.showMode === 'index'">{{ $index }}</span>
                    <span v-else-if="item.showMode === 'text'">{{ row[item.content] }}</span>
                    <span v-else-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
                    <!-- | parseTime('{y}-{m}-{d} {h}:{i}') -->
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
                <template slot-scope="{ row }">
                    <el-button v-if="row.status === 0" type="primary" size="mini" @click="handleAdd(row)"> 编辑 </el-button>
                    <el-button v-if="row.status !== 1" v-permission="['User:t']" size="mini" @click="handleModifyStatus(row, 1)"> 启用 </el-button>
                    <el-button v-else-if="row.status !== 0" v-permission="['User:t']" size="mini" @click="handleModifyStatus(row, 0)"> 禁用 </el-button>
                    <el-button v-if="row.status === 0" size="mini" type="danger" @click="handleDelete(row)"> 删除 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.pageindex" @pagination="fetchData" />

        <el-dialog :visible.sync="dialogAddVisible" title="添加/编辑菜单权限" width="500px">
            <el-form ref="dataForm" :model="temp" label-position="right" label-width="70px">
                <el-form-item label="项目" prop="pid">
                    <el-select v-model="temp.pid" clearable placeholder="请选择项目">
                        <el-option v-for="item in projects" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="title">
                    <el-input v-model="temp.title" />
                </el-form-item>
                <el-form-item label="权限名" prop="name">
                    <el-input v-model="temp.name" :disabled="temp.id > 0" placeholder="可输入字母数字下划线" />
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="temp.path" placeholder="例如:/home/test" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false"> 取消 </el-button>
                <el-button type="primary" @click="handleUpdate">
                    <i v-if="dialogLoading" class="el-icon-loading" />
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getMenu, editMenu, useMenu, delMenu } from '@/api/ruleApi';
import { getProjects } from '@/api/ruleApi';
import permission from '@/directive/permission/index.js'; // 权限判断指令
import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

export default {
    name: 'Users',
    directives: { waves, permission },
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: 'success',
                0: 'gray',
            };
            return statusMap[status];
        },
    },
    data() {
        return {
            list: [],
            total: 0,
            projects: [],
            listLoading: true,
            listQuery: {
                pageindex: 1,
                title: '',
                pid: undefined,
                status: undefined,
            },
            tableColumn: [
                { id: 1, label: 'id', width: '90', content: 'id', showMode: 'text' },
                { id: 2, label: '名称', width: '', content: 'title', showMode: 'text' },
                { id: 3, label: '权限', width: '120', content: 'name', showMode: 'text' },
                { id: 4, label: '路径', width: '', content: 'path', showMode: 'text' },
                { id: 5, label: '项目', width: '150', content: 'ptitle', showMode: 'text' },
                { id: 6, label: '修改日期', width: '', content: 'updatedAt', showMode: 'date' },
                { id: 7, label: '状态', width: '100', content: 'status', showMode: 'tag' },
            ],
            dialogAddVisible: false,
            dialogLoading: false,
            temp: {
                pid: undefined,
                title: '',
                name: '',
                path: '',
            },
        };
    },
    computed: {},
    mounted() {
        this.getProjects();
        this.fetchData();
    },
    methods: {
        async getProjects() {
            try {
                const list = await getProjects();
                this.projects = list;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchData() {
            try {
                this.listLoading = true;
                console.log(this.listQuery);
                const data = await getMenu(this.listQuery);
                this.list = data.rows;
                this.total = data.count;
                this.listLoading = false;
            } catch (error) {
                this.listLoading = false;
                this.$notify({
                    title: 'Error',
                    message: error.message,
                    type: 'error',
                    duration: 5000,
                });
            }
        },
        handleFilter() {
            this.listQuery.pageindex = 1;
            this.fetchData();
        },
        setAuthority(row) {
            this.$router.push({ path: '/user/authority', query: { id: row.uuid } });
        },
        handleAdd(row) {
            if (row) {
                this.temp = { ...row };
            } else {
                this.temp = {
                    title: '',
                    name: '',
                };
            }
            this.dialogAddVisible = true;
        },
        async handleUpdate(row) {
            try {
                this.dialogLoading = true;
                console.log(this.temp);
                await editMenu(this.temp);
                this.fetchData();
                this.dialogAddVisible = false;
                this.dialogLoading = false;
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        async handleModifyStatus(row, status) {
            try {
                this.dialogLoading = true;
                await useMenu({ id: row.id, status });
                this.fetchData();
            } catch (error) {
                this.$message.error(error.message);
            }
            this.dialogLoading = false;
        },
        async handleDelete(row) {
            try {
                await delMenu({ id: row.id });
                this.fetchData();
            } catch (error) {
                this.$message.error(error.message);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.display {
    display: flex;
    justify-content: space-between;
}
.headerBox {
    padding-bottom: 20px;
}
.searchBox {
    > div {
        margin-right: 20px;
    }
}
.textRight {
    text-align: right;
}
</style>
