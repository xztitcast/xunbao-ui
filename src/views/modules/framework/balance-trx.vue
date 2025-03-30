<script setup>
import { reactive, toRefs } from 'vue'
import useView from "@/hooks/useView"

const view = reactive({
  getDataListURL: "/sys/balance/trx/list",
  getDataListIsPage: true,
  dataForm: {
    userId: null,
    serialNumber: ""
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })
</script>

<template>
  <div class="mod-sys__balance_trx">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.serialNumber" placeholder="订单编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.userId" placeholder="用户ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()" icon="Search" type="primary" round>查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      style="width: 100%;"
      :data="state.dataList"
      show-overflow-tooltip
      v-loading="state.dataListLoading"
      @sort-change="state.dataListSortChangeHandle">
      <el-table-column
        prop="id"
        label="ID"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="订单编号"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户ID"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名称"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="扣除保证金"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        header-align="center"
        align="center">
        <template #scope>
          <el-tag v-if="scope.row.status === 1" size="small" type="warning">待申诉</el-tag>
          <el-tag v-else-if="scope.row.status === 2" size="small" type="success">申诉成功</el-tag>
          <el-tag v-else-if="scope.row.status === 3" size="small" type="danger">申诉失败</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="cycle"
        label="申诉周期"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        label="申诉图片"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="video"
        label="申诉视屏"
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
  </div>
</template>

<style lang="scss">

</style>