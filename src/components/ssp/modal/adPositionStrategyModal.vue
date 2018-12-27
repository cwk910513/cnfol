<template>
    <a-modal
        title='投放策略设置'
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
                label='生效时间：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                :required='true'
            >
                <a-range-picker v-model="defaultValue" @change="dataChangeFun"/>
                <div v-if='hasSltDate' style="color: red;">请选择开始，结束时间</div>
            </a-form-item>
            <a-form-item
                label='策略设置：'
                :labelCol="formItemLayout.labelCol"
                :wrapperCol="formItemLayout.wrapperCol"
                :required='true'
            >
                <a-row>
                    <a-col :span='1'></a-col>
                    <a-col :span='2'><b>策略</b></a-col>
                    <a-col :span='12'>
                        <b>
                            比例值<span style='color: red;'>（总和为100）</span>
                        </b>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span='1'></a-col>
                    <a-col :span='2'>竞价：</a-col>
                    <a-col :span='12'>
                        <a-input-number v-model='priorityNum' placeholder='请输入比例值' style='width: 100%;' />
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span='1'></a-col>
                    <a-col :span='2'>权重：</a-col>
                    <a-col :span='12'>
                        <a-input-number v-model='weightNum' placeholder='请输入比例值' style='width: 100%;' />
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span='1'></a-col>
                    <a-col :span='2'>随机：</a-col>
                    <a-col :span='12'>
                        <a-input-number v-model='randAvgNum' placeholder='请输入比例值' style='width: 100%;' />
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span='1'></a-col>
                    <a-col :span='2'>轮播：</a-col>
                    <a-col :span='12'>
                        <a-input-number v-model='defaultNum' placeholder='请输入比例值' style='width: 100%;' />
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span='1'></a-col>
                    <a-col :span='12'>
                        <div v-if='hasSetStrategy' style="color: red;">比例值总和必需为100，请重新输入！</div>
                    </a-col>
                </a-row>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import moment from 'moment';
    import ActionUrl from '../../../assets/js/action.url.js';
    import http from '../../../assets/js/http.js';
    import utility from '../../../assets/js/utility.js';

    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 5 },
        wrapperCol: { span: 18 }
    };

    export default {
        data () {
            return {
                formItemLayout,
                dateFormat: 'YYYY-MM-DD',
                loading: false,
                showModal: false,
                sltItem: '',
                hasSltDate: false,
                sltDate: [],
                defaultValue: [],
                startDate: '',
                endDate: '',
                hasSetStrategy: false,
                priorityNum: '',
                weightNum: '',
                randAvgNum: '',
                defaultNum: ''
            }
        },
        methods: {
            moment,
            // 切换显示modal
            switchModal(item) {
                this.showModal = !this.showModal;
                this.sltItem = item;
                if(item) {
                    if(item.basePolicy) {
                        let basePolicy = JSON.parse(item.basePolicy);
                        this.startDate = utility.timestampToTime(basePolicy.timeRange.startTime * 1000, this.dateFormat);
                        this.endDate = utility.timestampToTime(basePolicy.timeRange.endTime * 1000, this.dateFormat);
                        this.sltDate = [this.startDate, this.endDate];
                        this.defaultValue = [moment(this.startDate, this.dateFormat), moment(this.endDate, this.dateFormat)]
                        this.priorityNum = basePolicy.policyInfoList[0].ratio;
                        this.weightNum = basePolicy.policyInfoList[1].ratio;
                        this.randAvgNum = basePolicy.policyInfoList[2].ratio;
                        this.defaultNum = basePolicy.policyInfoList[3].ratio;
                    } else {
                        this.sltDate = [];
                        this.defaultValue = [];
                        this.startDate = '';
                        this.priorityNum = '';
                        this.weightNum = '';
                        this.randAvgNum = '';
                        this.defaultNum = '';
                    }
                }
            },
            // 切换时间段
            dataChangeFun(date, dateString) {
                this.sltDate = dateString;
                this.hasSltDate = false;
            },
            // 调用列表
            getAdPositionData() {
                this.$emit('reload');
            },
            handleOk() {
                if(this.sltDate.length == 0) {
                    this.hasSltDate = true;
                    return false;
                }
                if((this.priorityNum + this.weightNum + this.randAvgNum + this.defaultNum) != 100) {
                    this.hasSetStrategy = true;
                    return false;
                }
                this.hasSetStrategy = false;
                let params = {
                    'contorlSspBean.adPosition.id': this.sltItem.id,
                    'contorlSspBean.adPosition.timeRange.startTime': new Date(this.sltDate[0]).getTime()/1000,
                    'contorlSspBean.adPosition.timeRange.endTime': new Date(this.sltDate[1]).getTime()/1000,
                    'contorlSspBean.adPosition.policys[0]': 'Priority',
                    'contorlSspBean.adPosition.ratios[0]': this.priorityNum,
                    'contorlSspBean.adPosition.policys[1]': 'Weight',
                    'contorlSspBean.adPosition.ratios[1]': this.weightNum,
                    'contorlSspBean.adPosition.policys[2]': 'RandAvg',
                    'contorlSspBean.adPosition.ratios[2]': this.randAvgNum,
                    'contorlSspBean.adPosition.policys[3]': 'Default',
                    'contorlSspBean.adPosition.ratios[3]': this.defaultNum
                };
                http.post(ActionUrl.ssp.adPositionManage.updateStrategy.url, params).then(response => {
                    if(response.data.rCode == '0') {
                        this.$message.success('设置成功！');
                        this.getAdPositionData();
                        this.handleCancel();
                    } else {
                        this.$message.warning('投放策略设置失败，请重试！');
                        this.handleCancel();
                    }
                }).catch(error => {
                    this.$message.warning('投放策略设置失败，请重试！');
                    this.handleCancel();
                });
                
            },
            handleCancel() {
                this.showModal = false;
                this.hasSltDate = false;
                this.hasSetStrategy = false;
            }
        }
    }
</script>
