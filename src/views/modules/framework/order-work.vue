<script setup>
import { reactive, toRefs } from 'vue'
import useView from "@/hooks/useView"

const view = reactive({
  getDataListURL: "/sys/order/work/list",
  getDataListIsPage: true,
  dataForm: {
    serialNumber: "",
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })
</script>

<template>
  <div class="mod-sys__order_work">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
       <el-form-item>
          <el-input v-model="state.dataForm.serialNumber" placeholder="订单编号" clearable></el-input>
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
      @sort-change="state.dataListSortChangeHandle"
      @selection-change="state.dataListSelectionChangeHandle">
      <el-table-column 
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="订单编号"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名称"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPic"
        label="用户头像"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-avatar :src="scope.row.userPic" size="small" shape="circle"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="warning">无责取消</el-tag>
          <el-tag v-else-if="scope.row.status === 1" size="small" type="primary">有责取消</el-tag>
          <el-tag v-else-if="scope.row.status === 2" size="small" type="success">进行中</el-tag>
          <el-tag v-else-if="scope.row.status === 3" size="small" type="success">待验收</el-tag>
          <el-tag v-else-if="scope.row.status === 4" size="small" type="success">已验收</el-tag>
          <el-tag v-else-if="scope.row.status === 5" size="small" type="success">已完成</el-tag>
          <el-tag v-else size="small" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="bonus"
        label="奖励"
        sortable="custom"
        header-align="center"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="bond"
        label="保证金"
        sortable="custom"
        header-align="center"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        sortable="custom"
        header-align="center"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="proof_url"
        label="证明"
        sortable="custom"
        header-align="center"
        align="center"
        width="180">
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
        prop="updated"
        label="更新时间"
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