<template>
    <div class="dsp_priority_content">
        <div class="search-line">
            <a-row :gutter="15">
                <a-col :span="6">
                    <a-form-item label="标签类型："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择标签类型" allowClear @change='selectTagTypeFun' style="width: 100%;">
                            <a-select-option v-for="item in tagTypeData" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="模糊查询："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-input v-model='searchValue' placeholder="请输入查询内容"/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-col :span="3">
                        <a-form-item :wrapperCol="formItemLayout.wrapperCol">
                            <a-button class="add_btn" type="primary" @click='searchFun'><a-icon type="search" /> 查询</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :span="3">
                        <a-form-item :wrapperCol="formItemLayout.wrapperCol">
                            <a-button class="add_btn" type="primary" @click='editFun()'><a-icon type="plus" /> 新建</a-button>
                        </a-form-item>
                    </a-col>
                </a-col>
            </a-row>
        </div>
        <a-table 
            :columns="columns" 
            :dataSource="tagData"
            :pagination="pagination" 
            :loading="loading">
            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="editFun(record)">
                    <a-icon type="edit" /> 修改
                </a>
                <a-popconfirm
                    title="确定要删除此标签吗？"
                    okText="确定"
                    cancelText="取消"
                    @confirm="() => deleteTag(record)">
                    <a-icon type="delete" /> 删除
                </a-popconfirm>
            </span>
        </a-table>
        <a-modal 
            :title="sltTagItem ? '修改标签' : '新建标签'"
            :visible='editModal' 
            :confirmLoading='okBtnLoading' 
            @ok='handleOk' 
            okText='确定' 
            @cancel='handleCancel' 
            cancelText='取消'>
            <a-form :autoFormCreate="(form)=>{this.form = form}">
                <a-form-item
                    label='标签类型：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="type"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择标签类型', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-select size="default" placeholder="请选择标签类型">
                        <a-select-option v-for="item in tagTypeData" :key="item.key" :value="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    label='标签名称：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="name"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入标签名称', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-input placeholder="请输入标签名称"/>
                </a-form-item>
                <a-form-item
                    label='标签描述：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="description"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入标签描述', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-input type='textarea' placeholder="请输入标签描述"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import ActionUrl from '../../assets/js/action.url.js';
    import http from '../../assets/js/http.js';
    import config from '../../assets/js/config.js';

    // 表格header设置
    const columns = [
        {title: 'ID', dataIndex: 'id', sorter: false },
        {title: '标签名称', dataIndex: 'name', sorter: false },
        {title: '标签类型', dataIndex: 'tagTypeName', sorter: false },
        {title: '标签描述', dataIndex: 'description', sorter: false },
        {title: '处理时间', dataIndex: 'updateTime', sorter: false},
        {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }}
    ];

    // 表单中每一行的布局
    const formItemLayout = {
        selectCol : { span: 7 },
        labelCol  : { span: 5 },
        wrapperCol: { span: 16 }
    };

    export default {
        data () {
            return {
                columns,
                formItemLayout,
                tagData: [],
                pagination: {},
                loading: false,
                editModal: false,
                okBtnLoading: false,
                tagTypeData: [],
                sltTagType: '',
                searchValue: '',
                sltTagItem: ''
            }
        },
        mounted() {
            this.tagTypeData = config.tagType;
            this.getData();
        },
        methods: {
            // 获取数据
            getData(type, value) {
                let params = {
                    'contorlSspBean.searchKey': value || '',
                    'contorlSspBean.tag.type': type || '',
                    'contorlSspBean.offset': 0,
                    'contorlSspBean.length': 10
                };
                http.post(ActionUrl.ssp.tagManage.get.url, params).then(response => {
                    if(response.data.rCode === '0') {
                        response.data.data.forEach(item => {
                            item.tagTypeName = '';
                            let filterTagTypeName = config.tagType.filter((filterItem) => {
                                if(filterItem.key == item.type) {
                                    return filterItem;
                                }
                            })
                            item.tagTypeName = filterTagTypeName[0].value;
                        })
                        this.tagData = response.data.data;
                    } else {
                        this.$message.warning('获取标签数据失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.warning('获取标签数据失败，请重试！');
                });
            },
            // 选择tag
            selectTagTypeFun(value) {
                this.sltTagType = value;
            },
            // 查询
            searchFun() {
                this.getData(this.sltTagType, this.searchValue);
            },
            // 数据校验
            validateFun(rule, value, f) {
                if(!value) {
                    f();
                }
                f();
            },
            // 新建 || 修改
            editFun(item) {
                this.sltTagItem = item;
                this.editModal = true;
                setTimeout(() => {
                    this.form.setFieldsValue({
                        type: item ? item.type : '',
                        name: item ? item.name : '',
                        description: item ? item.description : ''
                    });
                }, 100);
            },
            // 删除
            deleteTag(item) {
                http.post(ActionUrl.ssp.tagManage.delete.url, { 'contorlSspBean.tag.id': item.id }).then(response => {
                    if(response.data.rCode === '0') {
                        this.$message.success('删除成功！');
                        this.getData();
                    } else {
                        this.$message.warning('删除失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.warning('删除失败，请重试！');
                })
            },
            handleOk() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.okBtnLoading = true;
                            let params = {
                                'contorlSspBean.tag.id': this.sltTagItem ? this.sltTagItem.id : '',
                                'contorlSspBean.tag.type': values.type,
                                'contorlSspBean.tag.name': values.name,
                                'contorlSspBean.tag.description': values.description
                            };
                            let url = this.sltTagItem ? ActionUrl.ssp.tagManage.update.url : ActionUrl.ssp.tagManage.add.url;
                            if(!this.sltTagItem) {
                                delete params['contorlSspBean.tag.id']
                            }
                            http.post(url, params).then((response) => {
                                if(response.data.rCode === '0') {
                                    this.okBtnLoading = false;
                                    this.editModal = false;
                                    this.getData();
                                } else {
                                this.$message.warning(error);
                                this.okBtnLoading = false;
                                }
                            }).catch((error) => {
                                this.$message.warning(error);
                                this.okBtnLoading = false;
                                this.editModal = false;
                            });
                        }
                    },
                )
            },
            // modal取消
            handleCancel() {
                this.editModal = false;
            }
        }
    }
</script>
