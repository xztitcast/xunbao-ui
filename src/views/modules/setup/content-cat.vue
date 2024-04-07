<script setup>
import { nextTick, onMounted, ref } from "vue"
import { ElMessage } from "element-plus"
import baseService from "@/service/baseService"

const refs = {}
const editId = ref(-1)
const dataSource = ref([])

const setRefs = (el, key) => {
  refs[key] = el
}

const append = (data) => {
  console.log(1111)
  const newChild = { id: -1, label: 'testtest', children: [] }
  if (data.children) {
    data.children.push(newChild)
    dataSource.value = [...dataSource.value]
  } else {
    data.children = []
  }
}

const edit = (data) => {
  editId.value = data.id
  nextTick(() => {
    const inputRef = `input${data.id}`
    if (inputRef) {
      const input = refs[inputRef]
      if (input) {
        input.focus()
      }
    }
  })
}

const remove = (node, data) => {
  if (data.id && data.parentId !== 0) {
    const parent = node.parent
    const children = parent.data.children || parent.data
    const index = children.findIndex((d) => d.id === data.id)
    children.splice(index, 1)
    dataSource.value = [...dataSource.value]
  } else {
    ElMessage.error("顶级节点不能被删除")
  }
}

const allowDrop = (draggingNode, dropNode, type) => {
  if (dropNode.data.label === '二级 3-1') {
    return type !== 'inner';
  } else {
    return true;
  }
}

const allowDrag = (draggingNode) => {
  console.log(draggingNode)
  return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
}

const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  console.log(ev)
  console.log('tree drop: ', dropNode.label, dropType);
}

const handleDragEnter = (draggingNode, dropNode, ev) => {
  return allowDrag(draggingNode)
  console.log('tree drag enter: ', dropNode.label)
}

const editBlurHandle = (node, data) => {
  editId.value = -1
  const inputRef = `input${data.id}`
  delete refs[inputRef]
  var dataForm = { name: data.label }
  if (data.id === -1) {
    dataForm.status = 1;
    dataForm.parentId = node.parent.data.id;
  } else {
    dataForm.id = data.id
  }
  baseService.post(`/sys/content/cat/${data.id === -1 ? 'save' : 'update'}`, dataForm).then(({ data }) => {
    if (data && data.code === 0) {
      getTreeList()
    } else {
      ElMessage.error(data.message)
    }
  })
}

const getTreeList = () => {
  baseService.get('/sys/content/cat/list').then(({ data }) => {
    if (data && data.code === 0) {
      dataSource.value = data.result || []
    } else {
      ElMessage.error(data.message)
    }
  })
}

onMounted(() => getTreeList())
</script>

<template>
  <div class="mod-content">
    <el-tree 
      style="max-width: 600px;"
      node-key="id"
      draggable
      default-expand-all
      :data="dataSource" 
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-drop="handleDrop"
      @node-drag-enter="handleDragEnter">
      <template #default="{ node, data }">
        <span class="mod-conent-tree">
          <el-input v-if="editId === data.id" :ref="el => setRefs(el, `input${data.id}`)" size="small"
            v-model="data.label" @blur="editBlurHandle(node, data)">
          </el-input>
          <span v-else>{{ node.label }}</span>
          <span>
            <a @click="append(data)"> Append </a>
            <a style="margin-left: 8px;" @click="edit(data)"> Edit </a>
            <a style="margin-left: 8px;" @click="remove(node, data)"> Delete </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss">
.mod-conent-tree {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
