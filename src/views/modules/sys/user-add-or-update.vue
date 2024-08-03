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
const tenantList = ref([])
const dataFormRef = ref()
const tenantListTree = ref()
const tenantListPopover = ref()

const data = {
  id: null,
  username: '',
  password: '',
  confirmPassword: '',
  roleIdList: [],
  status: 0,
  tenantId: 0,
  tenantName: ''
}

const dataForm = reactive({ ...data })

const validatePassword = (rule, value, callback)=> {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"))
  }
  callback()
};
const validateConfirmPassword = (rule, value, callback) => {
  if (!dataForm.id && !/\S/.test(value)) {
    return callback(new Error("必填项不能为空"))
  }
  if (dataForm.password !== value) {
    return callback(new Error("确认密码与密码输入不一致"))
  }
  callback()
}
const dataRule = ref({
  username: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
  tenantName: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
})

const init = (id) => {
  visible.value = true
  dataForm.id = id

  // 重置表单数据
  dataFormRef.value?.resetFields()

  Promise.all([
    getRoleList(),
    getTenantList()
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

const getTenantList = () => {
  baseService.get("/sys/tenant/list").then(({ data }) => {
    if (data && data.code === 0) {
      tenantList.value = data.result
    } else {
      ElMessage.error(data.message)
    }
  })
}

const tenantListTreeSetCurrentNode = () => {
  dataForm.tenantId = 0
  dataForm.tenantName = ''
}

const tenantListTreeCurrentChangeHandle = (data) => {
  dataForm.tenantId = data.id
  dataForm.tenantName = data.name
  tenantListPopover.value.hide()
}

const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      baseService.post(`/sys/user/${dataForm.id ? 'update' : 'save'}`, {
        id: dataForm.id,
        username: dataForm.username,
        status: dataForm.status,
        tenantId: dataForm.tenantId,
        tenantName: dataForm.tenantName,
        roleIdList: dataForm.roleIdList,
        password: doEncrypt(dataForm.password, CacheWord)
      })
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
      <el-form-item prop="tenantName" label="关联租户" class="tree-list">
        <el-popover ref="tenantListPopover" placement="bottom-start" trigger="click" :width="400" popper-class="popover-pop">
          <template #reference>
            <el-input v-model="dataForm.tenantName" :readonly="true" placeholder="租户名称" :validate-event="false">
              <template #suffix>
                <el-icon v-if="dataForm.tenantId !== 0" @click.stop="tenantListTreeSetCurrentNode()" class="el-input__icon"></el-icon>
              </template>
            </el-input>
          </template>
          <div class="popover-pop-body">
            <el-tree :data="tenantList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="tenantListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="tenantListTreeCurrentChangeHandle"></el-tree>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="roleIdList" label="角色配置" class="select-list">
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
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__user {
  .select-list {
    .el-select {
      width: 100%;
    }
  }
  &-icon-popover {
    width: 458px !important;
    overflow-y: hidden !important;
  }
  &-icon-inner {
    width: 100%;
    max-height: 260px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px !important;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
