<template>
    <div class="dashboard-container">
        <div v-userid="'admin'" class="btn_tools"><el-button type="primary" icon="el-icon-plus" size="small" @click="addGitHouse">创建新项目</el-button></div>
        <div class="dashboard-box">
            <div v-for="item in projects" :key="item.id" class="git_house">
                <div class="house_tools">
                    <div class="house_btns1">
                        <div class="house_title">{{ item.title }}</div>
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="addEditEnv(item.id, item.title)"></el-button>
                            <el-button type="primary" icon="el-icon-s-tools" size="small" @click="addGitHouse(item)"></el-button>
                            <el-button type="success" icon="el-icon-s-shop" size="small" @click="openJsonModel(item)"></el-button>
                        </el-button-group>
                    </div>
                    <div>
                        <el-button v-userid="'admin'" type="danger" icon="el-icon-delete" size="small" @click="deleteHouseById(item)"></el-button>
                    </div>
                </div>
                <div class="house_list">
                    <div v-for="env in item.envs" :key="env.id" class="house_item">
                        <div class="house_item_name">
                            <el-tag effect="dark" :type="env.env | getColor" size="small">{{ env.env | getEnv }}</el-tag>
                            <span class="house_env_host">{{ env.host }}</span>
                        </div>
                        <LastShow :id="env.id" :host="env.host" @editEnv="addEditEnv(item.id, item.title, env)" @onRefresh="getProjects" />
                    </div>
                </div>
            </div>
        </div>
        <AddHouse ref="addHouseRef" @onSubmit="getProjects" />
        <AddEnv ref="addEnvRef" @onSubmit="getProjects" />
        <JsonEditor ref="jsonEditorRef" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getHouses, deleteHouse } from '@/api/house';
import last_show from './last_show.vue';
import AddHouse from './addHouse.vue';
import AddEnv from './addEnv.vue';
import userid from '@/directive/permission/userid';
import JsonEditor from '@/components/JsonEditor';

export default {
    name: 'Dashboard',
    components: {
        LastShow: last_show,
        AddHouse,
        AddEnv,
        JsonEditor,
    },
    directives: { userid },
    filters: {
        getColor() {
            const color = ['primary', 'success', 'info', 'warning', 'danger'];
            return color[Math.floor(Math.random() * 5)];
        },
        getEnv(env) {
            if (env === 'production') return '生产';
            return env;
        },
    },
    data() {
        return {
            projects: [],
            listLoading: false,
        };
    },
    computed: {
        ...mapGetters(['name', 'uidentity']),
    },

    created() {
        this.getProjects();
    },
    methods: {
        async getProjects() {
            if (this.listLoading) return;
            this.listLoading = true;
            try {
                const response = await getHouses();
                this.projects = response;
                this.listLoading = false;
            } catch (error) {
                console.log(error);
                this.listLoading = false;
            }
        },
        addGitHouse(data) {
            this.$refs['addHouseRef'].show(data);
        },
        async deleteHouseById(row) {
            this.$confirm(`删除以下内容？<span class="el-alert--error is-dark">${row.title}</span>。`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true,
            })
                .then(() => {
                    return deleteHouse(row.id);
                })
                .then((res) => {
                    this.$message({ type: 'success', message: '已删除' });
                    this.getProjects();
                })
                .catch((error) => {
                    this.$message({
                        type: 'ierrornfo',
                        message: error.message,
                    });
                });
        },
        addEditEnv(pid, title, data) {
            this.$refs['addEnvRef'].show(pid, title, data);
        },
        openJsonModel(data) {
            this.$refs['jsonEditorRef'].show({ id: data.id, type: 0 }, '编辑[' + data.title + ']的基础数据');
        },
    },
};
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 20px 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
    &-box {
        display: flex;
        flex-wrap: wrap;
    }
}
.btn_tools {
    margin-bottom: 10px;
}
.git_house {
    border: solid 1px #ccc;
    margin-bottom: 20px;
    box-shadow: 0 3px 5px 0px rgba(0, 0, 0, 0.2);
    max-width: 1100px;
    margin-right: 10px;
    min-width: 1000px;
}
.house_tools {
    padding: 10px;
    border-bottom: solid 1px #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .house_btns1 {
        display: flex;
        align-items: center;
    }
    .house_title {
        margin-left: 10px;
        margin-right: 20px;
        font-weight: 700;
        line-height: 30px;
        padding: 0 5px;
        border-bottom: solid 1px #666;
    }
}
.house_list {
    .house_item {
        border-bottom: solid 1px #ccc;
        border-right: solid 1px #ccc;
        display: flex;
        align-items: center;
        &:hover {
            background-color: #f5f7fa;
        }
        .house_item_name {
            padding: 10px 5px;
            width: 330px;
            border-right: solid 1px #ccc;
        }
        .house_env_host {
            font-size: 13px;
            margin: 0 10px;
        }
    }
}
</style>
