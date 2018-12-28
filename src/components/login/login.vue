<!-- 添加scoped，用于设置样式文件只在当前组件中生效 -->
<style scoped lang='scss'>
    @import '../../assets/scss/login.scss';
</style>

<template>
    <div class="login-content">
        <div class="text-info">PMS 运营平台</div>
        <br/>
        <a-row>
            <a-col :xs="3" :sm="6" :md="8" :lg="8" :xl="9" :xxl="10"></a-col>
            <a-col :xs="18" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
                <a-input placeholder='请输入用户名...' v-model='user'>
                    <a-icon slot='prefix' type='user' style='color:rgba(0,0,0,.25)'/>
                </a-input>
                <br />
                <br />
                <a-input type='password' placeholder='请输入密码...' v-model='pwd'>
                    <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)'/>
                </a-input>
                <br/>
                <br/>
                <a-button type='primary' class='login-btn' @click='loginFun'>登录</a-button>
                <br/>
                <br/>
                <div>
                    <a-tooltip placement="top">
                        <template slot="title">
                            功能暂未开放，如有疑问请联系管理员：chuwk@xxx.com！
                        </template>
                        <span class='forget' @click='forgetPwdFun'>忘记密码？</span>
                    </a-tooltip>
                    <span class='register' @click='registerFun'>注册用户</span>
                </div>
                <div class="bottom-info">
                    Copyright<i class="anticon anticon-copyright"></i> 2018 chuwk 工作室出品 
                </div>
            </a-col>
            <a-col :xs="3" :sm="6" :md="8" :lg="8" :xl="9" :xxl="10"></a-col>
        </a-row>
        <a-modal
            title           ='注册用户'
            :visible        ='regeristerModel'
            :confirmLoading ='okBtnLoading'
            @ok             ='handleOk'
            okText          ='注册'
            @cancel         ='handleCancel'
            cancelText      ='取消'
        >
            <a-form :autoFormCreate="(form)=>{this.form = form}">
                <a-form-item
                    label='用户名'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="regUser"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '用户名不能为空', whitespace: true }, {validator: validateUser}]}"
                >
                    <a-input placeholder="数字+字符组成，且必须大于6位，小于10位"/>
                </a-form-item>
                <a-form-item
                    label='密码'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="regPwd"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '密码不能为空', whitespace: true}, {validator: validatePwd}]}"
                >
                    <a-input type='password' placeholder="数字+字符组成，且必须大于6位，小于20位"/>
                </a-form-item>
                <a-form-item
                    label='确认密码'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="regCfmPwd"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '确认密码不能为空', whitespace: true}, {validator: validateCfmPwd}]}"
                >
                    <a-input type='password' placeholder="请输入确认密码"/>
                </a-form-item>
                <a-form-item
                        label='手机'
                        :labelCol="formItemLayout.labelCol"
                        :wrapperCol="formItemLayout.wrapperCol"
                        fieldDecoratorId="regPhone"
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入手机号码！', whitespace: true}, {validator: validatePhone}]}"
                >
                    <a-input-group compact>
                        <a-select defaultValue="86">
                            <a-select-option value="86">+86</a-select-option>
                        </a-select>
                        <a-input style="width: 78%" placeholder="请输入手机号码" />
                    </a-input-group>
                </a-form-item>
                <a-form-item
                    label='邮箱'
                    :labelCol="formItemLayout.labelCol"
                    :wrapperCol="formItemLayout.wrapperCol"
                    fieldDecoratorId="regEmail"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入邮箱！', whitespace: true}, {validator: validateEmail}]}"
                >
                    <a-input placeholder="请输入邮箱"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import utility from '../../assets/js/utility.js';
    import ActionUrl from '../../assets/js/action.url.js';

    // 表单中每一行的布局
    const formItemLayout = {
        labelCol  : { span: 5 },
        wrapperCol: { span: 16 }
    };

    export default {
        data () {
            return {
                formItemLayout,
                user           : '',     // 登录用户名
                pwd            : '',     // 登录密码
                regUser        : '',     // 注册用户名
                regPwd         : '',     // 注册密码
                regeristerModel: false,  // 显示注册modal
                okBtnLoading   : false   // modal确定按钮loading
            }
        },
        methods: {
            // 登录
            loginFun() {
                let self = this;
                if(!self.user) {
                    self.$message.warning('用户名不能为空，请输入！');
                    return false;
                }
                if(!self.pwd) {
                    self.$message.warning('密码不能为空，请输入！');
                    return false;
                }
                this.$apiAxios(ActionUrl.login.login.type, ActionUrl.login.login.url, null).then(data => {
                    sessionStorage.setItem('loginAuth', data.cookieValue);
                    self.$router.push({ path: '/dashboard' });
                }).catch(result => {
                    this.$message.error(result.msg);
                })
            },
            // 忘记密码
            forgetPwdFun() {
                let self = this;

            },
            // 显示注册用户modal
            registerFun() {
                let self = this;
                self.regeristerModel = true;
            },
            // 校验用户名（6位置以上，必须包含字母+数字）
            validateUser(rule, value, f) {
                if(value !== "") {
                    if(value !== undefined && !utility.regUser(value)) {
                        f('请输入正确格式的用户名！');
                    }
                }
                // *** 此处必须添加此方法，不然第一次提交表单的时候，无法完成校验 ***
                f();
            },
            // 校验密码
            validatePwd(rule, value, f) {
                if(value !== "") {
                    if(value !== undefined && !utility.regPwd(value)) {
                        f('请输入正确格式的密码！');
                    }
                }
                f();
            },
            // 校验确认密码
            validateCfmPwd(rule, value, f) {
                let self = this;
                if(value !== "") {
                    if(value !== undefined && self.form.getFieldValue('regPwd') !== self.form.getFieldValue('regCfmPwd')) {
                        f('两次密码输入不一致，请重新输入密码！');
                    }
                }
                f();
            },
            // 校验手机号码
            validatePhone(rule, value, f) {
                if(value !== "") {
                    if(value !== undefined && !utility.regPhone(value)) {
                        f('请输入正确格式的电话号码！');
                    }
                }
                f();
            },
            // 校验邮箱
            validateEmail(rule, value, f) {
                if(value !== "") {
                    if(value !== undefined && !utility.regEmail(value)) {
                        f('请输入正确格式的邮箱！');
                    }
                }
                f();
            },
            // modal确定
            handleOk() {
                let self = this;
                self.form.validateFields(
                    async (err, values) => {
                        if (!err) {
                            self.okBtnLoading = true;
                            // const { data } = await http.post(ActionUrl.login.register.url, { 
                            //     username: values.regUser, 
                            //     password: values.regPwd,
                            //     phone: values.regPhone,
                            //     email: values.regEmail
                            // });
                            // if(data.status === 'success') {
                            //     self.$message.success(data.message);
                            //     self.regeristerModel = false;
                            //     self.okBtnLoading = false;
                            // } else {
                            //     self.$message.warning('注册失败，请联系管理员chuwk@xxx.com！');
                            //     self.okBtnLoading = false;
                            // }
                        }
                    },
                )
            },
            // modal取消
            handleCancel() {
                let self = this;
                self.regeristerModel = false;
            }
        }
    }
</script>