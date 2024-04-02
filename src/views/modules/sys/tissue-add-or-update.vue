<script setup>
import { nextTick, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const emit = defineEmits(["refreshDataList"])
const visible = ref(false)
const tissueList = ref([])
const dataFormRef = ref()
const tissueListTree = ref()
const tissueListPopover = ref()
const regionTreeListRef = ref()
const regionTreeList = ref([])

/**
 * 元数据
 */
const data = {
  id: null,
  parentId: 0,
  parentName: "",
  name: '',
  serials: '',
  des:'',
  logos: '',
  phones: '',
  tname: '',
  tphone:'',
  address: '',
  signtime: '',
  expiretime: '',
  selectKeys: []
}

/**
 * 表单数据
 */
const dataForm = reactive({ ...data })

/**
 * 日期校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */
const validateDateTime = (rule, value, callback) => {
  if(dataForm.signtime && dataForm.signtime > value){
    return callback(new Error("签约时间不能大于结束时间"))
  }
  callback()
}

/**
 * 表单规则
 */
const dataRule = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  parentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  serials: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  phones: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  tname: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  tphone: [{ required: true, message: '必填项不能为!', trigger: 'blur' }],
  selectKeys: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  signtime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  expiretime: [
    { required: true, message: '必填项不能为空', trigger: 'blur' },
    { validator: validateDateTime, trigger: 'blur' }
  ]
})

/**
 * 初始化
 */
const init = (id) => {
  visible.value = true;

  // 重置表单数据
  dataFormRef.value?.resetFields()

  dataForm.id = id
  dataForm.parentName = "总机构"

  nextTick(() => { 
    Promise.all([
      getRegion(),
      getTissueList()
    ]).then(() => {
      if(id) {
        getInfo()
      }
    })
  })

}

const getInfo = () => {
  baseService.get(`/sys/tissue/info/${dataForm.id}`).then(({ data }) => {
    if(data && data.code === 0){
      dataForm.name = data.result?.name
      dataForm.parentId = data.result.parentId || 0
      dataForm.serials = data.result?.serials
      dataForm.des = data.result?.des
      dataForm.logos = data.result?.logos
      dataForm.phones = data.result?.phones
      dataForm.tname = data.result?.tname
      dataForm.tphone = data.result?.tphone
      dataForm.address = data.result?.address
      dataForm.signtime = data.result?.signtime
      dataForm.expiretime = data.result?.expiretime
      dataForm.selectKeys = [data.result?.pid, data.result?.cid, data.result?.aid]
      if (dataForm.parentId === 0) {
        return tissueListTreeSetCurrentNode()
      }
      tissueListTree.value.setCurrentKey(dataForm.parentId)
    }else{
      ElMessage.error(data.message)
    }
  })
}

/**
 * 获取区域
 */
const getRegion = () => {
  baseService.get('/sys/region/select').then(({ data }) => {
    if(data && data.code === 0){
      regionTreeList.value = data.result
    }else{
      ElMessage.error(data.message)
    }
  })
}

// 获取菜单列表
const getTissueList = () => {
  baseService.get('/sys/tissue/list').then(({ data }) => {
    if (data && data.code === 0) {
      tissueList.value = data.result || []
    } else {
      ElMessage.error(data.message)
    }
  })
}

// 上级机构树, 选中
const tissueListTreeCurrentChangeHandle = (data) => {
  dataForm.parentId = data.id
  dataForm.parentName = data.name
  tissueListPopover.value.hide()
}

// 菜单树设置当前选中节点
const tissueListTreeSetCurrentNode = () => {
  dataForm.parentId = 0;
  dataForm.parentName = "总机构"
}

/**
 * 表单提交
 */
const dataFormSubmitHandle = debounce(() => {
  dataFormRef.value.validate((valid) => {
    if(valid) {
      baseService.post(`/sys/tissue/${dataForm.id ? 'update' : 'save'}`, {
        "id": dataForm.id,
        "parentId": dataForm.parentId,
        "name": dataForm.name,
        "serials": dataForm.serials,
        "des": dataForm.des,
        "logos": dataForm.logos,
        "phones": dataForm.phones,
        "tname": dataForm.tname,
        "tphone": dataForm.tphone,
        "pid": dataForm.selectKeys[0],
        "cid": dataForm.selectKeys[1],
        "aid": dataForm.selectKeys[2],
        "address": dataForm.address,
        "signtime": dataForm.signtime,
        "expiretime": dataForm.expiretime,
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
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="150px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="serials">
        <el-input v-model="dataForm.serials" placeholder="请输入编号" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="简称" prop="des">
        <el-input v-model="dataForm.des" placeholder="请输入简称" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="Logo" prop="logos">
        <el-input v-model="dataForm.logos" placeholder="请输入LOGO" :maxlength="120"></el-input>
      </el-form-item>
      <el-form-item label="服务电话" prop="phones">
        <el-input v-model="dataForm.phones" placeholder="请输入服务电话" :maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="tname">
        <el-input v-model="dataForm.tname" placeholder="请输入负责人姓名" :maxlength="8"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话" prop="tphone">
        <el-input v-model="dataForm.tphone" placeholder="请输入负责人电话" :maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="上级机构" prop="parentName" class="menu-list">
        <el-popover ref="tissueListPopover" placement="bottom-start" trigger="click" :width="400" popper-class="popover-pop">
          <template #reference>
            <el-input v-model="dataForm.parentName" :readonly="true" placeholder="上级机构">
              <template #suffix>
                <el-icon v-if="dataForm.parentId !== 0" @click.stop="tissueListTreeSetCurrentNode()" class="el-input__icon"><circle-close/></el-icon>
              </template>
            </el-input>
          </template>
          <div class="popover-pop-body">
            <el-tree :data="tissueList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="tissueListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="tissueListTreeCurrentChangeHandle"> </el-tree>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item label="机构位置" prop="selectKeys">
        <el-cascader ref="regionTreeListRef" :options="regionTreeList" v-model="dataForm.selectKeys" style="width: 240px" clearable></el-cascader>
        <el-tag type="warning" style="margin-left: 40px">省/市/区、县</el-tag>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="请输入详细地址" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="签约时间" prop="signtime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.signtime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            clearable>
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="到期时间" prop="expiretime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.expiretime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            clearable>
          </el-date-picker>
        </div>
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
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__tissue {
  .menu-list{
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}  
</style>