<template>
    <el-dialog :visible.sync="dialogAddVisible" :title="title">
        <div v-if="baseJson !== null" class="json_top_box">基础数据：{{ baseJson }}</div>
        <div class="editor_box">
            <el-input v-model="jsonstr" type="textarea" :rows="23" class="textInput" placeholder="请输入内容" />
            <JsonEditor v-model="jsondata" class="jsonInput" mode="tree" :show-btns="false" @json-change="onJsonChange" />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddVisible = false"> 取消 </el-button>
            <el-button type="primary" @click="handleUpdate"> 确认 </el-button>
        </div>
    </el-dialog>
</template>
<script>
import JsonEditor from 'vue-json-editor';
import { getHouseJson, updateHouseJson } from '@/api/house';

export default {
    name: 'JsonEditorComponent',
    components: { JsonEditor },
    data() {
        return {
            dialogAddVisible: false,
            title: '编辑JSON',
            id: 0,
            type: '',
            jsondata: {},
            jsonstr: '',
            baseJson: null,
        };
    },
    watch: {
        jsonstr(next, old) {
            if (old === next) return;
            try {
                this.jsondata = JSON.parse(next);
            } catch (error) {
                console.log(error);
            }
        },
    },
    methods: {
        async show(data, title) {
            this.dialogAddVisible = true;
            this.title = title;
            try {
                const model = await getHouseJson(data.id, data.type);
                this.id = data.id;
                this.type = data.type;
                console.log(model);
                if (model.currJson) {
                    if (model.currJson.json_data) {
                        this.jsondata = model.currJson.json_data;
                        this.jsonstr = JSON.stringify(model.currJson.json_data);
                    }
                }
                if (model.baseJson) {
                    this.baseJson = model.baseJson.json_data;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async handleUpdate() {
            try {
                await updateHouseJson(this.id, this.type, this.jsondata);
                this.dialogAddVisible = false;
            } catch (error) {
                console.log(error);
            }
        },
        onJsonChange(data) {
            this.jsonstr = JSON.stringify(data);
        },
    },
};
</script>
<style>
.editor_box {
    display: flex;
    justify-content: space-between;
}
.textInput {
    width: 48%;
}
.jsonInput {
    width: 48%;
}
.jsoneditor-vue {
    height: 495px;
}
.json_top_box {
    margin-bottom: 10px;
}
</style>
