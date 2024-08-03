<script setup>
import useView from "@/hooks/useView"
import { reactive, ref, toRefs } from "vue"
import AddOrUpdate from "./tenant-add-or-update.vue"
import SetupAddOrUpdate from './tenant-setup-add-or-update.vue'

const view = reactive({
  getDataListURL: "/sys/tenant/list",
  deleteURL: "/sys/tenant/delete",
  dataForm: {
    name: "",
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id)
}

const setupAddOrUpdateRef = ref()
const setupAddOrUpdateHandle = (id) => {
  setupAddOrUpdateRef.value.init(id)
}
</script>
<template>
  <div class="mod-sys__tenant">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item label="机构名称">
        <el-input v-model="state.dataForm.name" placeholder="请输入机构名称" maxlength="30" prefix-icon="Search" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()" type="primary" icon="Search" round>查询</el-button>
        <el-button v-if="state.isAuth('sys:tenant:save')" @click="addOrUpdateHandle()" type="success" icon="Plus" round>新增</el-button>
      </el-form-item>
    </el-form>
    <el-table 
      border
      row-key="id"
      style="width: 100%;"
      :data="state.dataList"
      v-loading="state.dataListLoading">
      <el-table-column
        fixed="left"
        prop="id"
        header-align="center"
        align="right"
        width="80"
        label="机构ID">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="机构名称">
      </el-table-column>
      <el-table-column
        prop="serials"
        header-align="center"
        align="center"
        label="机构编号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="signtime"
        header-align="center"
        align="center"
        label="签约时间">
      </el-table-column>
      <el-table-column
        prop="expiretime"
        header-align="center"
        align="center"
        label="到期时间">
      </el-table-column>
      <el-table-column
        prop="tname"
        header-align="center"
        align="center"
        label="负责人姓名">
      </el-table-column>
      <el-table-column
        prop="tphone"
        header-align="center"
        align="center"
        label="负责人电话">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template v-slot="scope">
          <el-button v-if="state.isAuth('sys:tenant:update')" @click="addOrUpdateHandle(scope.row.id)" type="primary" link size="small">修改</el-button>
          <el-button v-if="state.isAuth('sys:tenant:setup:saveOrUpdate')" @click="setupAddOrUpdateHandle(scope.row.id)" type="primary" link size="small">配置</el-button>
          <el-button v-if="state.isAuth('sys:tenant:delete')" @click="state.deleteHandle(scope.row.id)" type="primary" link size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
    <!-- 机构配置 -->
    <setup-add-or-update ref="setupAddOrUpdateRef" @refreshDataList="state.getDataList"></setup-add-or-update>
  </div>
</template>
<style lang="scss">

</style>