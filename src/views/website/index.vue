<template>
    <!-- 发布列表 -->
    <div class="app-container">
        <!-- <el-row class="projectHeader">
            <el-select v-model="listQuery.pid" placeholder="请选择项目" clearable class="filter-item" @change="projectChange">
                <el-option v-for="item in projectList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
        </el-row> -->

        <el-row class="display headerBox">
            <el-col class="searchBox">
                <!-- <el-date-picker v-model="listQuery.publish_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="发布日期" /> -->
                <!-- <el-date-picker v-model="listQuery.release_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="编译日期" /> -->

                <el-input v-model="listQuery.username" placeholder="发布人" style="width: 130px" class="filter-item" @keyup.enter.native="handleFilter" />
                <el-input v-model="listQuery.host" placeholder="域名" style="width: 130px" class="filter-item" @keyup.enter.native="handleFilter" />
                <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px">
                    <el-option v-for="item in websiteType" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
                <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 130px" class="filter-item">
                    <el-option label="生效" value="1" />
                    <el-option label="失效" value="0" />
                </el-select>
                <el-select v-model="listQuery.env" placeholder="环境" clearable style="width: 130px" class="filter-item">
                    <el-option label="DEV" value="dev" />
                    <el-option label="DEV2" value="dev2" />
                    <el-option label="DEV3" value="dev3" />
                    <el-option label="DEV4" value="dev4" />
                    <el-option label="SIT" value="sit" />
                    <el-option label="UAT" value="uat" />
                    <el-option label="灰度" value="gray" />
                    <el-option label="生产" value="production" />
                </el-select>
            </el-col>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter"> Search </el-button>
        </el-row>

        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column label="ID" align="center" :width="90">
                <template slot-scope="{ row }">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column v-for="item in tableColumn" :key="item.id" :label="item.label" align="center" :width="item.width">
                <template slot-scope="{ row }">
                    <el-tag v-if="item.showMode === 'tag'" :type="row[item.content] | statusFilter">{{ row[item.content] !== 1 ? '失效' : '生效' }}</el-tag>
                    <span v-else-if="item.showMode === 'text'">{{ row[item.content] }}</span>
                    <span v-else-if="item.showMode === 'textFilter'">{{ row[item.content] | typeFilter }}</span>
                    <span v-else-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="300">
                <template slot-scope="{ row }">
                    <el-button v-if="row.status === 0" size="mini" type="success" @click="handleSure(row, 1)"> 使用 </el-button>
                    <el-button v-if="row.status === 1" size="mini" @click="handleSure(row, 0)"> 暂停 </el-button>
                    <el-button v-if="row.status === 0" type="primary" size="mini" @click="handleUpdate(row)"> 编辑 </el-button>
                    <el-button v-if="row.status === 0" type="primary" size="mini" @click="handle2AllUser(row)"> 一键全量 </el-button>
                    <el-button v-if="row.type !== 0" v-userid="'admin'" type="error" size="mini" @click="handleDelete(row)"> 删除 </el-button>
                    <el-tag v-if="row.status === -1" type="gray">已删除</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.page" @pagination="fetchData" />
    </div>
</template>

<script>
import { getWebsite, updateWebsiteStatus, deleteWebsiteStatus, editWebsite } from '@/api/websiteManage';
import permission from '@/directive/permission/index.js'; // 权限判断指令
import waves from '@/directive/waves'; // waves directive
import moment from 'moment';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import userid from '@/directive/permission/userid';

const websiteType = [
    { key: 0, label: '全量' },
    { key: 1, label: '灰度' },
    { key: 2, label: '白名单' },
    { key: 3, label: '体验版' },
];

export default {
    name: 'Website',
    directives: { waves, permission, userid },
    components: { Pagination },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: 'success',
                0: 'gray',
                '-1': 'danger',
            };
            return statusMap[status];
        },
        typeFilter(type) {
            const statusMap = {
                0: '全量',
                1: '灰度',
                2: '白名单',
                3: '体验版',
            };
            return statusMap[type];
        },
    },
    data() {
        return {
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                pid: null,
                status: undefined,
                username: undefined,
                type: undefined,
                publish_time: undefined,
                release_time: undefined,
                env: '',
                host: '',
            },
            websiteType,
            websiteStatus: [
                { label: '失效', key: '0' },
                { label: '生效', key: '1' },
                { label: '刷新中', key: '2' },
            ],
            projectList: [], // 项目列表
            tableColumn: [
                { id: 1, label: '映射域名', width: '', content: 'host', showMode: 'text' },
                { id: 2, label: '环境', width: 130, content: 'env', showMode: 'text' },
                { id: 3, label: '编译时间', width: 170, content: 'release_time', showMode: 'date' },
                { id: 4, label: '发布时间', width: 170, content: 'publish_time', showMode: 'date' },
                { id: 5, label: '发布人', width: 150, content: 'nickname', showMode: 'text' },
                { id: 6, label: '发布类型', width: 110, content: 'type', showMode: 'textFilter' },
                { id: 7, label: '状态', width: 120, content: 'status', showMode: 'tag' },
            ],
        };
    },
    computed: {},
    created() {
        this.listQuery.host = this.$route.query.host;
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            getWebsite(this.listQuery).then((data) => {
                this.list = data.rows;
                this.total = data.count;
                this.listLoading = false;
            });
        },
        handleFilter() {
            const publish_time = this.listQuery.publish_time ? moment(this.listQuery.publish_time).format('x') : null;
            const release_time = this.listQuery.release_time ? moment(this.listQuery.release_time).format('x') : null;
            this.listQuery = { ...this.listQuery, page: 1, publish_time, release_time };
            this.fetchData();
        },
        handleUpdate(row) {
            this.$router.push({ name: 'WebsiteEdit', query: { id: row.id } });
        },
        handleSure(row, status) {
            const that = this;
            this.$confirm(
                `${row.status === 0 ? '启用' : '暂停'}：<span class="el-alert--error is-dark">${row.host}</span> 域名，<span class="el-alert--warning is-dark">${
                    row.env
                }</span> 环境。`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                }
            )
                .then(() => {
                    that.handleModifyStatus(row, status);
                    this.fetchData();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                });
        },
        async handleModifyStatus(row, status) {
            // 更新发布状态，使用还是暂停
            try {
                await updateWebsiteStatus({ id: row.id, status });
                this.$message({
                    message: `发布状态已更新`,
                    type: 'success',
                });
                this.fetchData();
            } catch (error) {
                console.log(error);
                this.$message({ message: error.message, type: 'error' });
            }
        },
        async handleDelete(row) {
            this.$confirm(`删除以下内容？<span class="el-alert--error is-dark">${row.host}</span> 域名，<span class="el-alert--warning is-dark">${row.env}</span> 环境。`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    return deleteWebsiteStatus({ id: row.id });
                })
                .then((res) => {
                    this.$message({ type: 'success', message: '已删除' });
                    this.fetchData();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
                });
        },
        async handle2AllUser(row) {
            this.$confirm(`是否全量发布？<span class="el-alert--error is-dark">${row.host}</span> 域名，<span class="el-alert--warning is-dark">${row.env}</span> 环境。`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    return editWebsite({ id: row.id, type: 0 });
                })
                .then(async (res) => {
                    await updateWebsiteStatus({ id: row.id, status: 1 });
                    this.$message({ type: 'success', message: '已发布' });
                    this.fetchData();
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消',
                    });
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
    padding: 20px 0;
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
