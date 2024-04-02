<script setup>
import { reactive, ref } from "vue"
import { doEncrypt } from '@/utils'
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import { CacheWord } from "@/constants/cacheKey";
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const roleList = ref([])
const dataFormRef = ref(null)

const data = {
  id: null,
  username: '',
  password: '',
  confirmPassword: '',
  roleIdList: [],
  status: 0
}

const dataForm = reactive({ ...data })

const validatePassword = (rule, value, callback)=> {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"))
  }
  callback();
};
const validateConfirmPassword = (rule, value, callback) => {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"))
  }
  if (dataForm.password !== value) {
    return callback(new Error("确认密码与密码输入不一致"))
  }
  callback();
}
const dataRule = ref({
  username: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
});

const init = (id) => {
  visible.value = true
  dataForm.id = id

  // 重置表单数据
  dataFormRef.value?.resetFields()

  Promise.all([
    getRoleList()
  ]).then(() => {
    if (id) {
      getInfo()
    }
  })
}

// 获取角色列表
const getRoleList = () => {
  baseService.get("/sys/role/select").then(({ data }) => {
    if (data && data.code === 0) {
      roleList.value = data.result
    } else {
      ElMessage.error(data.message)
    }
  })
}

// 获取信息
const getInfo = () => {
  baseService.get(`/sys/user/info/${dataForm.id}`).then(({ data }) => {
    if (data && data.code === 0) {
      Object.assign(dataForm, data.result)
    } else {
      ElMessage.error(data.message)
    }
  })
}

const build = () => {
  let param = {
    id: dataForm.id,
    username: dataForm.username,
    roleIdList: dataForm.roleIdList,
    status: dataForm.status
  }
  if (dataForm.password) {
    param.password = doEncrypt(dataForm.password, CacheWord)
  }
  return param
}

const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      let param = build()
      baseService.post(`/sys/user/${dataForm.id ? 'update' : 'save'}`, param)
        .then(({ data }) => {
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
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="dataForm.username" placeholder="用户名" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="请输入密码" :maxlength="20" show-password></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.confirmPassword" type="password" placeholder="请确认密码" :maxlength="20" show-password></el-input>
      </el-form-item>
      <el-form-item prop="roleIdList" label="角色配置" class="role-list">
        <el-select v-model="dataForm.roleIdList" multiple placeholder="角色配置" :popper-options="{ modifiers: [{ name: 'computeStyles', options: { adaptive: false } }]}">
          <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false" icon="Close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.mod-sys__user {
  .role-list {
    .el-select {
      width: 100%;
    }
  }
}
</style>
