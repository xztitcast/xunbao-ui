<script setup>
import {ref,reactive} from "vue"

const visible = ref(false)
const fileList = ref([])

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const props = defineProps({
  url:{
    type:String
  },
  multiple:{
    type:Boolean,
    default: false
  },
  remark:{
    type:String,
    default:""
  }
})
</script>

<template>
  <div>
    <el-upload
      v-model="fileList"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="visible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style lang="scss">
</style>
