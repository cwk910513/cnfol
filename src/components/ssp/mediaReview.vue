<style scoped lang='scss'>
    .ant-form-item {
        margin-bottom: 10px;
    }
</style>

<template>
    <div class="media-review-content">
        <div class="search-line">
            <a-row :gutter="15">
                <a-col :span="6">
                    <a-form-item label="状态："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择审核状态" v-model="sltStatus" @change="switchStatus" style="width: 100%;">
                            <a-select-option v-for="item in mediaReviewData" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
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
                    label='媒体ID：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.id || '-'  }}
                </a-form-item>
                <a-form-item
                    label='开发者类型：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.openUserName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='运营者姓名：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.openUserAccount || '-'  }}
                </a-form-item>
                <a-form-item
                    label='运营者身份账号：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.appName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='联系地址：'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.productTypeName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='联系电话：'
                    v-if='sltMediaItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.appOsName || '-'  }}
                </a-form-item>
                <a-form-item
                    label='联系邮箱：'
                    v-if='sltMediaItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.appVersion || '-' }}
                </a-form-item>
                <a-form-item
                    label='其他联系方式：'
                    v-if='sltMediaItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltMediaItem.appPackageName || '-'   }}
                </a-form-item>
                <a-form-item
                    label='身份证明：'
                    v-if='sltMediaItem.productType == 2'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    <a :href="sltMediaItem.domain || 'javascript:;'" target="_blank">{{ sltMediaItem.domain || '-' }}</a>
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
                    v-if="sltMediaItem.bussinessWorkflow"
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
        { title: '用户账号', dataIndex: 'email' },
        { title: '用户姓名', dataIndex: 'developerName', sorter: false },
        { title: '平台名称', dataIndex: 'plat', sorter: false },
        { title: '开发者类型', dataIndex: 'developerTypeName', sorter: false },
        { title: '审核状态', dataIndex: 'stateName', sorter: false },
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
                modalTitle: '媒体主审核',
                sltMediaItem: '',
                reviewResultList: [],  // 评审结果
                showRecordReason: false,
                mediaReviewData: [],
                sltStatus: null,
                searchValue: ''
            }
        },
        beforeMount() {
            this.sltStatus = config.appReviewStatus[0].key;
        },
        mounted() {
            this.getData(this.sltStatus);
            this.mediaReviewData = config.appReview;
        },
        methods: {
            // 获取数据
            getData(reviewStatus, searchValue) {
                let params = {
                    'auditSspBean.searchKey': searchValue || '',
                    'auditSspBean.p.offset': 0,
                    'auditSspBean.p.length': 10
                };
                let url = reviewStatus === 1 ? ActionUrl.ssp.mediaReview.getUnActed.url : ActionUrl.ssp.mediaReview.getActed.url;
                this.loading = true;
                http.post(url, params).then((response) => {
                    response.data.data.forEach(item => {
                        config.developerType.forEach(dItem => {
                            if (item.developerType === dItem.key) {
                                item.developerTypeName = dItem.value;
                            }
                        })
                        config.appReviewStatus.forEach(sItem => {
                            if (item.state === sItem.key) {
                                item.stateName = sItem.value;
                            }
                        })
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
                this.modalTitle = status ? '媒体主审核' : '媒体主查看';
                let params = {
                    'auditSspBean.openUser.id': item.id,
                    'auditSspBean.userId': ''
                };
                http.post(ActionUrl.ssp.mediaReview.getById.url, params).then((response) => {
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
                    this.sltMediaItem = response.data.data;

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
                if(!this.sltMediaItem.bussinessWorkflow) {
                    this.editModal = false;
                    return false;
                }
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.okBtnLoading = true;
                            let params = {
                                'auditSspBean.application.id': this.sltMediaItem ? this.sltMediaItem.id : '',
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
