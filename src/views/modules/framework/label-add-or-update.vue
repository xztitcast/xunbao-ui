<script setup>
import { reactive, ref } from 'vue'
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const dataFormRef = ref(null)
const visible = ref(false)

/**
 * 元数据
 */
const data = {
  id: null,
  name: '',
  status: 1
}

/**
 * 表单数据
 */
const dataForm = reactive({ ...data })

/**
 * 校验规则
 */
const rules = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

/**
 * 初始化
 */
const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  dataForm.id = id

  if(id) getInfo()
}

/**
 * 获取详情
 */
const getInfo = () => {
  baseService.get(`/sys/label/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0){
      dataForm.name = data.result?.name
      dataForm.status = data.result?.status
    }else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 提交表单数据
 */
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate(valid => {
    if (valid) {
      baseService.post(`/sys/label/${dataForm.id ? 'update' : 'save'}`, dataForm).then(({ data }) => {
        if (data && data.code === 0) {
          ElMessage.success({
            message: "成功",
            duration: 500,
            onClose: () => {
              visible.value = false;
              emit("refreshDataList");
            }
         })
        }
      })
    }
  })
}, 3000, { leading: true, trailing: false })

defineExpose({ init })
</script>

<template>
  <el-dialog v-model="visible" :title="dataForm.id ? '修改' : '新增'" append-to-body style="width: 20%;">
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="80px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="dataForm.name" type="text" placeholder="请输入标签名称(限制12字)" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :value="0">禁用</el-radio>
          <el-radio :value="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>

</style>