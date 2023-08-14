<template>
    <!-- 项目列表 -->
    <div class="app-container">
        <el-row class="display headerBox">
            <el-col class="searchBox"> </el-col>
            <el-button v-waves v-permission="['Project:a']" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd()"> 添加 </el-button>
        </el-row>

        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column v-for="item in tableColumn" :key="item.id" :label="item.label" align="center">
                <template slot-scope="{ row, $index }">
                    <el-tag v-if="item.showMode === 'tag'" :type="row.status | statusFilter">{{ row[item.content] ? '启用' : '禁用' }}</el-tag>
                    <span v-else-if="item.showMode === 'index'">{{ $index }}</span>
                    <span v-else-if="item.showMode === 'text'">{{ row[item.content] }}</span>
                    <span v-else-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="400">
                <template slot-scope="{ row }">
                    <el-button v-permission="['Project:e']" type="primary" size="mini" @click="handleAdd(row)"> 编辑 </el-button>
                    <el-button v-if="row.status === 0" v-permission="['Project:t']" size="mini" @click="handleStatus(row, 1)"> 启用 </el-button>
                    <el-button v-if="row.status === 1" v-permission="['Project:t']" size="mini" type="danger" @click="handleStatus(row, 0)"> 禁用 </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :visible.sync="dialogAddVisible" :title="temp.id ? '编辑项目' : '添加项目'" width="500px">
            <el-form ref="dataForm" :model="temp" label-position="left" label-width="80px">
                <el-form-item label="项目名称" prop="title">
                    <el-input v-model="temp.title" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false"> 取消 </el-button>
                <el-button type="primary" @click="handleUpdate"> 确认 </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getProject, editProject, useProject } from '@/api/ruleApi';
import permission from '@/directive/permission/index.js'; // 权限判断指令
import waves from '@/directive/waves'; // waves directive

export default {
    name: 'Project',
    directives: { waves, permission },
    filters: {
        statusFilter(status) {
            const statusMap = {
                1: 'success',
                0: 'danger',
            };
            return statusMap[status];
        },
    },
    data() {
        return {
            list: null,
            listLoading: true,
            projectData: {}, // 被选中的项目数据
            tableColumn: [
                { id: 0, label: 'ID', width: '60', content: 'id', showMode: 'text' },
                { id: 1, label: '项目名称', width: '', content: 'title', showMode: 'text' },
                { id: 3, label: '修改时间', width: '', content: 'updatedAt', showMode: 'date' },
                { id: 6, label: '状态', width: '', content: 'status', showMode: 'tag' },
            ],
            dialogAddVisible: false,
            temp: {
                id: '',
                title: '',
            },
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            // 列表数据
            this.listLoading = true;
            try {
                const list = await getProject();
                this.list = list;
            } catch (error) {
                console.log(error);
            }
            this.listLoading = false;
        },
        handleFilter() {
            this.fetchData();
        },
        handleAdd(row) {
            // 添加和编辑按钮
            if (!!row && !!row.id) {
                this.temp = { title: row.title, id: row.id };
            } else {
                this.temp = { title: '' };
            }
            this.dialogAddVisible = true;
        },
        async handleUpdate() {
            // 添加和编辑确定
            try {
                await editProject(this.temp);
                this.dialogAddVisible = false;
                this.$message({
                    message: `${this.temp.id ? '修改成功' : '添加成功'}`,
                    type: 'success',
                });
                this.fetchData();
            } catch (error) {
                console.log(error);
                this.$message({
                    message: error.message,
                    type: 'error',
                });
            }
        },
        async handleStatus(row, status) {
            // 暂停和使用
            try {
                await useProject({ id: row.id, status });
                this.$message({
                    message: `${status ? '项目启用' : '项目禁用'}`,
                    type: 'success',
                });
                this.fetchData();
            } catch (error) {
                console.log(error);
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
