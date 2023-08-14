<template>
    <!-- 用户管理 -->
    <div class="app-container">
        <el-row class="display headerBox">
            <el-col class="searchBox">
                <el-input v-model="listQuery.username" clearable placeholder="用户名" style="width: 120px" class="filter-item" @keyup.enter.native="handleFilter" />
                <el-input v-model="listQuery.o_username" clearable placeholder="发布人" style="width: 120px" class="filter-item" @keyup.enter.native="handleFilter" />
                <el-select v-model="listQuery.status" clearable placeholder="状态" style="width: 100px" class="filter-item">
                    <el-option v-for="item in userStatus" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> Search </el-button>
            </el-col>
            <el-button v-waves v-permission="['User:a']" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()"> 添加 </el-button>
        </el-row>

        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column v-for="item in tableColumn" :key="item.id" :label="item.label" align="center" :width="item.width">
                <template slot-scope="{ row, $index }">
                    <el-tag v-if="item.showMode === 'tag'" :type="row.status | statusFilter">{{ row[item.content] ? '启用' : '关闭' }}</el-tag>
                    <el-tag v-if="item.showMode === 'idtag'" :type="row.uidentity | idtypeFilter">{{ row[item.content] | idFilter }}</el-tag>
                    <span v-else-if="item.showMode === 'index'">{{ $index }}</span>
                    <span v-else-if="item.showMode === 'text'">{{ row[item.content] }}</span>
                    <span v-else-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
                    <!-- | parseTime('{y}-{m}-{d} {h}:{i}') -->
                </template>
            </el-table-column>
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
                <template slot-scope="{ row }">
                    <el-button type="primary" size="mini" @click="handleAdd(row)"> 编辑 </el-button>
                    <el-button size="mini" type="success" @click="setAuthority(row)"> 菜单权限 </el-button>
                    <el-button v-if="row.status !== 1" v-permission="['User:t']" size="mini" @click="handleModifyStatus(row, 1)"> 启用 </el-button>
                    <el-button v-else-if="row.status !== 0" v-permission="['User:t']" size="mini" @click="handleModifyStatus(row, 0)"> 禁用 </el-button>
                    <!-- v-if="row.status!==1" -->
                    <el-button v-userid="'admin'" size="mini" type="danger" @click="handleDelete(row)"> 删除 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.page" @pagination="fetchData" />

        <el-dialog :visible.sync="dialogAddVisible" :title="temp.uuid ? '编辑用户' : '添加用户'">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="70px">
                <!--  -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="temp.username" :disabled="!(!temp.uuid || temp.o_username === 'system')" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="temp.nickname" />
                </el-form-item>
                <el-form-item label="手机号" prop="tell">
                    <el-input v-model="temp.tell" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="temp.password" />
                </el-form-item>
                <el-form-item v-userid="'admin'" label="身份" prop="uidentity">
                    <el-select v-model="temp.uidentity" placeholder="请选择环境">
                        <el-option label="默认" value="" />
                        <el-option label="开发" value="dev" />
                        <el-option label="运维" value="ops" />
                        <el-option label="产品" value="prod" />
                        <el-option label="运营" value="work" />
                        <el-option label="管理员" value="admin" />
                    </el-select>
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
import { getUsers, addUsers, updateUsers, delUsers } from '@/api/userManage';
import permission from '@/directive/permission/index.js'; // 权限判断指令
import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import userid from '@/directive/permission/userid';

export default {
    name: 'Users',
    directives: { waves, permission, userid },
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: 'success',
                0: 'gray',
            };
            return statusMap[status];
        },
        idtypeFilter(uidentity) {
            if (uidentity === 'dev') return 'info';
            if (uidentity === 'ops') return 'warning';
            if (uidentity === 'prod') return 'success';
            if (uidentity === 'work') return 'success';
            if (uidentity === 'admin') return 'danger';
            return '';
        },
        idFilter(uidentity) {
            if (uidentity === 'dev') return '开发';
            if (uidentity === 'ops') return '运维';
            if (uidentity === 'prod') return '产品';
            if (uidentity === 'work') return '运营';
            if (uidentity === 'admin') return '管理员';
            return '默认';
        },
    },
    data() {
        return {
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                o_username: undefined,
                status: undefined,
                username: undefined,
            },
            userStatus: [
                { label: '关闭', key: 0 },
                { label: '启用', key: 1 },
            ],
            tableColumn: [
                { id: 2, label: '用户名', width: '200', content: 'username', showMode: 'text' },
                { id: 3, label: '手机号', width: '140', content: 'tell', showMode: 'text' },
                { id: 4, label: '昵称', width: '180', content: 'nickname', showMode: 'text' },
                { id: 5, label: '身份', width: '120', content: 'uidentity', showMode: 'idtag' },
                { id: 6, label: '操作人', width: '140', content: 'o_nickname', showMode: 'text' },
                { id: 7, label: '修改日期', width: '170', content: 'updatedAt', showMode: 'date' },
                { id: 8, label: '状态', width: '80', content: 'status', showMode: 'tag' },
            ],
            dialogAddVisible: false,
            dialogLoading: false,
            rules: {
                username: [{ required: true, message: 'username is required', trigger: 'change' }],
                // nickname: [{ required: true, message: 'nickname is required', trigger: 'change' }],
                // password: [{ required: true, message: 'password is required', trigger: 'blur' }],
            },
            temp: {
                uuid: '',
                password: undefined,
                nickname: undefined,
                username: undefined,
                uidentity: '',
                tell: '',
            },
        };
    },
    computed: {},
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                this.listLoading = true;
                const data = await getUsers(this.listQuery);
                this.list = data.rows;
                this.total = data.count;
                this.listLoading = false;
            } catch (error) {
                this.listLoading = false;
                console.log(error);
                this.$notify({
                    title: 'Error',
                    message: error.message,
                    type: 'error',
                    duration: 5000,
                });
            }
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.fetchData();
        },
        setAuthority(row) {
            this.$router.push({ path: '/rules/set_menu', query: { id: row.uuid } });
        },
        handleAdd(row) {
            if (row) {
                this.temp = row;
            } else {
                this.temp = { uuid: '', password: undefined, nickname: undefined, username: undefined, uidentity: '', tell: '' };
            }
            this.dialogAddVisible = true;
        },
        handleUpdate(row) {
            try {
                this.$refs['dataForm'].validate(async (valid) => {
                    if (valid) {
                        this.dialogLoading = true;
                        try {
                            await addUsers(this.temp);
                            this.dialogAddVisible = false;
                            this.$notify({
                                message: '操作成功',
                                type: 'success',
                            });
                            this.fetchData();
                        } catch (error) {
                            this.$notify({
                                message: error.message,
                                type: 'error',
                            });
                        }
                        this.dialogLoading = false;
                    }
                });
            } catch (error) {
                console.log(error);
            }
        },
        handleModifyStatus(row, status) {
            updateUsers({ uuid: row.uuid, status })
                .then((res) => {
                    this.dialogLoading = false;
                    this.fetchData();
                })
                .catch((error) => {
                    console.log(error);
                });
            this.dialogAddVisible = false;
        },
        handleDelete(row) {
            delUsers({ ids: [row.uuid] }).then((res) => {
                console.log(res);
                this.fetchData();
            });
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
