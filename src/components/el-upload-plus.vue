<script setup>
import {ref,reactive} from "vue"
import { getToken } from "@/utils/cache";

const visible = ref(false)
const fileList = ref([])

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handleAvatarSuccess = (response, uploadFile) => {
  console.log(URL.createObjectURL(uploadFile.raw))
  console.log(fileList.value)
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('The picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('The picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const props = defineProps({
  multiple:{
    type:Boolean,
    default: false
  },
  mode: {
    type: String,
    default: "image"
  },
  remark:{
    type:String,
    default:"请上传大小不超过2MB单张图片"
  }
})
</script>

<template>
  <div>
    <el-upload
      name="files"
      v-model="fileList"
      :limit="multiple ? 9 : 1"
      list-type="picture-card"
      :action="`/sys/upload/${mode}`"
      :headers="{ 'token': getToken() }"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview">
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip text-red">
          {{ remark }}
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="visible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style lang="scss">
.text-red {
  color: red;
}
</style>
