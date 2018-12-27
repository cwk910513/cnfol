<style scoped lang='scss'>
    .add_btn {
        margin-bottom: 15px;
    }
</style>

<template>
    <div class="dsp_priority_content">
        <a-button class="add_btn" type="primary" @click="editFun()"><a-icon type="plus" /> 新建</a-button>
        <a-table 
            :columns="columns" 
            :dataSource="dspPriorityData"
            :pagination="pagination" 
            :loading="loading">
            <span slot="isValid" slot-scope="isValid">
                {{ isValid ? '是' : '否' }}
            </span>
            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="editFun(record)">
                    <a-icon type="edit" /> 修改
                </a>
            </span>
        </a-table>
        <a-modal 
            :title="crtItem ? '【修改】DSP优先级设置' : '【新建】DSP优先级设置'"
            :visible='editModal' 
            :confirmLoading='okBtnLoading' 
            @ok='handleOk' 
            okText='确定' 
            @cancel='handleCancel' 
            cancelText='取消'>
            <a-form :autoFormCreate="(form)=>{this.form = form}">
                <a-form-item
                    label='广告位类型'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="spaceType"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择广告位类型', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-select size="default" placeholder="请选择广告位类型">
                        <a-select-option v-for="positionItem in positionTypeArray" :key="positionItem.key" :value="positionItem.key">
                            {{ positionItem.value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    label='DSP优先级'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="dspPriority"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入DSP优先级', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-input placeholder="请输入DSP优先级（以英文;做间隔，不留空格）" v-model="dspPriority"/>
                </a-form-item>
                <a-form-item
                    label='备注'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="remark"
                    :fieldDecoratorOptions="{rules: [{ required: false, message: '请输入备注', whitespace: true }]}"
                >
                    <a-input type='textarea' placeholder="请输入备注"/>
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
        {title: 'No', dataIndex: 'id', sorter: true, scopedSlots: { customRender: 'no' }},
        {title: '广告位类型', dataIndex: 'spaceTypeName', sorter: true},
        {title: 'DSP优先级', dataIndex: 'dspPriority', sorter: true},
        {title: '是否生效', dataIndex: 'isValid', sorter: true, scopedSlots: { customRender: 'isValid' }},
        {title: '备注', dataIndex: 'remark', sorter: false},
        {title: '操作', key: 'action', scopedSlots: { customRender: 'action' }}
    ];

    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 5 },
        wrapperCol: { span: 16 }
    };

    export default {
        data () {
            return {
                columns,
                formItemLayout,
                dspPriorityData: [],
                pagination: {},
                loading: false,
                editModal: false,
                okBtnLoading: false,
                positionTypeArray: [],  // 广告位类型数据
                crtItem: '',     // 当前选中的item
                spaceType: '',   // 广告位类型
                dspPriority: '', // DSP优先级
                remark: ''       // 备注
            }
        },
        mounted() {
            this.getData();
            this.positionTypeArray = config.positionTypes;
        },
        methods: {
            // 获取DSP优先级数据
            getData() {
                let params = {
                    'auditSspBean.p.offset': 0,
                    'auditSspBean.p.length': 10
                };
                this.loading = true;
                http.post(ActionUrl.ssp.dspPriority.get.url, params).then((response) => {
                    response.data.data.forEach((item) => {
                        item.spaceTypeName = '';
                        let filterName = this.positionTypeArray.filter((filterItem) => {
                            if(filterItem.key == item.spaceType) {
                                return filterItem;
                            }
                        })
                        item.spaceTypeName = filterName[0].value;
                    });
                    this.dspPriorityData = response.data.data;
                    this.loading = false;
                }).catch((error) => {
                    this.$message.warning('获取数据失败，请重试！');
                    this.loading = false;
                });
            },
            // 新建 || 修改
            editFun(item) {
                this.editModal = true;
                this.crtItem = item || null;
                if(item) {
                    setTimeout(() => {
                        this.form.setFieldsValue({
                            spaceType: item.spaceType,
                            dspPriority: item.dspPriority,
                            remark: item.remark
                        });
                    }, 100);
                }
            },
            // 数据校验
            validateFun(rule, value, f) {
                if(!value) {
                    f();
                }
                f();
            },
            // modal确定
            handleOk() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.okBtnLoading = true;
                            let params = {
                                'auditSspBean.limitDspPriority.id': this.crtItem ? this.crtItem.id : '',
                                'auditSspBean.limitDspPriority.spaceType': values.spaceType,
                                'auditSspBean.limitDspPriority.dspPriority': values.dspPriority.replace(/；/, ';').replace(/\s+/g,""),
                                'auditSspBean.limitDspPriority.remark': values.remark,
                                'auditSspBean.limitDspPriority.isValid': 1
                            };
                            http.post(ActionUrl.ssp.dspPriority.edit.url, params).then((response) => {
                                if(response.status === -404) {
                                    this.$message.warning(response.msg);
                                    this.okBtnLoading = false;
                                    return false;
                                }
                                this.getData();
                                this.okBtnLoading = false;
                                this.editModal = false;
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
