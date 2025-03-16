<script setup>
import { watch, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { getIconList } from "@/utils"
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const menuList = ref([])
const iconList = ref([])
const dataFormRef = ref()
const menuListTree = ref()
const menuListPopover = ref()
const iconListPopover = ref()
const typeList = ref(['目录', '菜单', '按钮'])

const data = {
  id: null,
  type: 0,
  name: "",
  parentId: 0,
  parentName: "",
  url: "",
  perms: "",
  sorted: 0,
  icon: ""
}

const dataForm = reactive({ ...data })

const rules = reactive({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  parentName: [{ required: true, message: "必填项不能为空", trigger: "change" }]
})

watch(() => dataForm.type, () => {
  // 重置表单数据
  dataFormRef.value.clearValidate()
})

const init = (id) => {
  visible.value = true

  // 重置表单数据
  dataFormRef.value?.resetFields()

  //数据回显后重新赋值
  Object.assign(dataForm, data)

  iconList.value = getIconList()

  dataForm.id = id
  dataForm.parentName = "一级菜单"

  Promise.all([
    getMenuList()
  ]).then(() => {
    if (id) {
      getInfo()
    }
  })
}

// 获取菜单列表
const getMenuList = () => {
  baseService.get('/sys/menu/select').then(({ data }) => {
    if (data && data.code === 0) {
      menuList.value = data.result
    } else {
      ElMessage.error(data.message)
    }
  })
}

  // 获取信息
const getInfo = () => {
  baseService.get(`/sys/menu/info/${dataForm.id}`).then(({ data }) => {
    if (data && data.code === 0) {
      Object.assign(dataForm, data.result)
      if (dataForm.parentId === 0) {
        return menuListTreeSetCurrentNode()
      }
      menuListTree.value.setCurrentKey(dataForm.parentId)
    } else {
      ElMessage.error(data.message)
    }
  })
}
// 上级菜单树, 选中
const menuListTreeCurrentChangeHandle = (data) => {
  dataForm.parentId = data.id
  dataForm.parentName = data.name
  menuListPopover.value.hide()
}
// 菜单树设置当前选中节点
const menuListTreeSetCurrentNode = () => {
  dataForm.parentId = 0
  dataForm.parentName = "一级菜单"
}
// 图标, 选中
const iconListCurrentChangeHandle = (icon) => {
  dataForm.icon = icon
  iconListPopover.value.hide()
}

// 表单提交
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      baseService.post(`/sys/menu/${dataForm.id ? 'update' : 'save'}`, dataForm)
        .then(({ data }) => {
          if (data && data.code === 0) {
            ElMessage.success({
              message: "成功",
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
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="type" label="类型" size="small">
        <el-radio-group v-model="dataForm.type" :disabled="!!dataForm.id" id="type">
          <el-radio v-for="(type, index) in typeList" :value="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" :label="typeList[dataForm.type] + '名称'">
        <el-input v-model="dataForm.name" :placeholder="'请输入' + typeList[dataForm.type] + '名称'" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上级菜单" class="menu-list">
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" :width="400" popper-class="popover-pop">
          <template #reference>
            <el-input v-model="dataForm.parentName" :readonly="true" placeholder="上级菜单">
              <template #suffix>
                <el-icon v-if="dataForm.parentId !== 0" @click.stop="menuListTreeSetCurrentNode()" class="el-input__icon"><circle-close/></el-icon>
              </template>
            </el-input>
          </template>
          <div class="popover-pop-body">
            <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="menuListTree" :highlight-current="true" :expand-on-click-node="false" accordion @node-click="menuListTreeCurrentChangeHandle"></el-tree>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" prop="url" label="路由" :rules="[{
        required: true,
        message: '必填项不能为空',
        trigger: 'blur'}]">
        <el-input v-model="dataForm.url" placeholder="请输入路由" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 2" prop="perms" label="授权标识" :rules="[{
        required: true,
        message: '必填项不能为空',
        trigger: 'blur'}]">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔，如：sys:menu:save, sys:menu:update" :maxlength="255"></el-input>
      </el-form-item>
      <el-form-item prop="icon" label="图标" class="icon-list">
        <el-popover ref="iconListPopover" placement="top-start" trigger="click" popper-class="popover-pop mod-sys__menu-icon-popover">
          <template v-slot:reference><el-input v-model="dataForm.icon" :readonly="true" placeholder="图标"></el-input></template>
          <div class="mod-sys__menu-icon-inner">
            <div class="mod-sys__menu-icon-list">
              <el-button v-for="(item, index) in iconList" :key="index" @click="iconListCurrentChangeHandle(item)" :class="{ 'is-active': dataForm.icon === item }">
                <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${item}`"></use></svg>
              </el-button>
            </div>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="sorted" label="排序">
        <el-input-number v-model="dataForm.sorted" controls-position="right" :min="0" :max="999" :step="1"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false;" icon="Close">取消</el-button>
      <el-button @click="dataFormSubmitHandle()" type="primary" icon="Check">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
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
