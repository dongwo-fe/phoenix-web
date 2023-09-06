<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <div class="title-container">
                <h3 class="title">前端项目管理系统</h3>
            </div>

            <el-form-item prop="phone">
                <span class="svg-container">
                    <svg-icon icon-class="user" />
                </span>
                <el-input ref="username" v-model="loginForm.username" placeholder="请输入账号" name="phone" type="text" tabindex="1" auto-complete="on" />
            </el-form-item>

            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click.native.prevent="handleLogin">登录</el-button>
            <div v-if="client_id.length > 0" class="tips" @click="dingdingLogin">钉钉登录</div>
        </el-form>
        <div v-show="showDDLogin" id="ddlogin">
            <div class="close" @click="showDDLogin = false"><i class="el-icon-error" /></div>
            <iframe :src="ddloginUrl" width="100%" height="100"></iframe>
        </div>
    </div>
</template>

<script>
import { publicLogin } from '@/api/userManage';

export default {
    name: 'Login',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入账号'));
            } else {
                callback();
            }
        };

        return {
            loginForm: {
                username: '',
                password: '',
            },
            loginRules: {
                password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
                username: [{ required: true, trigger: 'blur', validator: validateUsername }],
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            showDDLogin: false,
            ddloginUrl: '',
            client_id: '',
        };
    },
    created() {
        this.redirect = this.$route.query.redirect;
        console.log(this.redirect);
        window.addEventListener('message', this.onMessage);
    },
    destroyed() {},
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = '';
            } else {
                this.passwordType = 'password';
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin() {
            if (!this.redirect) {
                this.$notify({
                    message: '没有来源网站',
                    type: 'error',
                });
                return;
            }
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    try {
                        const data = await publicLogin(this.loginForm);
                        console.log(data, this.redirect);
                        if (this.redirect.includes('?')) {
                            window.location.href = this.redirect + '&code=' + data.code;
                        } else {
                            window.location.href = this.redirect + '?code=' + data.code;
                        }
                    } catch (error) {
                        this.$notify({
                            message: error.message,
                            type: 'error',
                        });
                    }
                    this.loading = false;
                }
            });
        },
        onMessage(e) {
            console.log('收到消息', e.data);
            if (e.data.type && e.data.type === 'canary_login') {
                if (this.redirect.includes('?')) {
                    window.location.href = this.redirect + '&code=' + e.data.code;
                } else {
                    window.location.href = this.redirect + '?code=' + e.data.code;
                }
            }
        },
        dingdingLogin() {
            this.ddloginUrl = `https://login.dingtalk.com/oauth2/auth?redirect_uri=https%3A%2F%2F${window.location.host}%2Fapi%2Foauth2%2Fdingding_in&response_type=code&client_id=${this.client_id}&scope=openid&state=&prompt=consent`;
            this.showDDLogin = true;
        },
    },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            --webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg: #3333;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    background-image: url('https://ossprod.jrdaimao.com/file/1650791177056273.jpg');
    background-size: auto 100%;

    .login-form {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 520px;
        padding: 35px;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
        text-align: right;
        cursor: pointer;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    #ddlogin {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 520px;
        height: 650px;
        background: #fff;

        .close {
            width: 30px;
            height: 30px;
            position: absolute;
            right: -32px;
            cursor: pointer;

            i {
                font-size: 28px;
                color: #fff;
            }
        }

        iframe {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }
}
</style>
