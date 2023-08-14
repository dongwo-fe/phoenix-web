<template>
    <div class="app-container">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column v-for="item in tableColumn" :key="item.id" :label="item.label" align="center" :width="item.width">
                <template slot-scope="{ row, $index }">
                    <el-tag v-if="item.showMode === 'tag'" :type="row.status | statusFilter">{{ row[item.content] ? '生效' : '失效' }}</el-tag>
                    <span v-else-if="item.showMode === 'index'">{{ $index }}</span>
                    <span v-else-if="item.showMode === 'text'">{{ row[item.content] }}</span>
                    <span v-else-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
                    <span v-else-if="item.showMode === 'project'">{{ row[item.content] | projectFormat }}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.pageindex" @pagination="fetchData" />
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { getLogs } from '@/api/logs';

export default {
    name: 'Logs',
    components: { Pagination },
    filters: {
        projectFormat(val) {
            if (val === 0) return 'git项目';
            if (val === 1) return '域名绑定';
            if (val === 2) return '分发网页';
            if (val === 3) return '用户管理';
            if (val === 4) return '项目配置';
            return val;
        },
    },
    data() {
        return {
            list: [],
            total: 0,
            listLoading: true,
            listQuery: { pageindex: 1 },
            tableColumn: [
                { id: 0, label: 'ID', width: '60', content: 'id', showMode: 'text' },
                { id: 1, label: '事项', width: 160, content: 'title', showMode: 'text' },
                { id: 2, label: '项目', width: 120, content: 'type', showMode: 'project' },
                { id: 3, label: '操作id', width: 120, content: 'myid', showMode: 'text' },
                { id: 4, label: '操作内容', width: '', content: 'content', showMode: 'text' },
                { id: 5, label: '操作人', width: 160, content: 'nickname', showMode: 'text' },
                { id: 6, label: '修改时间', width: 170, content: 'updatedAt', showMode: 'date' },
            ],
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            // 列表数据
            this.listLoading = true;
            getLogs(this.listQuery)
                .then((response) => {
                    this.list = response.rows;
                    this.total = response.count;
                    this.listLoading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.listLoading = false;
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
