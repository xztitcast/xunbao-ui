<template>
  <div class="tt-login">
    <div class="tt-login-wrap">
      <div class="tt-login-left hidden-sm-and-down">
        <p class="tt-login-left-title">滔滔后台系统</p>
      </div>

      <div class="tt-login-right">
        <div class="tt-login-right-main">
          <h4 class="tt-login-right-main-title">登录</h4>
          <el-form ref="dataFormRef" label-width="80px" :status-icon="true" :model="dataForm" :rules="dataRule" @keyup.enter="onLogin">
            <el-form-item label-width="0" prop="username">
              <el-input v-model="dataForm.username" placeholder="用户名" prefix-icon="user" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="password">
              <el-input placeholder="密码" v-model="dataForm.password" prefix-icon="lock" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="captcha">
              <el-space class="tt-login-right-main-code">
                <el-input v-model="dataForm.captcha" placeholder="验证码" prefix-icon="first-aid-kit"></el-input>
                <img style="vertical-align: middle; height: 40px; cursor: pointer" :src="state.captchaUrl" @click="onRefreshCode" alt="" />
              </el-space>
            </el-form-item>
            <el-form-item label-width="0">
              <el-button type="primary" size="small" :disabled="state.loading" @click="onLogin" class="tt-login-right-main-btn"> 登录 </el-button>
            </el-form-item>
          </el-form>
          <Verify @success="successHandle" :mode="'pop'" :captchaType="captchaType" :imgSize="{ width: '430px', height: '235px' }" ref="verify"></Verify>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <p><a href="" target="_blank">滔滔管理系统</a>{{ state.year }} © com.bovine</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { CacheToken, CacheWord } from "@/constants/cacheKey";
import baseService from "@/service/baseService";
import { setCache } from "@/utils/cache";
import { ElMessage } from "element-plus";
import { getUuid, doEncrypt } from "@/utils";
import app from "@/constants/app";
import { useAppStore } from "@/store";
import { useRouter } from "vue-router";
import Verify from '@/components/verifition/Verify.vue'

const store = useAppStore();
const router = useRouter();

const state = reactive({
  captchaUrl: "",
  loading: false,
  year: new Date().getFullYear()
});

const verify = ref(null)
const captchaType = ref('')
const dataFormRef = ref();
const dataForm = reactive({ username: "", password: "", captcha: "", uuid: "" });
const dataRule = ref({
  username: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  password: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  captcha: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

onMounted(() => {
  //清理数据
  store.logout();
  getCaptchaUrl();
});

const getCaptchaUrl = () => {
  dataForm.uuid = getUuid();
  state.captchaUrl = `${app.api}/sys/captcha.jpg?uuid=${dataForm.uuid}`;
};

const onRefreshCode = () => {
  getCaptchaUrl();
};

const successHandle = (param) => {
  param.uuid = dataForm.uuid
  param.captcha = dataForm.captcha
  param.username = dataForm.username
  param.password = doEncrypt(dataForm.password, CacheWord)
  baseService.post('/sys/login', param, { 'Content-Type': 'application/x-www-form-urlencoded' }).then(({ data }) => {
    if (data && data.code === 0) {
      setCache(CacheToken, data.result, true);
      ElMessage.success("登录成功");
      router.push("/");
    } else {
      state.loading = false;
      onRefreshCode();
      ElMessage.error(data.message);
    }
  })
}
const onLogin = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      var next = Math.floor((Math.random() * 100) + 1);
      if (next <= 50) {
        captchaType.value = 'blockPuzzle'
      } else {
        captchaType.value = 'clickWord'
      }
      verify.value.show()
    }
  })
}
</script>

<style lang="less" scoped>
@import url("@/assets/theme/base.less");
.tt-login {
  width: 100vw;
  height: 100vh;
  background: #019ec4;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 992px) {
    .tt-login-wrap {
      width: 96% !important;
    }
    .tt-login-right {
      width: 100% !important;
    }
  }

  &-wrap {
    margin: 0 auto;
    width: 1000px;
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    animation-duration: 1s;
    animation-fill-mode: both;
    border-radius: 5px;
    overflow: hidden;
  }

  &-left {
    justify-content: center;
    flex-direction: column;
    background-color: @--color-primary;
    color: #fff;
    float: left;
    width: 50%;

    &-title {
      text-align: center;
      color: #fff;
      font-weight: 300;
      letter-spacing: 2px;
      font-size: 32px;
    }
  }

  &-right {
    border-left: none;
    color: #fff;
    background-color: #fff;
    width: 50%;
    float: left;

    &-main {
      margin: 0 auto;
      width: 65%;
      &-title {
        color: #333;
        margin-bottom: 40px;
        font-weight: 500;
        font-size: 24px;
        text-align: center;
        letter-spacing: 4px;
      }

      &-lang .iconfont {
        font-size: 20px;
        color: #606266;
        font-weight: 800;
        width: 20px;
        height: 20px;
      }

      .el-input__inner {
        border-width: 0;
        border-radius: 0;
        border-bottom: 1px solid #dcdfe6;
      }

      &-code {
        width: 100%;
        .el-space__item:first-child {
          flex: 1;
        }
      }
      &-btn {
        width: 100%;
        height: 45px;
        font-size: 18px !important;
        letter-spacing: 2px;
        font-weight: 300 !important;
        cursor: pointer;
        margin-top: 30px;
        font-family: neo, sans-serif;
        transition: 0.25s;
      }
    }
  }

  .login-footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    p {
      margin: 10px 0;
    }
    a {
      padding: 0 5px;
      color: rgba(255, 255, 255, 0.6);
      &:focus,
      &:hover {
        color: #fff;
      }
    }
  }

  &-left,
  &-right {
    position: relative;
    min-height: 500px;
    align-items: center;
    display: flex;
  }

  @keyframes animate-down {
    0%,
    60%,
    75%,
    90%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      opacity: 0;
      transform: translate3d(0, -3000px, 0);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, 25px, 0);
    }
    75% {
      transform: translate3d(0, -10px, 0);
    }
    90% {
      transform: translate3d(0, 5px, 0);
    }
    to {
      transform: none;
    }
  }

  .animate-down {
    animation-name: animate-down;
  }
}
</style>
