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
  starIds: [1]
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
  starIds: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
})

/**
 * 初始化
 */
const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  dataForm.id = id

  nextTick(() => {if(id) getInfo()})
}

/**
 * 获取表单信息
 */
const getInfo = () => {
  baseService.get(`/sys/star/rule/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0) {
      dataForm.name = data.result?.name
      dataForm.starIds = JSON.parse(data.result?.starIds)
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
      baseService.post(`/sys/star/rule/${dataForm.id ? 'update' : 'save'}`, {
        "id": dataForm.id,
        "name": dataForm.name,
        "starIds": JSON.stringify(dataForm.starIds)
      }).then(({ data }) => {
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
      <el-form-item prop="name" label="规则名称">
        <el-input v-model="dataForm.name" placeholder="请输入规则名称" :maxlength="32" clearable></el-input>
      </el-form-item>
      <el-form-item prop="starIds" label="星级等级">
        <el-checkbox-group v-model="dataForm.starIds">
          <el-checkbox-button :value="1">一星</el-checkbox-button>
          <el-checkbox-button :value="2">二星</el-checkbox-button>
          <el-checkbox-button :value="3">三星</el-checkbox-button>
          <el-checkbox-button :value="4">四星</el-checkbox-button>
          <el-checkbox-button :value="5">五星</el-checkbox-button>
          <el-checkbox-button :value="6">六星</el-checkbox-button>
          <el-checkbox-button :value="7">七星</el-checkbox-button>
        </el-checkbox-group>
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