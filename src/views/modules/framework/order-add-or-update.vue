<script setup>
import { nextTick, reactive, ref } from 'vue'
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"
import ElUploadPlus from "@/components/el-upload-plus.vue"

const emit = defineEmits(["refreshDataList"])
const dataFormRef = ref(null)
const visible = ref(false)

/**
 * 元数据
 */
const data = {
  id: null,
  serialNumber: '',
  name: '',
  cycle: 1,
  bonus: 10,
  bond: 10,
  hasBond: 0,
  status: 1,
  publishTime: '',
  develop: [],
  url: '',
  description: ''
}

/**
 * 表单数据
 */
const dataForm = reactive({ ...data })

const rules = ref({
  name:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  cycle:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  bonus:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  hasBond:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  develop:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  description:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
})

/**
 * 初始化
 */
 const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  dataForm.id = id

  nextTick(() => { 
    Promise.all([

    ]).then(() => {
      if(id) {
        getInfo()
      }
    })
  })
}

/**
 * 表单提交
 */
const dataFormSubmitHandle = () => {
}

defineExpose({ init })
</script>

<template>
  <el-dialog v-model="visible" :title="dataForm.id ? '修改' : '新增'" append-to-body>
    <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
      <el-form-item label="任务编号">
        <el-input v-model="dataForm.serialNumber" placeholder="任务编号自动生成" disabled></el-input>
      </el-form-item>
      <el-form-item prop="name" label="任务名称">
        <el-input v-model="dataForm.name" type="text" placeholder="请输入任务名称(限制50字)" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item prop="status" label="项目状态">
        <el-tag v-if="!dataForm.id" type="warning">待提交</el-tag>
        <el-tag v-else-if="dataForm.status === 0" type="warning">审核失败</el-tag>
        <el-tag v-else-if="dataForm.status === 1" type="warning">待审核</el-tag>
        <el-tag v-else-if="dataForm.status === 2" type="warning">审核成功</el-tag>
        <el-tag v-else-if="dataForm.status === 3" type="warning">待发布</el-tag>
        <el-tag v-else-if="dataForm.status === 4" type="warning">已发布</el-tag>
        <el-tag v-else-if="dataForm.status === 5" type="warning">已结束</el-tag>
        <el-tag v-else size="small" type="warning">异常</el-tag>
      </el-form-item>
      <el-form-item prop="cycle" label="周期(小时)">
        <el-input-number v-model="dataForm.cycle" :max="10000000" placeholder="选择周期"></el-input-number>
      </el-form-item>
      <el-form-item prop="bonus" label="研发奖励(元)">
        <el-input-number v-model="dataForm.bonus" :precision="2" :step="0.1" :max="10000000" placeholder="请输入预算奖励"></el-input-number>
      </el-form-item>
      <el-form-item prop="hasBond" label="是否免保证金">
        <el-radio-group v-model="dataForm.hasBond" size="small">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="bond" label="研发保证金(元)" v-show="dataForm.hasBond === 0">
        <el-input-number v-model="dataForm.bond" :precision="2" :step="0.1" :max="10000000" placeholder="请输入预算奖励"></el-input-number>
      </el-form-item>
      <el-form-item prop="publishTime" label="发布时间">
        <el-date-picker v-model="dataForm.publishTime" type="datetime" disabled/>
      </el-form-item>
      <el-form-item prop="url" label="图片链接">
        <el-upload-plus v-model="dataForm.url" multiple></el-upload-plus>
      </el-form-item>
      <el-form-item prop="develop" label="开发语言">
        <el-input-tag v-model="dataForm.develop" clearable placeholder="请输入开发语言"></el-input-tag>
      </el-form-item>
      <el-form-item prop="description" label="文案描述">
        <el-input v-model="dataForm.description" type="textarea" placeholder="请输入文案描述" :rows="10" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" icon="Close">取消</el-button>
        <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">

</style>