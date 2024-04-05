<script setup>
import { nextTick, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const menuList = ref([])
const dataFormRef = ref(null)
const menuListTree = ref(null)

const data = {
  id: null,
  name: '',
  menuIdList: [],
  remark: ''
}

const dataForm = reactive({ ...data })

const dataRule = ref({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
})

const init = (id) => {
  visible.value = true;
  dataForm.id = id;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  nextTick(() => {

    menuListTree.value?.setCheckedKeys([])

    Promise.all([
      getMenuList()
    ]).then(() => {
      if (id) {
        getInfo()
      }
    })
  })
}

// 获取菜单列表
const getMenuList = () => {
  //不加return会导致getInfo()数据加载的时机延迟无法选中
  return baseService.get("/sys/menu/list").then(({ data }) => {
    if (data && data.code === 0) {
      menuList.value = data.result || [];
    } else {
      ElMessage.error(data.message)
    }
  })
}

// 获取信息
const getInfo = (id) => {
  baseService.get(`/sys/role/info/${dataForm.id}`).then(({ data }) => {
    if (data && data.code === 0) {
      Object.assign(dataForm, data.result);
      dataForm.menuIdList.forEach((item) => menuListTree.value.setChecked(item, true))
    } else {
      ElMessage.error(data.message)
    }
  })
}

//表单提交
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      dataForm.menuIdList = [...menuListTree.value.getHalfCheckedKeys(), ...menuListTree.value.getCheckedKeys()]
      baseService.post(`/sys/role/${dataForm.id ? 'update' : 'save'}`, dataForm)
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
      <el-form-item prop="name" label="名称">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="small" label="菜单授权">
        <el-tree
          :data="menuList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          ref="menuListTree"
          accordion
          show-checkbox>
        </el-tree>
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
