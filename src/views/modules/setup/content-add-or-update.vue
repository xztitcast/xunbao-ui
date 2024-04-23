<script setup>
import { nextTick, reactive, ref } from "vue"
import debounce from 'lodash/debounce'
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"
import ElUploadPlus from "@/components/el-upload-plus.vue"

const visible = ref(false)
const contentCatList = ref([])
const contentCatTree = ref(null)

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
}

const dataFormSubmitHandle = () => {
  console.log(dataForm.pic2)
}

defineExpose({ init })
</script>

<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
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
        <el-tree
          :data="contentCatList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          ref="contentCatTree"
          accordion
          show-checkbox>
        </el-tree>
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
