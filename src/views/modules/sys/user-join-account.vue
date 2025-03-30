<script setup>
import { reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const dataFormRef = ref()

const data = {
  id: null,
  accId: null
}

const dataForm = reactive({ ...data })

const init = (id) => {
  visible.value = true

  dataForm.id = id

  // 重置表单数据
  dataFormRef.value?.resetFields()

  if(id) getInfo()
}

const rules = ref({
  accId: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
})

// 获取信息
const getInfo = () => {
  baseService.get(`/sys/user/info/${dataForm.id}`).then(({ data }) => {
    if (data && data.code === 0) {
      dataForm.accId = data.result.accId
    } else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 提交
 */
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      baseService.post('/sys/user/update', {
        "id": dataForm.id,
        "accId": dataForm.accId
      }).then(({ data }) => {
          if (data && data.code === 0) {
            ElMessage.success({
              message: "操作成功",
              duration: 500,
              onClose: () => {
                visible.value = false;
                emit("refreshDataList");
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
  <el-dialog v-model="visible" title="关联" :close-on-click-modal="false" :close-on-press-escape="false" style="width: 25%;">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="accId" label="账号ID">
        <el-input v-model="dataForm.accId" placeholder="请输入应用端头像旁边的ID账号" :maxlength="20"
          :formatter="(value) => value.replace(/[^\d]/g, '')"
          :parser="(value) => value.replace(/^0{1,}/g, '')">
        </el-input>
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