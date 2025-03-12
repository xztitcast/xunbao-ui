<script setup>
import { reactive, ref, nextTick } from 'vue'
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"
import ElUploadPlus from "@/components/el-upload-plus.vue"

const emit = defineEmits(["refreshDataList"])
const dataFormRef = ref(null)
const visible = ref(false)
const activeIdx = ref(1)

/**
 * 元数据
 */
const data = {
  id: null,
  name: null,
  url: '',
  backgroundImage: '',
  posterImage: '',
  total: 0,
  dateArray: [],
  status: 2,
  description: ''
}

/**
 * 表单数据
 */
const dataForm = reactive({ ...data })

const rules = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  backgroundImage: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  total: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  dateArray: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})


/**
 * 初始化
 */
const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  dataForm.id = id

  nextTick(() => {if(id) getInfo()});
}

/**
 * 获取表单信息
 */
const getInfo = () => {
  baseService.get(`/sys/activity/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0){
      dataForm.name = data.result?.name
      dataForm.url = data.result?.url
      dataForm.backgroundImage = data.result?.backgroundImage
      dataForm.posterImage = data.result?.posterImage
      dataForm.total = data.result?.total
      dataForm.dateArray = [data.result.startTime, data.result.endTime]
      dataForm.status = data.result?.status
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
        "name": dataForm.name,
        "backgroundImage": dataForm.backgroundImage,
        "posterImage": dataForm.posterImage,
        "total": dataForm.total,
        "startTime": dataForm.dateArray[0],
        "endTime": dataForm.dateArray[1],
        "status": dataForm.status,
        "description": dataForm.description
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
    <el-steps :active="activeIdx" finish-status="success">
      <el-step />
      <el-step />
      <el-step />
    </el-steps>
    <el-card style="margin-top: 20px;" v-show="activeIdx === 1">
      <template #header><div class="card-header"><span>活动信息</span></div></template>
      <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
        <el-form-item prop="name" label="活动名称">
          <el-input v-model="dataForm.userId" type="text" placeholder="请输入活动名称" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="轮播图">
          <el-upload-plus v-model="dataForm.url"></el-upload-plus>
        </el-form-item>
        <el-form-item prop="backgroundImage" label="背景图">
          <el-upload-plus v-model="dataForm.backgroundImage"></el-upload-plus>
        </el-form-item>
        <el-form-item prop="posterImage" label="分享海报">
          <el-upload-plus v-model="dataForm.posterImage"></el-upload-plus>
        </el-form-item>
        <el-form-item prop="total" label="总库存">
          <el-input-number v-model="dataForm.total" :min="-1" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="dataForm.status" placeholder="请选择活动状态" style="width: 240px">
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dateArray" label="活动时间">
          <div class="block">
            <el-date-picker
            v-model="dataForm.dateArray"
            type="datetimerange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD HH:mm:ss"
            time-format="A hh:mm:ss"/>
          </div>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="dataForm.description" :rows="12" type="textarea" placeholder="请输入活动描述"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;" v-show="activeIdx === 2">
      <template #header><div class="card-header"><span>活动信息</span></div></template>
      <el-form :model="dataForm" :rules="rules" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
        <el-form-item prop="name" label="活动名称">
          <el-input v-model="dataForm.userId" type="text" placeholder="请输入活动名称" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="轮播图">
          <el-upload-plus v-model="dataForm.url"></el-upload-plus>
        </el-form-item>
        <el-form-item prop="backgroundImage" label="背景图">
          <el-upload-plus v-model="dataForm.backgroundImage"></el-upload-plus>
        </el-form-item>
        <el-form-item prop="posterImage" label="分享海报">
          <el-upload-plus v-model="dataForm.posterImage"></el-upload-plus>
        </el-form-item>
        <el-form-item prop="total" label="总库存">
          <el-input-number v-model="dataForm.total" :min="-1" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="dataForm.status" placeholder="请选择活动状态" style="width: 240px">
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dateArray" label="活动时间">
          <div class="block">
            <el-date-picker
            v-model="dataForm.dateArray"
            type="datetimerange"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY-MM-DD HH:mm:ss"
            time-format="A hh:mm:ss"/>
          </div>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="dataForm.description" :rows="12" type="textarea" placeholder="请输入活动描述"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <span v-if="activeIdx <= 2">
          <el-button @click="activeIdx = activeIdx - 1" icon="DArrowLeft" :disabled="activeIdx === 1">上一步</el-button>
          <el-button @click="activeIdx = activeIdx + 1" icon="DArrowRight">下一步</el-button>
        </span>
        <span v-else>
          <el-button @click="visible = false" icon="Close">取消</el-button>
          <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
        </span>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">

</style>