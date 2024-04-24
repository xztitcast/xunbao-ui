<script setup>
import { nextTick, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"
import ElUploadPlus from "@/components/el-upload-plus.vue"

const visible = ref(false)
const dataFormRef = ref(null)
const contentCatList = ref([])
const contentCatListTree = ref(null)

const data = {
  id: null,
  cid: null,
  text1: '',
  text2: '',
  text3: '',
  text4: '',
  text5: '',
  url: '',
  pic: '',
  pic2: 'http://192.168.25.104:9000/image/20240421/ead18cb22cee4b329978033b4437748d.jpg',
}

const dataForm = reactive({ ...data })

const dataRule = ref({
  name: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
})

const init = (id) => {
  visible.value = true

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
  baseService.get('/sys/content/cat/list').then(({ data }) => {
    if (data && data.code === 0) {
      contentCatList.value = data.result
    } else {
      ElMessage.error(data.message)
    }
  })
}

// 获取信息
const getInfo = () => {
  baseService.get(`/sys/content/cat/info/${dataForm.id}`).then(({ data }) => {
    if (data && data.code === 0) {
      Object.assign(dataForm, data.result)
      if (dataForm.parentId === 0) {
        return contentCatListTreeSetCurrentNode()
      }
      contentCatListTree.value.setCurrentKey(dataForm.parentId)
    } else {
      ElMessage.error(data.message)
    }
  })
}

const contentCatListTreeSetCurrentNode = () => {

}

const contentCatListTreeCurrentChangeHandle = (data) => {
  console.log(data)
}

const dataFormSubmitHandle = () => {
  console.log(dataForm.pic2)
}

defineExpose({ init })
</script>

<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
      label-width="120px">
      <el-form-item prop="text1" label="内容1">
        <el-input v-model="dataForm.text1" placeholder="请填写内容1"></el-input>
      </el-form-item>
      <el-form-item prop="text2" label="内容2">
        <el-input v-model="dataForm.text2" placeholder="请填写内容2"></el-input>
      </el-form-item>
      <el-form-item prop="text3" label="内容3">
        <el-input v-model="dataForm.text3" placeholder="请填写内容3"></el-input>
      </el-form-item>
      <el-form-item prop="text4" label="内容4">
        <el-input v-model="dataForm.text4" placeholder="请填写内容4"></el-input>
      </el-form-item>
      <el-form-item prop="text5" label="内容5">
        <el-input v-model="dataForm.text5" placeholder="请填写内容5"></el-input>
      </el-form-item>
      <el-form-item prop="url" label="链接">
        <el-input v-model="dataForm.url" placeholder="请填写URL连接"></el-input>
      </el-form-item>
      <el-form-item prop="pic" label="图片">
        <el-upload-plus v-model="dataForm.pic" :multiple="false"></el-upload-plus>
      </el-form-item>
      <el-form-item prop="pic2" label="图片2">
        <el-upload-plus v-model="dataForm.pic2" :alt="请上传大小不超过2MB多张图片"></el-upload-plus>
      </el-form-item>
      <el-form-item size="small" label="内容分类">
        <el-popover ref="contentCatListPopover" placement="bottom-start" trigger="click" :width="400"
          popper-class="popover-pop">
          <template #reference>
            <el-input v-model="dataForm.cid" :readonly="true" placeholder="请选择内容分类">
              <template #suffix>
                <el-icon v-if="dataForm.parentId !== 0" @click.stop="contentCatListTreeSetCurrentNode()"
                  class="el-input__icon"><circle-close /></el-icon>
              </template>
            </el-input>
          </template>
          <div class="popover-pop-body">
            <el-tree :data="contentCatList" :props="{ label: 'label', children: 'children' }" node-key="id"
              ref="contentCatListTree" :highlight-current="true" :expand-on-click-node="false" accordion
              @current-change="contentCatListTreeCurrentChangeHandle"></el-tree>
          </div>
        </el-popover>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false" icon="Close">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()" icon="Check">确定</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
</style>
