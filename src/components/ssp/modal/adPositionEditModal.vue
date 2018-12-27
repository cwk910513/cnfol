<style scoped lang='scss'>
    .input-number {
        width: 100%;
    }
    .custom-label-right {
        text-align: right;
    }
    .custom-label-line-height {
        line-height: 2;
    }
    .red-text {
        color: red;
    }
</style>

<template>
    <a-modal
        :title="sltItem ? '修改广告位' : '新建广告位'"
        :visible='showModal'
        width='1000px'
        @ok='handleOk' 
        okText='确定' 
        @cancel='handleCancel' 
        cancelText='取消'>
        <a-form :autoFormCreate="(form)=>{this.form = form}">
            <a-row>
                <a-col :span='12'>
                    <a-form-item
                        label='名称：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="adPositionName"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择广告位类型', whitespace: true }, {validator: validateFun}]}"
                    >
                        <a-input placeholder='请输入名称' />
                    </a-form-item>
                    <a-form-item
                        label='类型：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="adPositionTypeId"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择广告位类型', whitespace: true }, {validator: validateFun}]}"
                    >
                        <a-select size="default" allowClear placeholder="请选择广告位类型" @change='changeAdPositionTypeFun'>
                            <a-select-option v-for="item in adPositionTypeData" :key="item.key" :value="item.key">
                                {{ item.value }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        label='宽度：'
                        v-if='!sltSize'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="adPositionWidth"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入广告位宽度', whitespace: true }, {validator: validateNumFun}]}"
                    >
                        <a-input placeholder='请输入广告位宽度' class='input-number' />
                    </a-form-item>
                    <a-form-item
                        label='图片格式：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                    >
                        <a-checkbox-group :options="picFormatData" v-model='sltCheckboxImgItem' @change='changeCheckboxImgFun'/>
                    </a-form-item>
                    <a-form-item
                        label='图片数量：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="openPositionImgNum"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入广告位图片数量', whitespace: true }, {validator: validateNumFun}]}"
                    >
                        <a-input placeholder='请输入广告位图片数量' class='input-number' />
                    </a-form-item>
                    <a-form-item
                        label='广告标题限制'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                    >
                        <a-input-number :min='1' placeholder='最小值' v-model='titleMin' />&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;<a-input-number :min='titleMin' placeholder='最大值' v-model='titleMax' />
                    </a-form-item>
                    <a-form-item
                        label='视频大小限制'
                        v-show='hasVideo'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="vidMax"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入视频大小限制', whitespace: true }, {validator: validateNumFun}]}"
                    >
                        <a-input placeholder='请输入视频大小限制' class='input-number' addonAfter="MB" />
                    </a-form-item>
                    <a-form-item
                        label='音频大小限制'
                        v-show='hasAudio'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="audMax"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入音频大小限制', whitespace: true }, {validator: validateNumFun}]}"
                    >
                        <a-input placeholder='请输入音频大小限制' class='input-number' addonAfter="MB" />
                    </a-form-item>
                </a-col>
                <a-col :span='12'>
                    <a-form-item
                        label='所属应用：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="appId"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择所属应用', whitespace: true }, {validator: validateFun}]}"
                    >
                        <a-select size="default" placeholder="请选择所属应用">
                            <a-select-option v-for="appItem in availableAppData" :key="appItem.key" :value="appItem.key">
                                {{ appItem.value }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        label='尺寸：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="adPositionSizeId"
                    >
                        <a-select 
                            size="default" 
                            allowClear 
                            :value='defaultSelectValue' 
                            :disabled='!(adPositionSizeData.length > 1)' 
                            placeholder="请设置广告位尺寸"
                            @change='changeSizeFun'>
                            <a-select-option v-for="sizeItem in adPositionSizeData" :key="sizeItem.key" :value="sizeItem.key">
                                {{ sizeItem.value }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                        label='高度：'
                        v-if='!sltSize'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="adPositionHeight"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入广告位高度', whitespace: true }, {validator: validateNumFun}]}"
                    >
                        <a-input placeholder='请输入广告位高度' class='input-number' />
                    </a-form-item>
                    <a-form-item
                        label='图片限制：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="picMax"
                        :fieldDecoratorOptions="{rules: [{ required: false }]}"
                    >
                        <a-input-number :min='1' placeholder='请输入图片大小限制(单位: KB)' class='input-number' />
                    </a-form-item>
                    <a-form-item
                        label='最大广告数：'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="adMax"
                        :fieldDecoratorOptions="{rules: [{ required: false }]}"
                    >
                        <a-input-number :min='1' placeholder='请输入广告位上最大广告数' class='input-number' />
                    </a-form-item>
                    <a-form-item
                        label='推广文案限制'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                    >
                        <a-input-number :min='1' placeholder='最小值' v-model='cwMin' />&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;<a-input-number :min='cwMin' placeholder='最大值' v-model='cwMax' />
                    </a-form-item>
                    <a-form-item
                        label='视频长度限制'
                        v-show='hasVideo'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                    >
                        <a-input-number :min='1' :max='7200' placeholder='最小值' v-model='vidTimeMin' />&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;<a-input-number :min='vidTimeMin' :max='7200' placeholder='最大值' v-model='vidTimeMax' />
                    </a-form-item>
                    <a-form-item
                        label='音频长度限制'
                        v-show='hasAudio'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                    >
                        <a-input-number :min='1' :max='7200' placeholder='最小值' v-model='audTimeMin' />&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;<a-input-number :min='audTimeMin' :max='7200' placeholder='最大值' v-model='audTimeMax' />
                    </a-form-item>
                </a-col>
                <a-col :span='3' class='custom-label-right'>
                    <span class='red-text'>*</span>交互方式：
                </a-col>
                <a-col :span='21'>
                    <a-checkbox-group :options="checkboxData" v-model='sltCheckboxItem' @change='changeCheckboxFun'/>
                    <div v-show='!sltCheckboxItem.length' class='red-text'>请选择交互方式</div>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import ActionUrl from '../../../assets/js/action.url.js';
    import http from '../../../assets/js/http.js';
    import utility from '../../../assets/js/utility.js';
    import config from '../../../assets/js/config.js';

    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 6 },
        wrapperCol: { span: 16 }
    };

    export default {
        data () {
            return {
                formItemLayout,
                showModal: false,
                picFormatData: [],
                checkboxData: [],
                checkboxValue: [],
                availableAppData: [],
                adPositionTypeData: [],
                adPositionSizeData: [],
                defaultSelectValue: '请设置广告位尺寸',
                sltSize: '',
                titleMin: 1,
                titleMax: 100,
                cwMin: 1,
                cwMax: 100,
                vidTimeMin: 1,
                vidTimeMax: 7200,
                audTimeMin: 1,
                audTimeMax: 7200,
                sltCheckboxImgItem: [],
                sltCheckboxItem: [1],
                sltItem: '',
                hasVideo: false,
                hasAudio: false
            }
        },
        mounted() {
            this.picFormatData = config.picFormat;
            this.adPositionTypeData = config.positionTypes;
            this.getAvailableApp();
            this.getInteractType();
        },
        methods: {
            // 获取所属应用
            getAvailableApp() {
                let params = {
                    'applicationBean.application.state': -1,
                    'applicationBean.application.productTyp': -1,
                    'applicationBean.application.appName': '',
                    'page': 1,
                    'rows': 9999
                };
                http.post(ActionUrl.ssp.adPositionManage.getAvailableApp.url, params).then(response => {
                    response.data.data.forEach(item => {
                        this.availableAppData.push({ key: item.id, value: item.appName });
                    });
                }).catch(error => {
                    this.$message.warning('获取所属应用失败，请重试！');
                });
            },
            // 获取交互方式
            getInteractType() {
                http.post(ActionUrl.ssp.adPositionManage.getInteractType.url).then(response => {
                    response.data.data.forEach(item => {
                        this.checkboxData.push({ label: item.interactType, value: item.interactCode });
                    });
                }).catch(error => {
                    this.$message.warning('获取交互方式失败，请重试！');
                });
            },
            // 校验
            validateFun(rule, value, f) {
                if(!value) {
                    f();
                }
                f();
            },
            // 校验数字
            validateNumFun(rule, value, f) {
                if(value !== "") {
                    if(value !== undefined && !utility.regNum(value)) {
                        f('请输入正确格式的数字！');
                    }
                }
                f();
            },
            // 切换类型查询尺寸
            changeAdPositionTypeFun(value) {
                this.adPositionSizeData = [];
                this.defaultSelectValue = '请设置广告位尺寸';
                http.post(ActionUrl.ssp.adPositionManage.getAdPositionSizeById.url, { 'adPositionBean.adPosition.adPositionTypeId': value }).then(response => {
                    response.data.data.forEach(item => {
                        this.adPositionSizeData.push({ key: item.id, value: item.adPositionWidth + '*' + item.adPositionHeight });
                    })
                    let defaultItem = { key: 0, value: '自定义尺寸' };
                    this.adPositionSizeData = [].concat.call(defaultItem, ...this.adPositionSizeData);
                    if(this.adPositionSizeData.length > 1) {
                        this.defaultSelectValue = '自定义尺寸';
                    }
                }).catch(error => {
                    this.$message.warning('查询广告位尺寸失败，请重试！');
                })
            },
            // 切换尺寸
            changeSizeFun(value) {
                this.sltSize = value;
            },
            // 切换图片格式
            changeCheckboxImgFun(value) {
                this.sltCheckboxImgItem = value;
            },
            // 切换多选
            changeCheckboxFun(value) {
                this.hasVideo = value.indexOf(5) != -1 ? true : false;
                this.hasAudio = value.indexOf(6) != -1 ? true : false;
                this.sltCheckboxItem = value;
            },
            // 切换modal显示
            switchModal(item) {
                this.showModal = !this.showModal;
                this.sltItem = item;
                if(item) {
                    this.changeAdPositionTypeFun(item.adPositionTypeId);
                    this.changeSizeFun(item.adPositionSizeId);
                    let picFormatArray = [], interactiveIntArray = [];
                    if(item.picFormat.split(',').length > 0) {
                        item.picFormat.split(',').forEach(item => {
                            picFormatArray.push(parseInt(item));
                        })
                    }
                    if(item.interactive.split(',').length > 0) {
                        item.interactive.split(',').forEach(item => {
                            interactiveIntArray.push(parseInt(item));
                        })
                    }
                    setTimeout(() => {
                        this.hasVideo = interactiveIntArray.indexOf(5) != -1 ? true : false;
                        this.hasAudio = interactiveIntArray.indexOf(6) != -1 ? true : false;
                        this.form.setFieldsValue({
                            adPositionName: item.adPositionName,
                            appId: item.appId,
                            adPositionTypeId: item.adPositionTypeId,
                            adPositionSizeId: item.adPositionSizeId,
                            adPositionWidth: item.adPositionWidth,
                            adPositionHeight: item.adPositionHeight,
                            picMax: item.picMax,
                            openPositionImgNum: item.openPositionImgNum +'',
                            adMax: item.adMax,
                            audMax: item.audMax +'',
                            vidMax: item.vidMax +''
                        });
                        this.titleMin = item.titleMin;
                        this.titleMax = item.titleMax;
                        this.cwMin = item.cwMin;
                        this.cwMax = item.cwMax;
                        this.audTimeMin = item.audTimeMin;
                        this.audTimeMax = item.audTimeMax;
                        this.vidTimeMin = item.vidTimeMin;
                        this.vidTimeMax = item.vidTimeMax;
                        this.sltCheckboxImgItem = picFormatArray;
                        this.sltCheckboxItem = interactiveIntArray;
                    }, 100);
                }
            },
            // 调用列表
            getAdPositionData() {
                this.$emit('reload');
            },
            handleOk() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            if(!this.sltCheckboxItem.length) {
                                return false;
                            }
                            let params = {
                                'adPositionBean.adPosition.id': this.sltItem ? this.sltItem.id : '',
                                'adPositionBean.adPosition.appId': values.appId,
                                'adPositionBean.adPosition.adMediaType': 1,
                                'adPositionBean.adPosition.adPositionSizeId': values.adPositionSizeId || '',
                                'adPositionBean.adPosition.adPositionName': values.adPositionName,
                                'adPositionBean.adPosition.adPositionTypeId': values.adPositionTypeId,
                                'adPositionBean.adPositionWidth': values.adPositionWidth || 0,
                                'adPositionBean.adPositionHeight': values.adPositionHeight || 0,
                                'adPositionBean.adPosition.picFormat': this.sltCheckboxImgItem.join(','),
                                'adPositionBean.adPosition.picMax': values.picMax,
                                'adPositionBean.adPosition.adMax': values.adMax,
                                'adPositionBean.adPosition.openPositionImgNum': values.openPositionImgNum,
                                'adPositionBean.adPosition.titleMin': this.titleMin,
                                'adPositionBean.adPosition.titleMax': this.titleMax,
                                'adPositionBean.adPosition.cwMin': this.cwMin,
                                'adPositionBean.adPosition.cwMax': this.cwMax,
                                'adPositionBean.adPosition.interactive': this.sltCheckboxItem.join(','),
                                'adPositionBean.adPosition.audMax': values.audMax,
                                'adPositionBean.adPosition.audTimeMin': this.audTimeMin,
                                'adPositionBean.adPosition.audTimeMax': this.audTimeMax,
                                'adPositionBean.adPosition.vidMax': values.vidMax,
                                'adPositionBean.adPosition.vidTimeMin': this.vidTimeMin,
                                'adPositionBean.adPosition.vidTimeMax': this.vidTimeMax,
                                'adPositionBean.adPosition.submitTags': ''
                            };
                            // 删除对象中的id
                            if(!this.sltItem) {
                                delete params['adPositionBean.adPosition.id']
                            }
                            let url = this.sltItem ? ActionUrl.ssp.adPositionManage.update.url : ActionUrl.ssp.adPositionManage.create.url ;
                            http.post(url, params).then(response => {
                                if(response.data.rCode === '0') {
                                    this.$message.success('操作成功！');
                                    this.getAdPositionData();
                                    this.showModal = false;
                                } else {
                                    this.$message.warning('创建数据失败，请重试！');
                                    this.showModal = false;
                                }
                            }).catch(error => {
                                this.$message.warning('创建数据失败，请重试！');
                                this.showModal = false;
                            });
                        }
                    },
                )
            },
            handleCancel() {
                this.showModal = false;
            }
        }
    }
</script>
