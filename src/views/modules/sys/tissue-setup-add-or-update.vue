<script setup>
import { nextTick, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const dataFormRef = ref(null)
const smsChannelList = ref([
  {value: 1, label: '深圳'},
  {value: 2, label: '高速触发'},
  {value: 3, label: '湘邮惠'},
  {value: 4, label: '桔橙'},
  {value: 5, label: '阿里云'},
  {value: 6, label: '邮商街'},
  {value: 7, label: '粤邮惠'},
  {value: 8, label: '企业商务'},
  {value: 9, label: '河北'}
])
const data = {
  id: null,
  channelType: '',
  appid: '',
  appsecret: '',
  wechatCouponsType: 0,
  mpAppid: '',
  payshopid: '',
  wxmchid: '',
  wxserialno: '',
  wxapiv3key: '',
  shopapipath: ''
}

const dataForm = reactive({ ...data })
const dataRule = ref({
  channelType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  appid: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  appsecret: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  wechatCouponsType: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  payshopid: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  wxmchid: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  wxserialno: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  wxapiv3key: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  shopapipath: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
})

/**
 * 组件初始化函数
 * @param {*} id 
 */
const init = (id) => {
  visible.value = true;
  dataForm.id = id;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  nextTick(() => { getInfo() })
}

/**
 * 获取表单数据
 */
const getInfo = () => {
  baseService.get(`/sys/tissue/setup/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0) {
      Object.assign(dataForm, data.result)
      var created = data.result?.created
      dataForm.show = created && ((7 * 24 * 3600 + new Date(created).getTime()  - new Date().getTime()) <= 0)
    }else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 表单提交
 */
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if(valid) {
      baseService.post(`/sys/tissue/setup/saveOrUpdate`, dataForm).then(({ data }) => {
        if(data && data.code === 0) {
          ElMessage.success({
            message: "操作成功",
            duration: 500,
            onClose: () => {
              visible.value = false;
              emit("refreshDataList");
            }
          })
        }else {
          ElMessage.error(data.message)
        }
      })
    }
  })
}, 3000, { 'leading': true, 'trailing': false })

defineExpose({ init })
</script>
<template>
  <el-dialog v-model="visible" title="机构配置" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px" :disabled="dataForm.show">
      <el-form-item label="短信通道" prop="channelType">
        <el-select v-model="dataForm.channelType" placeholder="请选择" style="width: 240px" clearable>
          <el-option v-for="item in smsChannelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小程序APPID" prop="appid">
        <el-input v-model="dataForm.appid" placeholder="请输入小程序APPID" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="小程序秘钥" prop="appsecret">
        <el-input v-model="dataForm.appsecret" placeholder="请输入小程序秘钥" :maxlength="48"></el-input>
      </el-form-item>
      <el-form-item label="是否公众号发券" prop="wechatCouponsType">
        <el-radio v-model="dataForm.wechatCouponsType" :label="0">否</el-radio>
        <el-radio v-model="dataForm.wechatCouponsType" :label="1">是</el-radio>
      </el-form-item>
      <el-form-item label="公众号APPID" prop="mpAppid" v-show="dataForm.wechatCouponsType === 1">
        <el-input v-model="dataForm.mpAppid" placeholder="请输入公众号APPID" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="支付商户" prop="payshopid">
        <el-input v-model="dataForm.payshopid" placeholder="请输入支付商户ID" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="微信商户号" prop="wxmchid">
        <el-input v-model="dataForm.wxmchid" placeholder="请输入微信商户号" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="商户证书序列号" prop="wxserialno">
        <el-input v-model="dataForm.wxserialno" placeholder="请输入商户证书序列号" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="APIv3密钥" prop="wxapiv3key">
        <el-input v-model="dataForm.wxapiv3key" placeholder="请输入APIv3密钥" :maxlength="128"></el-input>
      </el-form-item>
      <el-form-item label="私钥地址" prop="shopapipath">
        <el-input v-model="dataForm.shopapipath" placeholder="请输入私钥地址" :maxlength="255"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer" v-show="!dataForm.show">
        <el-button @click="visible = false" icon="Close">取消</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss">

</style>