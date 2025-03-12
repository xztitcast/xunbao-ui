<script setup>
import { reactive, ref, toRefs } from 'vue'
import useView from "@/hooks/useView"
import AddOrUpdate from "./order-add-or-update.vue"

const view = reactive({
  getDataListURL: "/sys/order/list",
  getDataListIsPage: true,
  deleteURL: "/sys/order/delete",
  deleteIsBatch: true,
  dataForm: {
    serialNumber: "",
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })

const addOrUpdateRef = ref();
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id);
}
</script>

<template>
  <div class="mod-sys__order">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
       <el-form-item>
          <el-input v-model="state.dataForm.serialNumber" placeholder="订单编号" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()" icon="Search" type="primary" round>查询</el-button>
        <el-button v-if="state.isAuth('sys:order:save')" @click="addOrUpdateHandle()" type="success" icon="Plus" round>新增</el-button>
        <el-button v-if="state.isAuth('sys:order:delete')" @click="state.deleteHandle()" :disabled="state.dataListSelections.length <= 0" type="danger" icon="Delete" round>批量删除</el-button>
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
        prop="serialNumber"
        label="编号"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.type === 1" size="small" type="primary">需求</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="primary">BUG</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="warning">审核失败</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small" type="primary">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 2" size="small" type="success">审核成功</el-tag>
          <el-tag v-else-if="scope.row.status === 3" size="small" type="success">待发布</el-tag>
          <el-tag v-else-if="scope.row.status === 4" size="small" type="success">已发布</el-tag>
          <el-tag v-else-if="scope.row.status === 5" size="small" type="success">进行中</el-tag>
          <el-tag v-else-if="scope.row.status === 6" size="small" type="success">已结束</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="publishTime"
        label="发布时间"
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
          <el-button v-if="state.isAuth('sys:order:update')" @click="addOrUpdateHandle(scope.row.id)" :disabled="scope.row.id === 1" type="primary" link size="small" >修改</el-button>
          <el-button v-if="state.isAuth('sys:order:delete')" @click="state.deleteHandle(scope.row.id)" :disabled="scope.row.id === 1"  type="primary" link size="small" >删除</el-button>
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

<style lang="scss" scoped>

</style>