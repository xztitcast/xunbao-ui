<<script setup>
import { reactive, toRefs } from 'vue'
import useView from "@/hooks/useView"

const view = reactive({
  getDataListURL: "/sys/balance/trx/list",
  getDataListIsPage: true,
  dataForm: {
    userId: null,
    username: ""
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })
</script>

<template>
  <div class="mod-sys__user_work">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.userId" placeholder="用户ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.dataForm.username" placeholder="用户名" clearable></el-input>
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
        label="用户ID"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名称"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="rate"
        label="比例分成"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="trade_amount"
        label="交易金额"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="score"
        label="积分"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num0"
        label="信用分"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num1"
        label="进行中(个)"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num2"
        label="待验收(个)"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num3"
        label="已验收(个)"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num4"
        label="已完成(个)"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num5"
        label="有责取消(次)"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num6"
        label="无责取消(次)"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num7"
        label="购买源码(份)"
        sortable="custom"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="num8"
        label="销售源码(份)"
        sortable="custom"
        header-align="center"
        align="center">
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