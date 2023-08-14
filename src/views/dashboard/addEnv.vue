<template>
    <el-dialog :visible.sync="dialogAddVisible" :title="form.id ? '编辑GIT项目' : '添加GIT项目'">
        <div class="app-container">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="项目名称">
                    <el-input v-model="form.title" :disabled="true" />
                </el-form-item>
                <el-form-item label="自定义域名">
                    <el-input v-model="form.host" />
                </el-form-item>
                <el-form-item label="环境">
                    <el-select v-model="form.env" placeholder="请选择环境">
                        <el-option label="dev" value="dev" />
                        <el-option label="dev2" value="dev2" />
                        <el-option label="dev3" value="dev3" />
                        <el-option label="dev4" value="dev4" />
                        <el-option label="sit" value="sit" />
                        <el-option label="uat" value="uat" />
                        <el-option label="gray" value="gray" />
                        <el-option label="生产" value="production" />
                    </el-select>
                </el-form-item>
                <el-form-item label="编译目录">
                    <el-input v-model="form.path_name" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择环境">
                        <el-option label="暂停" :value="0" />
                        <el-option label="启用" :value="1" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false"> 取消 </el-button>
                <el-button type="primary" @click="handleUpdate"> 确认 </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { createEnv } from '@/api/house';

export default {
    name: 'AddHouse',
    data() {
        return {
            dialogAddVisible: false,
            form: this.createForm(),
        };
    },
    methods: {
        createForm() {
            return {
                pid: 0,
                title: '',
                id: '',
                host: '',
                env: '',
                path_name: '',
                status: 1,
            };
        },
        show(pid, title, data) {
            this.form = this.createForm();
            this.form.pid = pid;
            this.form.title = title;
            if (data) {
                this.form.id = data.id;
                this.form.host = data.host;
                this.form.env = data.env;
                this.form.path_name = data.path_name;
                this.form.status = data.status;
            }
            this.dialogAddVisible = true;
        },
        async handleUpdate() {
            try {
                const data = await createEnv(this.form);
                console.log(data);
                this.$emit('onSubmit');
                this.dialogAddVisible = false;
            } catch (error) {
                console.log(error);
                this.$message({
                    type: 'error',
                    message: error.message,
                });
            }
        },
    },
};
</script>

<style scoped>
.line {
    text-align: center;
}
.dialog-footer {
    text-align: center;
}
</style>
