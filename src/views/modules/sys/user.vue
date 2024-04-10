<script setup>
import useView from "@/hooks/useView"
import { reactive, ref, toRefs } from "vue"
import AddOrUpdate from "./user-add-or-update.vue"

const view = reactive({
  getDataListURL: "/sys/user/list",
  getDataListIsPage: true,
  deleteURL: "/sys/user/delete",
  deleteIsBatch: true,
  statusURL: '/sys/user/change',
  dataForm: {
    username: "",
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })

const addOrUpdateRef = ref();
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id);
}
</script>

<template>
  <div class="mod-sys__user">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
       <el-form-item>
          <el-input v-model="state.dataForm.username" placeholder="用户名" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()" icon="Search" type="primary" round>查询</el-button>
        <el-button v-if="state.isAuth('sys:user:save')" @click="addOrUpdateHandle()" type="success" icon="Plus" round>新增</el-button>
        <el-button v-if="state.isAuth('sys:user:delete')" @click="state.deleteHandle()" :disabled="state.dataListSelections.length <= 0" type="danger" icon="Delete" round>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      style="width: 100%;"
      :data="state.dataList"
      show-overflow-tooltip
      v-loading="state.dataListLoading"
      @sort-change="state.dataListSortChangeHandle"
      @selection-change="state.dataListSelectionChangeHandle">
      <el-table-column 
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        sortable="custom"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-switch 
            v-model="scope.row.status" 
            style="display: block" 
            :active-value="0" 
            :inactive-value="1" 
            active-color="#13ce66" 
            inactive-color="#ff4949" 
            active-text="正常" 
            inactive-text="禁用"
            @change="state.switchChangeHandle(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="locked"
        label="锁定时间"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="created"
        label="创建时间"
        sortable="custom"
        header-align="center"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        header-align="center"
        align="center"
        width="150">
        <template v-slot="scope">
          <el-button v-if="state.isAuth('sys:user:update')" @click="addOrUpdateHandle(scope.row.id)" :disabled="scope.row.id === 1" type="primary" link size="small" >修改</el-button>
          <el-button v-if="state.isAuth('sys:user:delete')" @click="state.deleteHandle(scope.row.id)" :disabled="scope.row.id === 1"  type="primary" link size="small" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="state.total"
      :page-size="state.pageSize"
      :current-page="state.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="state.pageSizeChangeHandle"
      @current-change="state.pageCurrentChangeHandle">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<style lang="scss">
</style>
