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
                    <a-form-item label="应用类型："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择应用类型" v-model='sltAppType' style="width: 100%;">
                            <a-select-option v-for="item in appTypeData" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item label="系统平台："
                                 :labelCol="formItemLayout.selectCol"
                                 :wrapperCol="formItemLayout.wrapperCol">
                        <a-select placeholder="请选择系统平台" v-model='sltAppOs' style="width: 100%;">
                            <a-select-option v-for="item in appOsData" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
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
            <span slot="pmsContorl" slot-scope="text, record">
                <a-popconfirm
                    title="确定要切换状态吗？"
                    okText="确定"
                    cancelText="取消"
                    @confirm="() => changeAppStatus(record)">
                    <a-tag :color="record.pmsContorl == 0 ? 'red' : 'green'">{{ record.pmsContorl == 0 ? '关闭' : '开启' }}</a-tag>
                </a-popconfirm>
            </span>
            <span slot="action" slot-scope="text, record">
                <a href="javascript:;" @click="reviewFun(record)">
                    <a-icon type="eye-o" /> 查看
                </a>
            </span>
        </a-table>
        <a-modal
            title='应用查看'
            :visible='editModal' 
            @ok='handleCancel' 
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
                    {{ sltAppItem.appVersion || '-'  }}
                </a-form-item>
                <a-form-item
                    label='应用包名称：'
                    v-if='sltAppItem.productType == 1'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    {{ sltAppItem.appPackageName || '-'  }}
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
                    label='应用网址：'
                    v-if='sltAppItem.productType == 2'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                >
                    <a :href="sltAppItem.domain || 'javascript:;'" target="_blank">{{ sltAppItem.domain || '-' }}</a>
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
        { title: '应用ID', dataIndex: 'id' },
        { title: '媒体主', dataIndex: 'openUserName' },
        { title: '类型', dataIndex: 'productTypeName', sorter: false },
        { title: '名称', dataIndex: 'appName', sorter: false },
        { title: '包名 | 版本号 | 域名', dataIndex: 'appInfo', sorter: false },
        { title: '状态', dataIndex: 'pmsContorl', sorter: false, scopedSlots: { customRender: 'pmsContorl' } },
        { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
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
                data: [],
                editModal: false,
                loading: false,
                pagination: {},
                appTypeData: [],
                appOsData: [],
                sltAppType: 0,
                sltAppOs: 0,
                searchValue: '',
                sltAppItem: ''
            }
        },
        mounted() {
            this.getData();
            let defaultItem = { key: 0, value: '全部' };
            // 应用类型
            this.appTypeData = [].concat.call(defaultItem, ...config.appType);
            // 系统平台
            this.appOsData = [].concat.call(defaultItem, ...config.appOs);
        },
        methods: {
            // 获取数据
            getData(type, os, searchValue) {
                let params = {
                    'contorlSspBean.application.appName': searchValue || '',
                    'contorlSspBean.application.productType': type || '',
                    'contorlSspBean.application.appOs': os || '',
                    'contorlSspBean.offset': 0,
                    'contorlSspBean.length': 10
                };
                this.loading = true;
                http.post(ActionUrl.ssp.appManage.get.url, params).then((response) => {
                    response.data.data.forEach((item) => {
                        item.productTypeName = '';
                        let filterProductTypeName = config.appType.filter((filterItem) => {
                            if(filterItem.key == item.productType) {
                                return filterItem;
                            }
                        })
                        item.productTypeName = filterProductTypeName[0].value;
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
            // 查询
            searchFun() {
                this.getData(this.sltAppType, this.sltAppOs, this.searchValue);
            },
            // 切换状态
            changeAppStatus(item) {
                let url = item.pmsContorl ? ActionUrl.ssp.appManage.closeApp.url : ActionUrl.ssp.appManage.openApp.url;
                http.post(url, { 'contorlSspBean.application.id': item.id }).then(response => {
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
            // 查看
            reviewFun(item) {
                this.editModal = true;
                let filterProductTypeName = config.appType.filter((filterItem) => {
                    if(filterItem.key == item.productType) {
                        return filterItem;
                    }
                })
                let filterAppOsName = config.appOs.filter((filterItem) => {
                    if(filterItem.key == item.appOs) {
                        return filterItem;
                    }
                })
                item.productTypeName = filterProductTypeName[0].value;
                item.appOsName = filterAppOsName[0].value;
                this.sltAppItem = item;
            },
            // modal取消
            handleCancel() {
                this.editModal = false;
            }
        }
    }
</script>
