<script setup>
import { reactive, ref, nextTick } from 'vue'
import { dateFormat } from '@/utils'
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"
import ElUploadPlus from "@/components/el-upload-plus.vue"

const emit = defineEmits(["refreshDataList"])
const dataFormRef = ref([])
const visible = ref(false)
const activeIdx = ref(0)
const itemList = ref([])
const ruleList = ref([])

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
  fixed: [1],
  status: 0,
  description: ''
}

const rule = {
  userRule: {id: null, ruleId: null, ruleType: 1},
  cycleRule: {id: null, ruleId: null, ruleType: 2},
  starRule: {id: null, ruleId: null, ruleType: 3},
}

const item = {
  id: null,
  itemId: null
}

/**
 * 表单数据
 */
const dataForm = reactive({ ...data })

const ruleForm = reactive({ ...rule })

const itemForm = reactive({ ...item })

const rules = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  url: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  backgroundImage: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  total: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  dateArray: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  fixed: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  itemId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

/**
 * 设置动态ref
 * @param el 
 * @param index 
 */
const setter = (el, index) => {
  dataFormRef.value[index] = el
}

/**
 * 初始化
 */
const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value.forEach(item => item.resetFields())

  Object.assign(dataForm, data)

  Object.assign(ruleForm, rule);

  Object.assign(itemForm, item);

  dataForm.id = id

  activeIdx.value = 0

  nextTick(() => {
    Promise.all([
      getItemList(),
      getRuleList()
    ]).then(() => {
      if(id) {
        getInfo()
      }
    })
  })
}

/**
 * 获取表单信息
 */
const getInfo = () => {
  baseService.get(`/sys/activity/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0){
      dataForm.name = data.result?.name
      dataForm.url = data.result?.url
      dataForm.total = data.result?.total
      dataForm.status = data.result?.status
      dataForm.posterImage = data.result?.posterImage
      dataForm.description = data.result?.description
      dataForm.fixed = JSON.parse(data.result?.fixed)
      dataForm.backgroundImage = data.result?.backgroundImage
      dataForm.dateArray = [data.result.startTime, data.result.endTime]
    }else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 获取规则信息
 * 用于回显
 */
const getRuleInfo = () => {
  baseService.get('/sys/activity/rule/info', {
    activityId: dataForm.id
  }).then(({ data }) => {
    if(data && data.code === 0) {
      var result = data.result
      if(result) {
        for(var key in result) {
          ruleForm[key].id = result[key].id
          ruleForm[key].ruleId = result[key].ruleId
          ruleForm[key].activityId = result[key].activityId
        }
      }
    }
  })
}

const getItemInfo = () => {
  baseService.get('/sys/activity/item/info', {
    activityId: dataForm.id
  }).then(({ data }) => {
    if(data && data.code === 0) {
      itemForm.id = data.result?.id
      itemForm.itemId = data.result?.itemId
      itemForm.activityId = data.result?.activityId
    }
  })
}

const funcArray = [getInfo, getRuleInfo, getItemInfo]

/**
 * 获取奖品列表
 */
const getItemList = () => {
  baseService.get('/sys/item/select').then(({ data }) => {
    if(data && data.code === 0) {
      itemList.value = data.result || []
    }else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 获取规则列表
 * [{ field: "userRule", ruleName: "新用户规则", ruleType: 1, options:[{ id: 1, name: "新用户7天"}]},
    { field: "cycleRule", ruleName: "周期规则", ruleType: 2, options:[{ id: 1, name: "每天一次"}]},
    { field: "starRule", ruleName: "星级规则", ruleType: 3, options:[{ id: 1, name: "一星参与"}]}]
 */
const getRuleList = () => {
  baseService.get('/sys/activity/rule/select').then(({ data }) => {
    if(data && data.code === 0) {
      ruleList.value = data.result || []
    }else {
      ElMessage.error(data.message)
    }
  })
}

/**
 * 下一步操作
 */
const doNextStepHandle = (index) => {
  dataFormRef.value[activeIdx.value].validate((valid) => {
    if(valid) {
      activeIdx.value += index
      funcArray[activeIdx.value]()
    }
  })
}

/**
 * 表单提交
 */
const dataFormSubmitHandle = debounce(() => {
  baseService.post(`/sys/activity/${dataForm.id ? 'update' : 'save'}`, {
    "id": dataForm.id,
    "url": dataForm.url,
    "name": dataForm.name,
    "backgroundImage": dataForm.backgroundImage,
    "posterImage": dataForm.posterImage,
    "total": dataForm.total,
    "startTime": dateFormat(dataForm.dateArray[0]),
    "endTime": dateFormat(dataForm.dateArray[1]),
    "status": dataForm.status,
    "description": dataForm.description,
    "fixed": JSON.stringify(dataForm.fixed)
  }).then(({ data }) => {
    if(data && data.code === 0) {
      Promise.all([
        ruleFormSubmitHandle(data.result),
        itemFormSubmitHandle(data.result)
      ]).then(([rule, item]) => {
          if(rule && item) {
            ElMessage.success({
              message: '操作成功',
              duration: 500,
              onClose: () => {
                visible.value = false
                emit("refreshDataList")
              }
            })
          }else {
            ElMessage.error('操作失败')
          }
      })
    }else {
      ElMessage.error(data.message)
    }
  })
}, 3000, { 'leading': true, 'trailing': false })

/**
 * 规则表单提交
 */
const ruleFormSubmitHandle = (id) => {
  var rules = []
  Object.values(ruleForm).forEach(value => {
    value.activityId = id || dataForm.id
    rules.push(value)
  })
  return baseService.post(`/sys/activity/rule/${dataForm.id ? 'update' : 'save'}`, rules).then(({ data }) => {
    return data && data.code === 0
  })
}

/**
 * 奖励表单提交
 */
const itemFormSubmitHandle = (id) => {
  return baseService.post(`/sys/activity/item/${itemForm.id ? 'update' : 'save'}`, {
    "activityId": id || dataForm.id,
    ...itemForm
  }).then(({ data }) => {
    return data && data.code === 0
  })
}

defineExpose({ init })
</script>

<template>
  <el-dialog v-model="visible" :title="dataForm.id ? '修改' : '新增'" append-to-body>
    <el-steps :active="activeIdx" finish-status="success">
      <el-step />
      <el-step />
      <el-step />
    </el-steps>
    <el-card style="margin-top: 20px;" v-show="activeIdx === 0">
      <template #header><div class="card-header"><span>活动信息</span></div></template>
      <el-form :model="dataForm" :rules="rules" :ref="el => setter(el, 0)" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
        <el-form-item prop="name" label="活动名称">
          <el-input v-model="dataForm.name" type="text" placeholder="请输入活动名称" :maxlength="32"></el-input>
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
          <el-select v-model="dataForm.status" placeholder="请选择活动状态" style="width: 240px" clearable>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
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
              value-format="YYYY-MM-DD HH:mm:ss"
              time-format="A hh:mm:ss"/>
          </div>
        </el-form-item>
        <el-form-item prop="fixed" label="固定时间">
          <el-checkbox-group v-model="dataForm.fixed">
            <el-checkbox-button :value="1">周一</el-checkbox-button>
            <el-checkbox-button :value="2">周二</el-checkbox-button>
            <el-checkbox-button :value="3">周三</el-checkbox-button>
            <el-checkbox-button :value="4">周四</el-checkbox-button>
            <el-checkbox-button :value="5">周五</el-checkbox-button>
            <el-checkbox-button :value="6">周六</el-checkbox-button>
            <el-checkbox-button :value="7">周天</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input v-model="dataForm.description" :rows="12" type="textarea" placeholder="请输入活动描述"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;" v-show="activeIdx === 1">
      <template #header><div class="card-header"><span>活动规则</span></div></template>
      <el-form :model="ruleForm" :ref="el => setter(el, 1)" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
        <el-form-item v-for="item in ruleList" :key="item.ruleType" :prop="item.field + '.ruleId'" :label="item.ruleName">
          <el-select v-model="ruleForm[item.field].ruleId" placeholder="请选择活动规则" style="width: 240px">
            <el-option v-for="value in item.options" :key="value.id" :label="value.name" :value="value.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;" v-show="activeIdx === 2">
      <template #header><div class="card-header"><span>活动奖励</span></div></template>
      <el-form :model="itemForm" :rules="rules" :ref="el => setter(el, 2)" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
        <el-form-item prop="itemId" label="奖励名称">
          <el-select v-model="itemForm.itemId" placeholder="请选择活动奖励" style="width: 240px">
            <el-option v-for="item in itemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <span>
          <el-button @click="doNextStepHandle(-1)" icon="DArrowLeft" :disabled="activeIdx === 0">上一步</el-button>
          <el-button @click="doNextStepHandle(1)" icon="DArrowRight" v-if="activeIdx <= 1">下一步</el-button>
          <el-button @click="visible = false" icon="Close" v-if="activeIdx === 2">取消</el-button>
          <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check" v-if="activeIdx === 2">确定</el-button>
        </span>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">

</style>