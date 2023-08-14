<template>
    <div class="show_box">
        <div class="show_box_content">
            <span v-if="current !== null">{{ getLastTime(current.publish_time) }}发布。当前版本:[{{ current.publish_time | dateFormat("MM-DD HH:mm:ss") }}]。</span>
            <span v-if="preweb !== null">上次版本:[{{ preweb.publish_time | dateFormat() }}]。</span>
        </div>
        <el-button-group>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="getlist"></el-button>
            <el-button type="success" icon="el-icon-s-grid" size="mini" @click="golook"></el-button>
            <el-button type="primary" icon="el-icon-s-tools" size="mini" @click="editEnv"></el-button>
            <el-button type="success" icon="el-icon-s-shop" size="mini" @click="openJsonModel"></el-button>
            <el-button v-userid="'admin'" type="danger" icon="el-icon-delete" size="mini" @click="deleteMyEnv"></el-button>
        </el-button-group>
        <JsonEditor ref="jsonEditorRef" />
    </div>
</template>
<script>
import { getWebsiteLast } from '@/api/websiteManage';
import { deleteEnv } from '@/api/house';
import userid from '@/directive/permission/userid';
import moment from 'moment';
import JsonEditor from '@/components/JsonEditor';

moment.locale('zh-cn');

export default {
    name: 'LastShow',
    directives: { userid },
    components: {
        JsonEditor,
    },
    props: {
        host: {
            type: String,
            default: '',
        },
        id: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            current: null,
            preweb: null,
        };
    },
    created() {
        if (this.host) this.getlist();
    },
    methods: {
        async getlist() {
            try {
                const data = await getWebsiteLast({ host: this.host });
                if (!data) return;
                if (data[0]) this.current = data[0];
                if (data[1]) this.preweb = data[1];
            } catch (error) {
                console.log(error);
            }
        },
        editEnv() {
            this.$emit('editEnv');
        },
        golook() {
            this.$router.push('/website/index?host=' + this.host);
        },
        deleteMyEnv() {
            this.$confirm(`删除以下内容？<span class="el-alert--error is-dark">${this.host}</span>。`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    return deleteEnv(this.id);
                })
                .then((res) => {
                    this.$message({ type: 'success', message: '已删除' });
                    this.$emit('onRefresh');
                })
                .catch((error) => {
                    this.$message({
                        type: 'ierrornfo',
                        message: error.message,
                    });
                });
        },
        getLastTime(time) {
            if (!time) return;
            return moment(time).fromNow();
        },
        openJsonModel() {
            this.$refs['jsonEditorRef'].show({ id: this.id, type: 1 }, '编辑[' + this.host + ']的环境数据');
        },
    },
};
</script>
<style lang="scss" scoped>
.show_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 10px;
}
</style>
