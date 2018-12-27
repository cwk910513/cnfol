<template>
    <a-modal
        title='投放机型设置'
        :visible='showModal'
        :loading="loading"
        @ok='handleOk' 
        okText='确定' 
        @cancel='handleCancel' 
        cancelText='取消'>
        <a-form>
            <a-form-item
                label='广告位ID：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
            >
                {{ sltItem.id }}
            </a-form-item>
            <a-form-item
                label='广告位名称：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
            >
                {{ sltItem.adPositionName }}
            </a-form-item>
            <a-form-item
                label='投放白名单：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
            >
                <a-select
                    showSearch
                    mode="multiple"
                    placeholder="请设置白名单"
                    style="width: 100%"
                    @search="handleSearch"
                    @change="selectWhiteListFun"
                    v-model='whiteData'
                    >
                    <a-select-option v-for="(item, index) in phoneModelData" :key='index' :value='item'>
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                label='投放黑名单：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
            >
                <a-select
                    showSearch
                    mode="multiple"
                    placeholder="请设置黑名单"
                    style="width: 100%"
                    @search="handleSearch"
                    @change="selectBlackListFun"
                    v-model='blackData'
                    >
                    <a-select-option v-for="(item, index) in phoneModelData" :key='index' :value='item'>
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>            
        </a-form>
    </a-modal>
</template>

<script>
    import ActionUrl from '../../../assets/js/action.url.js';
    import http from '../../../assets/js/http.js';

    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 5 },
        wrapperCol: { span: 18 }
    };

    export default {
        data () {
            return {
                formItemLayout,
                loading: false,
                showModal: false,
                sltItem: '',
                phoneModelData: [],
                whiteData: [],
                blackData: []
            }
        },
        methods: {
            // 获取modal中的数据
            getModelInfo(id) {
                http.post(ActionUrl.ssp.adPositionManage.queryModel.url, { 'contorlSspBean.adPosition.id': id })
                .then(response => {
                    if(response.data.rCode === '0') {
                        this.whiteData = response.data.data.whiteModels ? response.data.data.whiteModels.split(',') : [];
                        this.blackData = response.data.data.blackModels ? response.data.data.blackModels.split(',') : [];
                    } else {
                        this.$message.warning('获取投放机型数据失败，请重试！');
                    }
                })
                .catch(error => {
                    this.$message.warning('获取投放机型数据失败，请重试！');
                })
            },
            // 根据关键字查询结果
            getModelData(value) {
                http.post(ActionUrl.ssp.adPositionManage.getModelByKeyword.url + '?keyword=' + value).then(response => {
                    if(response.data.rCode === '0') {
                        this.phoneModelData = response.data.data;
                    } else {
                        this.$message.warning('手机型号查找失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.warning('手机型号查找失败，请重试！');
                });
            },
            // 切换显示modal
            switchModal(item) {
                this.showModal = !this.showModal;
                this.sltItem = item;
                this.getModelInfo(item.id);
            },
            // 调用列表
            getAdPositionData() {
                this.$emit('reload');
            },
            // 输入查询
            handleSearch(value) {
                this.getModelData(value);
            },
            // 白名单
            selectWhiteListFun(value) {
                this.whiteData = value;
            },
            // 黑名单
            selectBlackListFun(value) {
                this.blackData = value;
            },
            handleOk() {
                if(this.whiteData.length == 0 && this.blackData.length == 0) {
                    this.showModal = false;
                    return false;
                }
                let params = {
                    'contorlSspBean.adPosition.id': this.sltItem.id,
                    'contorlSspBean.whiteModels': this.whiteData.length > 0 ? this.whiteData.join(',') : '',
                    'contorlSspBean.blackModels': this.blackData.length > 0 ? this.blackData.join(',') : ''
                };
                http.post(ActionUrl.ssp.adPositionManage.updateModel.url, params).then(response => {
                    if(response.data.rCode) {
                        this.getAdPositionData();
                        this.showModal = false;
                    } else {
                        this.$message.warning('机型设置失败，请重试！');
                        this.showModal = false;
                    }
                }).catch(error => {
                    this.$message.warning('机型设置失败，请重试！');
                    this.showModal = false;
                });
            },
            handleCancel() {
                this.showModal = false;
            }
        }
    }
</script>
