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
    baseService.delete('/sys/content/cat/delete', [data.id]).then(({ data }) => {
      if (data && data.code === 0) {
        ElMessage.success("删除成功")
      } else {
        ElMessage.error(data.message)
      }
    })
  } else {
    ElMessage.error("顶级节点不能被删除")
  }
}

const top = (param, sort) => {
  baseService.get(`/sys/content/cat/info/${param.id}`).then(({ data }) => {
    if (data && data.code === 0 && data.result) {
      var value = data.result.sorted + sort
      baseService.post('/sys/content/cat/update', {id: param.id, sorted: value <= 0 ? 0 : value }).then(({ data }) => {
        if (data && data.code === 0) {
          getTreeList()
        } else {
          ElMessage.error(data.message)
        }
      })
    } else {
      ElMessage.error(data.message)
    }
  })
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
    <el-tree style="max-width: 600px;" node-key="id" default-expand-all :data="dataSource"
      :expand-on-click-node="false">
      <template #default="{ node, data }">
        <span class="mod-conent-tree">
          <el-input v-if="editId === data.id" :ref="el => setRefs(el, `input${data.id}`)" size="small"
            v-model="data.label" @blur="editBlurHandle(node, data)">
          </el-input>
          <span v-else>{{ node.label }}</span>
          <span>
            <a @click="append(data)" icon="Search">
              <el-icon><Plus /></el-icon>
             </a>
            <a style="margin-left: 8px;" @click="edit(data)">
              <el-icon><Edit /></el-icon>
            </a>
            <a style="margin-left: 8px;" @click="remove(node, data)">
              <el-icon><Delete /></el-icon>
            </a>
            <a style="margin-left: 8px;" @click="top(data, -1)">
              <el-icon><SortDown /></el-icon>
            </a>
            <a style="margin-left: 8px;" @click="top(data, 1)">
              <el-icon><SortUp /></el-icon>
            </a>
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
