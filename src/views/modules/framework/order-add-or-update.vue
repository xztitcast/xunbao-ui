<script setup>
import { nextTick, reactive, ref } from 'vue'
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"
import ElUploadPlus from "@/components/el-upload-plus.vue"

const emit = defineEmits(["refreshDataList"])
const dataFormRef = ref(null)
const visible = ref(false)
const options = ref([])

/**
 * 元数据
 */
const data = {
  id: null,
  serialNumber: '',
  name: '',
  type: 1,
  label: [],
  cycle: 1,
  bonus: 10,
  bond: 10,
  status: 1,
  publishTime: '',
  develop: [],
  contact: '',
  url: '',
  description: ''
}

/**
 * 表单数据
 */
const dataForm = reactive({ ...data })

const rules = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  label: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  cycle: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  bonus: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  bond: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  develop: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
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
    Promise.all([getLabelList()]).then(() => {
      if(id) {
        getInfo()
      }
    })
  })
}

/**
 * 获取标签
 */
const getLabelList = () => {
  baseService.get(`/sys/label/select`).then(({ data }) => {
    if(data && data.code === 0){
      options.value = data.result
    }else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 获取表单信息
 */
const getInfo = () => {
  baseService.get(`/sys/order/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0){
      dataForm.serialNumber = data.result?.serialNumber
      dataForm.name = data.result?.name
      dataForm.label = JSON.parse(data.result?.label)
      dataForm.cycle = data.result?.cycle
      dataForm.bonus = data.result?.bonus
      dataForm.bond = data.result?.bond
      dataForm.status = data.result?.status
      dataForm.type = data.result?.type
      dataForm.publishTime = data.result?.publishTime
      dataForm.develop = JSON.parse(data.result?.develop)
      dataForm.contact = data.result?.contact
      dataForm.url = data.result?.url
      dataForm.description = data.result?.description
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
    if(valid) {
      baseService.post(`/sys/order/${dataForm.id ? 'update' : 'save'}`, {
        "id": dataForm.id,
        "url": dataForm.url,
        "type": dataForm.type,
        "name": dataForm.name,
        "bond": dataForm.bond,
        "cycle": dataForm.cycle,
        "bonus": dataForm.bonus,
        "status": dataForm.status,
        "description":dataForm.description,
        "publishTime": dataForm.publishTime,
        "label": JSON.stringify(dataForm.label),
        "develop": JSON.stringify(dataForm.develop)
      }).then(({ data }) => {
        if(data && data.code === 0) {
          ElMessage.success({
            message: "成功",
            duration: 500,
            onClose: () => {
              visible.value = false;
              emit("refreshDataList");
            }
          })
        }else {
          ElMessage.error(data.message)
        }
      })
    }
  })
}, 3000, { 'leading': true, 'trailing': false })

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
      <el-form-item prop="type" label="类型">
        <el-select v-model="dataForm.type" placeholder="请选择类型">
          <el-option label="需求" :value="1"></el-option>
          <el-option label="BUG" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="项目状态">
        <el-tag v-if="!dataForm.id" type="info">待提交</el-tag>
        <el-tag v-else-if="dataForm.status === 0" type="danger">审核失败</el-tag>
        <el-tag v-else-if="dataForm.status === 1" type="warning">待审核</el-tag>
        <el-tag v-else-if="dataForm.status === 2" type="success">审核成功</el-tag>
        <el-tag v-else-if="dataForm.status === 3" type="primary">待发布</el-tag>
        <el-tag v-else-if="dataForm.status === 4" type="warning">已发布</el-tag>
        <el-tag v-else-if="dataForm.status === 5" type="info">进行中</el-tag>
        <el-tag v-else-if="dataForm.status === 6" type="info">已结束</el-tag>
        <el-tag v-else size="small" type="danger">异常</el-tag>
      </el-form-item>
      <el-form-item prop="label" label="标签">
        <el-select v-model="dataForm.label" multiple>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="cycle" label="周期(小时)">
        <el-input-number v-model="dataForm.cycle" :max="10000000" placeholder="选择周期"></el-input-number>
      </el-form-item>
      <el-form-item prop="bonus" label="研发奖励(元)">
        <el-input-number v-model="dataForm.bonus" :precision="2" :step="0.1" :max="10000000" placeholder="请输入预算奖励"></el-input-number>
      </el-form-item>
      <el-form-item prop="bond" label="研发保证金(元)" v-show="dataForm.hasBond === 0">
        <el-input-number v-model="dataForm.bond" :precision="2" :step="0.1" :max="10000000" placeholder="请输入预算奖励"></el-input-number>
      </el-form-item>
      <el-form-item prop="publishTime" label="发布时间">
        <el-date-picker v-model="dataForm.publishTime" type="datetime" disabled/>
      </el-form-item>
      <el-form-item prop="contact" label="联系方式">
        <el-upload-plus v-model="dataForm.contact" multiple></el-upload-plus>
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