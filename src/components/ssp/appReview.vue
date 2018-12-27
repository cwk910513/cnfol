<style scoped lang='scss'>
    .ant-form-item {
        margin-bottom: 10px;
    }
</style>

<template>
    <div class="dsp_priority_content">
        <div class="search-line">
            <a-row :gutter="15">
                <a-col :span="6">
                    <a-form-item label="状态："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择审核状态" v-model="sltStatus" @change="switchStatus" style="width: 100%;">
                            <a-select-option v-for="item in appReviewData" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="查询："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-input v-model="searchValue" placeholder="请输入查询内容"/>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item :wrapperCol="formItemLayout.wrapperCol">
                        <a-button class="add_btn" type="primary" @click="searchFun()"><a-icon type="search" /> 查询</a-button>
                    </a-form-item>
                </a-col>
            </a-row>
        </div>
        <a-table 
            :columns="columns" 
            :dataSource="data"
            :pagination="pagination" 
            :loading="loading">
            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="reviewFun(record, true)" v-if="record.reviewStatus == 1">
                    <a-icon type="tags-o" /> 评审
                </a>
                <a href="javascript:;" @click="reviewFun(record, false)" v-if="record.reviewStatus != 1">
                    <a-icon type="eye-o" /> 查看
                </a>
            </span>
        </a-table>
        <a-modal
            style="top: 20px"
            :title='modalTitle'
            :visible='editModal' 
            :confirmLoading='okBtnLoading' 
            width='800px'
            @ok='handleOk' 
            okText='确定' 
            @cancel='handleCancel' 
            cancelText='取消'>
            <a-form :autoFormCreate="(form)=>{this.form = form}">
                <a-form-item
                    label='应用ID：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.id || '-'  }}
                </a-form-item>
                <a-form-item
                    label='媒体主：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.openUserName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='媒体账号：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.openUserAccount || '-'  }}
                </a-form-item>
                <a-form-item
                    label='应用名称：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.appName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='应用类型：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.productTypeName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='系统平台：'
                    v-if='sltAppItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.appOsName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='应用版本：'
                    v-if='sltAppItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.appVersion || '-' }}
                </a-form-item>
                <a-form-item
                    label='应用包名称：'
                    v-if='sltAppItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.appPackageName || '-'   }}
                </a-form-item>
                <a-form-item
                    label='应用网址：'
                    v-if='sltAppItem.productType == 2'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    <a :href="sltAppItem.domain || 'javascript:;'" target="_blank">{{ sltAppItem.domain || '-' }}</a>
                </a-form-item>
                <a-form-item
                    label='应用下载地址：'
                    v-if='sltAppItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    <a :href="sltAppItem.fullAppPath || 'javascript:;'" target="_blank">{{ sltAppItem.fullAppPath || '-' }}</a>
                </a-form-item>
                <a-form-item
                    label='处理记录：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    <a-table 
                        :columns="recordColumns" 
                        :dataSource="recordData"
                        :pagination='false'
                        size='small'>
                    </a-table>
                </a-form-item>
                <a-form-item
                    label='评审结果：'
                    v-if="sltAppItem.bussinessWorkflow"
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="actionId"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择评审结果', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-select size="default" placeholder="请选择评审结果" @change="changeSelectFun">
                        <a-select-option v-for="item in reviewResultList" :key="item.id" :value="item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    label='驳回理由：'
                    v-if='showRecordReason'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="reason"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入驳回理由 ', whitespace: true }, {validator: validateFun}]}"
                >
                    <a-input type='textarea' placeholder="请输入驳回理由"/>
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
        { title: 'ID', dataIndex: 'id' },
        { title: '媒体主', dataIndex: 'openUserName' },
        { title: '媒体账号', dataIndex: 'openUserAccount', sorter: false },
        { title: '类型', dataIndex: 'productTypeName', sorter: false },
        { title: '名称', dataIndex: 'appName', sorter: false },
        { title: '包名 | 版本号 | 域名', dataIndex: 'appInfo', sorter: false },
        { title: '审核状态', dataIndex: 'reviewStatusName', sorter: false },
        { title: '处理时间', dataIndex: 'createTime', sorter: false },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
    ];

    // modal中的header设置
    const recordColumns = [
        { title: '时间', dataIndex: 'createTime'},
        { title: '开始状态', dataIndex: 'lastStateName'},
        { title: '结束状态', dataIndex: 'curStateName'},
        { title: '处理人', dataIndex: 'actorAccount'},
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
                recordColumns,
                formItemLayout,
                data: [],
                recordData: [],
                pagination: {},
                loading: false,
                editModal: false,
                okBtnLoading: false,
                modalTitle: '评审应用',
                sltAppItem: '',
                reviewResultList: [],  // 评审结果
                showRecordReason: false,
                appReviewData: [],
                sltStatus: null,
                searchValue: ''
            }
        },
        beforeMount() {
            this.sltStatus = config.appReviewStatus[0].key;
        },
        mounted() {
            this.getData(this.sltStatus);
            this.appReviewData = config.appReview;
        },
        methods: {
            // 获取数据
            getData(reviewStatus, searchValue) {
                let params = {
                    'auditSspBean.searchKey': searchValue || '',
                    'auditSspBean.p.offset': 0,
                    'auditSspBean.p.length': 10
                };
                let url = reviewStatus === 1 ? ActionUrl.ssp.appReview.get.url : ActionUrl.ssp.appReview.getByAdopt.url;
                this.loading = true;
                http.post(url, params).then((response) => {
                    response.data.data.forEach((item) => {
                        item.productTypeName = '';
                        item.reviewStatusName = '';
                        let filterProductTypeName = config.appType.filter((filterItem) => {
                            if(filterItem.key == item.productType) {
                                return filterItem;
                            }
                        })
                        item.productTypeName = filterProductTypeName[0].value;
                        let filterReviewName = config.appReviewStatus.filter((filterItem) => {
                            if(filterItem.key == item.reviewStatus) {
                                return filterItem;
                            }
                        })
                        item.reviewStatusName = filterReviewName[0].value;
                        if(item.productType == 1) {
                            item.appInfo = item.appPackageName;
                            if(item.appVersion) {
                                item.appInfo += '，'+ item.appVersion;
                            }
                        } else {
                            item.appInfo = item.domain;
                        }
                    })
                    this.data = response.data.data;
                    this.loading = false;
                }).catch((error) => {
                    this.$message.warning('获取数据失败，请重试！');
                    this.loading = false;
                });
            },
            // 切换状态
            switchStatus(value) {
                this.sltStatus = value;
            },
            // 查询
            searchFun() {
                this.getData(this.sltStatus, this.searchValue);
            },
            // 评审 || 查看 status为true：评审
            reviewFun(item, status) {
                this.loading = true;
                this.reviewResultList = [];
                this.modalTitle = status ? '评审应用' : '查看应用';
                let params = {
                    'auditSspBean.application.id': item.id,
                    'auditSspBean.userId': ''
                };
                http.post(ActionUrl.ssp.appReview.getById.url, params).then((response) => {
                    this.loading = false;
                    this.editModal = true;
                    let filterProductTypeName = config.appType.filter((filterItem) => {
                        if(filterItem.key == response.data.data.productType) {
                            return filterItem;
                        }
                    })
                    let filterAppOsName = config.appOs.filter((filterItem) => {
                        if(filterItem.key == response.data.data.appOs) {
                            return filterItem;
                        }
                    })
                    response.data.data.productTypeName = filterProductTypeName[0].value;
                    response.data.data.appOsName = filterAppOsName[0].value;
                    this.sltAppItem = response.data.data;

                    if(response.data.data.bussinessWorkflowLog.length > 0) {
                        response.data.data.bussinessWorkflowLog.forEach(item => {
                            item.lastStateName = item.lastStateModel ? item.lastStateModel.name : '初始状态';
                            item.curStateName = item.curStateModel ? item.curStateModel.name : '';
                            if(item.reason) {
                                item.curStateName += '：' + item.reason;
                            }
                        })
                        this.recordData = response.data.data.bussinessWorkflowLog;
                    }

                    // 评审结果
                    if(response.data.data.bussinessWorkflow) {
                        this.reviewResultList = response.data.data.bussinessWorkflow.curStateModel.actionModelList;
                    }
                }).catch((error) => {
                    this.loading = false;
                    this.$message.warning(error);
                });
            },
            // 数据校验
            validateFun(rule, value, f) {
                if(!value) {
                    f();
                }
                f();
            },
            // 切换评审结果
            changeSelectFun(item) {
                this.showRecordReason = item == 100 ? true : false;
            },
            // modal确定
            handleOk() {
                if(!this.sltAppItem.bussinessWorkflow) {
                    this.editModal = false;
                    return false;
                }
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.okBtnLoading = true;
                            let params = {
                                'auditSspBean.application.id': this.sltAppItem ? this.sltAppItem.id : '',
                                'auditSspBean.actionId': values.actionId,
                                'auditSspBean.reason': values.reason
                            };
                            http.post(ActionUrl.ssp.appReview.edit.url, params).then((response) => {
                                if(response.status === -404) {
                                    this.$message.warning(response.msg);
                                    this.okBtnLoading = false;
                                    return false;
                                }
                                this.getData(this.sltStatus);
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
