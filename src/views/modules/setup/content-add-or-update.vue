<script setup>
import { nextTick, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

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


</script>

<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="text1" label="内容1">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="text2" label="内容2">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item prop="text3" label="内容3">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="text4" label="内容4">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="text5" label="内容5">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="url" label="链接">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="pic" label="图片">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="pic2" label="图片2">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
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
