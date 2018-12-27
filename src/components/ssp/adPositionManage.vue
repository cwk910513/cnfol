<style scoped lang='scss'>

</style>

<template>
    <div class="dsp_priority_content">
        <div class="search-line">
            <a-row :gutter="15">
                <a-col :span="6">
                    <a-form-item label="广告位类型："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择广告位" v-model='sltAdPositionType' style="width: 100%;">
                            <a-select-option v-for="item in adPositionTypeData" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="广告位尺寸："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择广告位尺寸" @change='changeAdPositionSize' allowClear style="width: 100%;">
                            <a-select-option v-for="(item, index) in adPositionSize" :key="index" :value="item">{{ item }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="名称查询："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-input v-model='searchValue' placeholder="请输入查询内容"/>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-col :span="6">
                        <a-form-item :wrapperCol="formItemLayout.wrapperCol">
                            <a-button class="add_btn" type="primary" @click="searchFun()"><a-icon type="search" /> 查询</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item :wrapperCol="formItemLayout.wrapperCol">
                            <a-button class="add_btn" type="primary" @click="editFun()"><a-icon type="plus" /> 新建</a-button>
                        </a-form-item>
                    </a-col>
                </a-col>
            </a-row>
        </div>
        <a-table 
            :columns="columns" 
            :dataSource="data"
            :pagination="pagination" 
            :loading="loading">
            <span slot="pmsContorl" slot-scope="text, record">
                <a-popconfirm
                    title="确定要切换状态吗？"
                    okText="确定"
                    cancelText="取消"
                    @confirm="() => changeAppStatus(record)">
                    <a-tag :color="record.pmsContorl == 0 ? 'red' : 'green'">{{ record.pmsContorl == 0 ? '关闭' : '开启' }}</a-tag>
                </a-popconfirm>
            </span>
            <span slot="h5type" slot-scope="text, record">
                <a-tag :color="record.h5type == 0 ? 'blue' : ''" @click="setH5TypeFun(0, record)"><a-icon type="check" v-if="record.h5type == 0" /> 不限制</a-tag>
                <a-tag :color="record.h5type == 1 ? 'blue' : ''" @click="setH5TypeFun(1, record)"><a-icon type="check" v-if="record.h5type == 1" /> 仅HTML5</a-tag>
                <a-tag :color="record.h5type == 2 ? 'blue' : ''" @click="setH5TypeFun(2, record)"><a-icon type="check" v-if="record.h5type == 2" /> 非HTML5</a-tag>
            </span>
            <span slot="appadtype" slot-scope="text, record">
                <a-tag :color="record.appadtype == 0 ? 'blue' : ''" @click="setAdTypeFun(0, record)"><a-icon type="check" v-if="record.appadtype == 0" /> 不限制</a-tag>
                <a-tag :color="record.appadtype == 1 ? 'blue' : ''" @click="setAdTypeFun(1, record)"><a-icon type="check" v-if="record.appadtype == 1" /> 仅应用广告</a-tag>
                <a-tag :color="record.appadtype == 2 ? 'blue' : ''" @click="setAdTypeFun(2, record)"><a-icon type="check" v-if="record.appadtype == 2" /> 非应用广告</a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="reviewFun(record)">
                    <a-icon type="eye-o" /> 查看
                </a>&nbsp;
                <a href="javascript:;" @click="editFun(record)">
                    <a-icon type="edit" /> 修改
                </a>&nbsp;
                <a href="javascript:;" @click="sdkModalFun(record)">
                    <a-icon type="tool" /> SDK设置
                </a>&nbsp;
                <a href="javascript:;" @click="setPhoneModelFun(record)">
                    <a-icon type="tablet" /> 投放机型
                </a>&nbsp;
                <a href="javascript:;" @click="setStrategyFun(record)">
                    <a-icon type="share-alt" /> 投放策略
                </a>
            </span>
        </a-table>
        <a-modal
            title='广告位查看'
            :visible='showAdPositionModal' 
            @ok='handleCancel' 
            okText='确定' 
            @cancel='handleCancel' 
            cancelText='取消'>
            <ad-position-show-modal v-bind:adPositionItem='sltAdPositionItem'></ad-position-show-modal>
        </a-modal>
        <ad-position-edit-modal ref='editModal' @reload='getData'></ad-position-edit-modal>
        <set-sdk-version-modal ref='sdkModal'></set-sdk-version-modal>
        <set-phone-model-modal ref='phoneModelModal'></set-phone-model-modal>
        <ad-position-strategy-modal ref='strategyModal' @reload='getData'></ad-position-strategy-modal>
    </div>
</template>

<script>
    import ActionUrl from '../../assets/js/action.url.js';
    import http from '../../assets/js/http.js';
    import config from '../../assets/js/config.js';
    // modal组件
    import adPositionShowModal from './modal/adPositionShowModal.vue';
    import adPositionEditModal from './modal/adPositionEditModal.vue';
    import setSdkVersionModal from './modal/setSdkVersionModal.vue';
    import setPhoneModelModal from './modal/setPhoneModelModal.vue';
    import adPositionStrategyModal from './modal/adPositionStrategyModal.vue';

    // 表格header设置
    const columns = [
        { title: '广告位ID', dataIndex: 'id' },
        { title: '媒体主', dataIndex: 'openUserName' },
        { title: '名称', dataIndex: 'adPositionName', sorter: false },
        { title: '应用ID', dataIndex: 'appId', sorter: false },
        { title: '所属应用', dataIndex: 'appName', sorter: false },
        { title: '广告位类型', dataIndex: 'adPositionTypeName', sorter: false },
        { title: '广告位尺寸', dataIndex: 'adPositionSize', sorter: false },
        { title: '状态', dataIndex: 'pmsContorl', sorter: false, scopedSlots: { customRender: 'pmsContorl' } },
        { title: 'HTML5广告策略', dataIndex: 'h5type', sorter: false, scopedSlots: { customRender: 'h5type' } },
        { title: '应用广告策略', dataIndex: 'appadtype', sorter: false, scopedSlots: { customRender: 'appadtype' } },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
    ];

    // 表单中每一行的布局
    const formItemLayout = {
        selectCol : { span: 7 },
        wrapperCol: { span: 16 }
    };

    export default {
        components: { 
            adPositionShowModal, 
            adPositionEditModal, 
            setSdkVersionModal, 
            setPhoneModelModal,
            adPositionStrategyModal 
        },
        data () {
            return {
                columns,
                formItemLayout,
                data: [],
                showAdPositionModal: false,
                editModal: false,
                loading: false,
                pagination: {},
                adPositionTypeData: [],
                adPositionSize: [],
                appOsData: [],
                sltAdPositionType: 0,
                sltAdPositionSize: '',
                searchValue: '',
                sltAdPositionItem: '',
                picFormatData: [],
                interactTypeData: [],
                editModalTitle: '',
            }
        },
        mounted() {
            this.getAdSize();
            this.getData();
            // 应用类型
            let defaultItem = { key: 0, value: '全部' };
            this.adPositionTypeData = [].concat.call(defaultItem, ...config.positionTypes);
        },
        methods: {
            // 获取数据
            getData(type, size, searchValue) {
                let params = {
                    'contorlSspBean.adPosition.adPositionName': searchValue || '',
                    'contorlSspBean.adPosition.adPositionTypeId': type || '',
                    'contorlSspBean.adPosition.adPositionSize': size || '',
                    'contorlSspBean.offset': 0,
                    'contorlSspBean.length': 999
                };
                this.loading = true;
                this.getPicFormat();
                this.getInteractTypes();
                http.post(ActionUrl.ssp.adPositionManage.get.url, params).then((response) => {
                    response.data.data.forEach((item) => {
                        item.adPositionTypeName = '';
                        let filterAdPositionTypeName = config.positionTypes.filter((filterItem) => {
                            if(filterItem.key == item.adPositionTypeId) {
                                return filterItem;
                            }
                        })
                        item.adPositionTypeName = filterAdPositionTypeName[0].value;
                        item.picFormatList = '';
                        // 设置图片格式
                        if(item.picFormat.split(',').length > 0 && this.picFormatData.length > 0) {
                            item.picFormat.split(',').forEach(picItem => {
                                this.picFormatData.forEach(picCodeItem => {
                                    if(picCodeItem.picCode == picItem) {
                                        item.picFormatList += picCodeItem.picFormat + ',';
                                    }
                                });
                            })
                            item.picFormatList = item.picFormatList.substr(0, item.picFormatList.length -1);
                        }
                        item.interactTypeList = '';
                        // 设置交互方式
                        if(item.interactive.split(',').length > 0 && this.interactTypeData.length > 0) {
                            item.interactive.split(',').forEach(interItem => {
                                this.interactTypeData.forEach(interCodeItem => {
                                    if(interCodeItem.interactCode == interItem) {
                                        item.interactTypeList += interCodeItem.interactType + ',';
                                    }
                                });
                            })
                            item.interactTypeList = item.interactTypeList.substr(0, item.interactTypeList.length -1);
                        }
                    })
                    this.data = response.data.data;
                    this.loading = false;
                }).catch((error) => {
                    this.$message.warning('获取数据失败，请重试！');
                    this.loading = false;
                });
            },
            // 获取广告位尺寸
            getAdSize() {
                http.post(ActionUrl.ssp.adPositionManage.getAdSize.url).then(response => {
                    this.adPositionSize = response.data.data;
                }).catch(error => {
                    this.$message.warning('获取广告位尺寸失败，请重试！');
                });
            },
            // 获取图片格式
            async getPicFormat() {
                const { data } = await http.post(ActionUrl.ssp.adPositionManage.getPicFormat.url);
                if(data.rCode === '0') {
                    this.picFormatData = data;
                } else {
                    this.$message.warning('获取图片格式失败，请重试！');
                }
            },
            // 获取交互方式
            async getInteractTypes() {
                const { data } = await http.post(ActionUrl.ssp.adPositionManage.getInteractType.url);
                if(data.rCode === '0') {
                    this.interactTypeData = data.data;
                } else {
                    this.$message.warning('获取交互方式失败，请重试！');
                }
            },
            // 获取广告位尺寸
            changeAdPositionSize(value) {
                this.sltAdPositionSize = value;
            },
            // 查询
            searchFun() {
                this.getData(this.sltAdPositionType, this.sltAdPositionSize, this.searchValue);
            },
            // 切换状态
            changeAppStatus(item) {
                let url = item.pmsContorl ? ActionUrl.ssp.adPositionManage.closeAdPosition.url : ActionUrl.ssp.adPositionManage.openAdPosition.url;
                http.post(url, { 'contorlSspBean.adPosition.id': item.id }).then(response => {
                    if(response.data.rCode == '0') {
                        this.$message.success('切换成功！');
                        item.pmsContorl = item.pmsContorl ? 0 : 1;
                    } else {
                        this.$message.warning('切换状态失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.warning('切换状态失败，请重试！');
                })
            },
            // 更新HTML5广告策略
            setH5TypeFun(value, item) {
                let params = {
                    'contorlSspBean.adPosition.id': item.id,
                    'contorlSspBean.adPosition.h5type': value
                };
                http.post(ActionUrl.ssp.adPositionManage.updateH5Type.url, params).then(response => {
                    if(response.data.rCode == '0') {
                        item.h5type = value;
                    } else {
                        this.$message.error('更新HTML5策略失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.error('更新HTML5策略失败，请重试！');
                });
            },
            // 更新应用广告策略
            setAdTypeFun(value, item) {
                let params = {
                    'contorlSspBean.adPosition.id': item.id,
                    'contorlSspBean.adPosition.appadtype': value
                };
                http.post(ActionUrl.ssp.adPositionManage.updateAdType.url, params).then(response => {
                    if(response.data.rCode == '0') {
                        item.appadtype = value;
                    } else {
                        this.$message.error('更新应用广告策略失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.error('更新应用广告策略失败，请重试！');
                });
            },
            // 查看
            reviewFun(item) {
                this.showAdPositionModal = true;
                this.sltAdPositionItem = item;
            },
            // 新建 || 修改
            editFun(item) {
                this.sltAdPositionItem = item;
                this.$refs.editModal.switchModal(item);
            },
            // 显示sdk modal
            sdkModalFun(item) {
                this.$refs.sdkModal.switchModal(item);
            },
            // 显示投放机型
            setPhoneModelFun(item) {
                this.$refs.phoneModelModal.switchModal(item);
            },
            // 显示strategy
            setStrategyFun(item) {
                this.$refs.strategyModal.switchModal(item);
            },
            // modal取消
            handleCancel() {
                this.showAdPositionModal = false;
            }
        }
    }
</script>
