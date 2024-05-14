<script setup>
import { ref, onMounted } from "vue"
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const suffixList = ref(["image/jpg", "image/jpeg", "image/png", "image/gif"])
const display = ref('inline-flex')
const visible = ref(false)
const fileList = ref([])
const imageURL = ref('')
const uploadRef = ref(null)

/**
 * 图片删除
 * @param {*} uploadFile 
 * @param {*} uploadFiles 
 */
const handleRemove = (uploadFile, uploadFiles) => {
  var item = fileList.value.map((item, index) => {
    if (item.uid === uploadFile.uid) {
      fileList.value.splice(index, 1)
      return item
    }
  })
  baseService.delete('/sys/upload/delete', {
    name: item.name,
    url: item.url
  }).then(({ data }) => {
    if (data.code === 0) {
      ElMessage.success(data.message)
    } else {
      ElMessage.error(data.message)
    }
    handleHideTextBox()
  })
}

/**
 * 上传前的检查
 * 由于自定义上传http-request属性配置后，再配置before-upload钩子函数会
 * 自动出发on-remove事件，导致控制台报错，故在handleHttpRequestUpload自定义
 * 上传函数中做校验
 * @param {*} rawFile 
 */
const beforeAvatarUpload = (rawFile) => {
  if (!suffixList.includes(rawFile.type)) {
    ElMessage.error('The picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('The picture size can not exceed 2MB!')
    return false
  }
  return true
}

/**
 * 预览图片
 * @param {*} uploadFile 
 */
const handlePictureCardPreview = (uploadFile) => {
  imageURL.value = uploadFile.url
  visible.value = true
}

/**
 * 隐藏文本框
 */
const handleHideTextBox = () => {
  if (!props.multiple && fileList.value.length > 0) {
    display.value = 'none'
  } else {
    display.value = 'inline-flex'
  }
}

/**
 * 自定义上传
 * 详情见文档
 * https://element-plus.org/zh-CN/component/upload.html API属性说明 -> http-request
 * @param {*} options 
 */
const handleHttpRequestUpload = (options) => {
  console.log(options)
  var file = options.file
  if (beforeAvatarUpload(file)) {
    var data = new FormData()
    data.append(options.filename, file)
    baseService.post('/sys/upload/save', data, {
      'Content-Type': 'multipart/form-data'
    }).then(({ data }) => {
      if (data.code === 0) {
        data.result.uid = file.uid
        fileList.value.push(data.result)
        handleHideTextBox()
        var list = fileList.value.map(item => item.url)
        emit('update:modelValue', list.join(','))
      } else {
        uploadRef.value.clearFiles()
        ElMessage.error(data.message)
      }
    })
  } else {
    uploadRef.value.clearFiles()
  }
}

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  multiple:{
    type: Boolean,
    default: false
  },
  alt:{
    type: String,
    default:"请上传大小不超过2MB单张图片"
  }
})

onMounted(() => {
  if (props.modelValue) {
    fileList.value = props.modelValue.split(',').map(item => {
      var str = item.substring(item.lastIndexOf('/') + 1)
      return {
        name: str,
        url: item,
        uid: str.substring(0, str.lastIndexOf('.'))
      }
    })
    handleHideTextBox()
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <el-upload
      ref="uploadRef"
      name="file"
      action=""
      :file-list="fileList"
      :limit="multiple ? 9 : 1"
      list-type="picture-card"
      :on-remove="handleRemove"
      :on-preview="handlePictureCardPreview"
      :http-request="handleHttpRequestUpload">
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip text-red">
          {{ alt }}
        </div>
      </template>
    </el-upload>
    <el-dialog v-model="visible">
      <img w-full :src="imageURL" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style lang="scss">
.text-red {
  color: red;
}
.el-upload--picture-card {
  display: v-bind(display);
}
</style>
