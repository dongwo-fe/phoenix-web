<template>
    <el-dialog :visible.sync="dialogAddVisible" :title="form.id ? '编辑GIT项目' : '添加GIT项目'">
        <div class="app-container">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="项目名称">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="GIT地址">
                    <el-input v-model="form.git_url" type="textarea" />
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
import { createHouses } from '@/api/house';

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
                id: '',
                title: '',
                git_url: '',
            };
        },
        show(data) {
            this.form = this.createForm();
            if (data) {
                this.form.id = data.id;
                this.form.title = data.title;
                this.form.git_url = data.git_url;
            }
            this.dialogAddVisible = true;
        },
        async handleUpdate() {
            try {
                const data = await createHouses(this.form);
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
