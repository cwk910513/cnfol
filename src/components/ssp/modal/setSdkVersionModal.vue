<template>
    <a-modal
        title='SDK版本号设置'
        :visible='showModal'
        width='800px'
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
                label='广告版本号：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
            >
                <a-table
                    :columns="columns" 
                    :dataSource="sdkVersionData"
                    :pagination='false'
                    :loading='loading' bordered>
                    <span slot="dsp" slot-scope="text, record">
                        <a-select size="default" allowClear placeholder="请选择DSP" v-model='record.dsp'>
                            <a-select-option v-for="item in sdkVersionData" :key="item.id" :value="item.value">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </span>
                    <span slot="version" slot-scope="text, record">
                        <a-input placeholder='请输入配置SDK版本号' v-model='record.sdkVersion'/>
                    </span>
                </a-table>
                <div v-if='showErrorStatus' style='color: red;'>{{ showErrorText }}</div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import ActionUrl from '../../../assets/js/action.url.js';
    import http from '../../../assets/js/http.js';
    import utility from '../../../assets/js/utility.js';

    // 表格header设置
    const columns = [
        { title: 'DSP', key: 'dsp', scopedSlots: { customRender: 'dsp' }, width: '40%' },
        { title: '版本号', key: 'version', scopedSlots: { customRender: 'version' } }
    ];

    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 5 },
        wrapperCol: { span: 18 }
    };

    export default {
        data () {
            return {
                columns,
                formItemLayout,
                loading: false,
                showModal: false,
                sdkVersionData: [],
                sltItem: '',
                showErrorStatus: false,
                showErrorText: ''
            }
        },
        methods: {
            // 获取sdk版本数据
            getSDKVersionData(dspSdkVersions) {
                this.loading = true;
                http.post(ActionUrl.ssp.adPositionManage.getDspVersion.url).then(response => {
                    if(response.data.rCode === '0') {
                        let hasDspArray = [], notHasDspArray = [];
                        response.data.data.forEach(item => {
                            item.dsp = '';
                            item.sdkVersion = '';
                            if(dspSdkVersions.length > 0) {
                                dspSdkVersions.forEach(dspItem => {
                                    if(item.value == dspItem.dsp) {
                                        item.dsp = dspItem.dsp;
                                        item.sdkVersion = dspItem.sdkVersion;
                                    }
                                })
                            }
                            if(item.dsp) {
                                hasDspArray.push(item);
                            } else {
                                notHasDspArray.push(item);
                            }
                        })
                        this.sdkVersionData = [].concat.call(...hasDspArray, ...notHasDspArray);
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.$message.warning('获取SDK版本号数据失败，请重试！');
                    }
                }).catch(error => {
                    this.loading = false;
                    this.$message.warning('获取SDK版本号数据失败，请重试！');
                });
            },
            // 切换显示modal
            switchModal(item) {
                this.showModal = !this.showModal;
                this.sltItem = item;
                this.getSDKVersionData(item.dspSdkVersions);
            },
            handleOk() {
                let sdkVersions = [], dspArray = [];
                let errorCode = null;
                if(this.sdkVersionData.length > 0) {
                    this.sdkVersionData.forEach(item => {
                        if(item.dsp && !item.sdkVersion) {
                            errorCode = 1;
                        } else if(!item.dsp && item.sdkVersion) {
                            errorCode = 2;
                        } else if(item.dsp && item.sdkVersion) {
                            dspArray.push(item.dsp);
                            sdkVersions.push({ 'dsp': item.dsp, 'sdkVersion': item.sdkVersion });
                        }
                    })
                }
                this.sltItem.dspSdkVersions = sdkVersions;
                if(errorCode == 1) {
                    this.showErrorStatus = true;
                    this.showErrorText = '请输入版本号，版本号不能为空！';
                    return false;
                }
                if(errorCode == 2) {
                    this.showErrorStatus = true;
                    this.showErrorText = '请选择DSP，DSP选项不能为空！';
                    return false;
                }
                if(!(this.sltItem.dspSdkVersions.length > 0)) {
                    this.showErrorStatus = true;
                    this.showErrorText = '请选择DSP并添加版本号信息';
                    return false;
                }
                if(utility.isRepeat(dspArray)) {
                    this.showErrorStatus = true;
                    this.showErrorText = 'DSP选项不能重复，请重新选择！';
                    return false;
                }
                let params = {
                    'contorlSspBean.adPosition.id': this.sltItem.id,
                };
                this.sdkVersionData.forEach((item, index) => {
                    params['contorlSspBean.adPosition.dsps['+ index + ']' ] = item.dsp;
                    params['contorlSspBean.adPosition.sdkVersions['+ index + ']' ] = item.sdkVersion;
                })
                http.post(ActionUrl.ssp.adPositionManage.updateSDK.url, params).then(response => {
                    if(response.data.rCode == '0') {
                        this.$message.success('操作成功！');
                    } else {
                        this.$message.warning('设置SDK版本号失败，请重试！');
                    }
                }).catch(error => {
                    this.$message.warning('设置SDK版本号失败，请重试！');
                });
                this.showModal = false;
                this.showErrorStatus = false;
            },
            handleCancel() {
                this.showModal = false;
                this.showErrorStatus = false;
            }
        }
    }
</script>
