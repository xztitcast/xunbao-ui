<script setup>
import { reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const dataFormRef = ref(null)

const data = {
  id: null,
  key: '',
  value: '',
  remark: ''
}

const dataForm = reactive({ ...data })

const dataRule = ref({
  key: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  value: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
})

const init = (id) => {
  visible.value = true;
  dataForm.id = id;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  if (id) {
    getInfo(id)
  }
}

// 获取信息
const getInfo = () => {
  baseService.get(`/sys/dict/info/${dataForm.id}`).then(({ data }) => {
    if (data && data.code === 0) {
       Object.assign(dataForm, data.result);
    } else {
      ElMessage.error(data.message)
    }
  })
}

const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      baseService.post(`/sys/dict/${dataForm.id ? 'update' : 'save'}`, dataForm)
        .then(({ data }) => {
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
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="key" label="字典(KEY)">
        <el-input v-model="dataForm.key" placeholder="请输入字典(KEY)"></el-input>
      </el-form-item>
      <el-form-item prop="value" label="字典值">
        <el-input v-model="dataForm.value" placeholder="请输入字典值"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false" icon="Close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
</style>
