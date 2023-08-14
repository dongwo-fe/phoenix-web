<template>
    <div class="app-container editBox">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="绑定域名">
                <el-input disabled class="textInput" v-text="form.host" />
            </el-form-item>
            <el-form-item label="编译日期">
                <el-input disabled class="textInput" v-text="form.releaseTime" />
            </el-form-item>
            <el-form-item label="发布类型">
                <el-select v-model="form.type" placeholder="类型" class="filter-item" style="width: 130px">
                    <el-option v-for="item in websiteType" :key="item.key" :label="item.label" :value="item.key" />
                </el-select>
            </el-form-item>
            <el-form-item v-show="form.type === 1" label="">
                <el-slider v-model="form.proportion" />
            </el-form-item>
            <el-form-item v-show="form.type === 2" label="IP地址">
                <el-input v-model="form.ips" type="textarea" placeholder="请输入IP地址，多个IP用‘,’分隔" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { editWebsite, getWebsiteInfo } from '@/api/websiteManage';
import moment from 'moment';

const websiteType = [
    { key: 0, label: '全量' },
    { key: 1, label: '灰度' },
    { key: 2, label: '白名单' },
    // { key: 3, label: '体验版' },
];

export default {
    name: 'WebsiteEdit',
    data() {
        return {
            form: {
                id: 0,
                type: null,
                proportion: 0,
                ips: '',
                host: '',
            },
            websiteType,
        };
    },
    created() {
        this.getInfo();
    },
    methods: {
        async getInfo() {
            try {
                const data = await getWebsiteInfo(this.$route.query.id);
                console.log(data);
                this.form = {
                    ...this.form,
                    id: this.$route.query.id,
                    type: data.type,
                    proportion: data.proportion,
                    ips: data.ip,
                    host: data.host,
                    releaseTime: moment(data.release_time).format('YYYY-MM-DD HH:mm:ss'),
                };
            } catch (error) {
                console.log(error);
            }
        },
        async onSubmit() {
            try {
                await editWebsite({ ...this.form });
                if (window.history.length <= 1) {
                    this.$router.go('/website/index');
                } else {
                    // 返回上级路由
                    this.$message({
                        message: `修改成功`,
                        type: 'success',
                    });
                    this.$router.go(-1);
                }
            } catch (error) {
                console.log(error);
                this.$message({ message: error.message, type: 'error' });
            }
        },
        onCancel() {
            this.$router.push(`/website/index`);
            // this.$message({
            //   message: 'cancel!',
            //   type: 'warning'
            // });
        },
    },
};
</script>

<style scoped>
.line {
    text-align: center;
}
.editBox {
    max-width: 700px;
}
.textInput {
    font-size: 16px;
}
</style>

