<script setup>
import { reactive, ref, nextTick } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const dataFormRef = ref(null)

/**
 * 元数据
 */
const data = {
  id: null,
  name: '',
  url: '',
  amount: 0.00,
  status: 0,
  expire: 7,
  range: 1
}

/**
 * 表单数据
 */
 const dataForm = reactive({ ...data })

/**
 * 表单规则
 */
const rules = ref({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  url: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  amount: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  status: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  expire: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  range: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
})

/**
 * 初始化
 */
const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  Object.assign(dataForm, data)

  dataForm.id = id

  nextTick(() => {
    if(id) getInfo()
  })
}

/**
 * 获取表单信息
 */
const getInfo = () => {
  baseService.get(`/sys/item/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0) {
      dataForm.name = data.result?.name
      dataForm.url = data.result?.url
      dataForm.amount = data.result?.amount
      dataForm.status = data.result?.status
      dataForm.expire = data.result?.expire
      dataForm.range = data.result?.range
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
    if (valid) {
      baseService.post(`/sys/item/${dataForm.id ? 'update' : 'save'}`, dataForm).then(({ data }) => {
          if (data && data.code === 0) {
            ElMessage.success({
              message: "操作成功",
              duration: 500,
              onClose: () => {
                visible.value = false
                emit("refreshDataList")
              }
            })
          } else {
            ElMessage.error(data.message)
          }
        })
    }
  })
}, 3000, { 'leading': true, 'trailing': false })

defineExpose({ init })
</script>

<template>
  <el-dialog v-model="visible" :title="dataForm.id ? '修改' : '新增'" append-to-body style="width: 35%;">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
      <el-form-item prop="name" label="奖品名称">
        <el-input v-model="dataForm.name" placeholder="请输入奖品名称" :maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item prop="url" label="奖品图片">
        <el-upload-plus v-model="dataForm.url"></el-upload-plus>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-select v-model="dataForm.status" placeholder="请选择活动状态" style="width: 240px" clearable>
          <el-option label="上架" :value="1"></el-option>
          <el-option label="下架" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="amount" label="奖品金额">
        <el-input-number v-model="dataForm.amount" :min="0.00" :step="0.01"></el-input-number>
      </el-form-item>
      <el-form-item prop="expire" label="失效时间">
        <el-input-number v-model="dataForm.expire" :min="0" :max="30" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item prop="range" label="排名范围">
        <el-input-number v-model="dataForm.range" :min="-1" :max="1000" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false" icon="Close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">

</style>