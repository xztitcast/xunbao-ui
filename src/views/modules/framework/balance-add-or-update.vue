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
  userId: null,
  username: '',
  amount: 0.00,
  freeze: 0.00
}

/**
 * 表单数据
 */
 const dataForm = reactive({ ...data })

 /**
 * 校验规则
 */
const rules = ref({
  userId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  freeze: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
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
 * 提交表单数据
 */
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate(valid => {
    if (valid) {
      baseService.post(`/sys/order/${dataForm.id ? 'update' : 'save'}`, {
        'id': dataForm.id,
        'userId': dataForm.userId,
        'username': dataForm.username,
        'amount': dataForm.amount,
        'freeze': dataForm.freeze
      }).then(({ data }) => {
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
  <el-dialog v-model="visible" :title="dataForm.id ? '修改' : '新增'" append-to-body>
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
      <el-form-item prop="userId" label="用户ID">
        <el-input v-model="dataForm.userId" type="text" placeholder="请输入用户ID" :maxlength="32"></el-input>
      </el-form-item>
      <el-form-item prop="username" label="用户名">
        <el-input v-model="dataForm.username" type="text" placeholder="请输入用户名" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="amount" label="余额">
        <el-input-number v-model="dataForm.amount" :min="0" :step="0.1"></el-input-number>
      </el-form-item>
      <el-form-item prop="freeze" label="冻结金额">
        <el-input-number v-model="dataForm.freeze" :min="1" :step="0.1"></el-input-number>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss">

</style>