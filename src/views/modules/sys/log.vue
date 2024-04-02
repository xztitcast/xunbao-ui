<script setup>
import useView from "@/hooks/useView";
import { reactive, toRefs } from "vue";

const view = reactive({
  getDataListURL: "/sys/log/list",
  getDataListIsPage: true,
  dataForm: {
    status: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });
</script>

<template>
  <div class="mod-sys__log-login">
    <el-table 
      border
      style="width: 100%;"
      show-overflow-tooltip
      :data="state.dataList"
      v-loading="state.dataListLoading"
      @sort-change="state.dataListSortChangeHandle">
      <el-table-column type="expand">
        <template #default="scope">
          <el-form label-position="left" class="log-table-expand">
            <el-form-item label="ID">
              <span>{{ scope.row.id }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ scope.row.username }}</span>
            </el-form-item>
            <el-form-item label="操作">
              <span>{{ scope.row.operation }}</span>
            </el-form-item>
            <el-form-item label="方法">
              <span>{{ scope.row.method }}</span>
            </el-form-item>
            <el-form-item label="参数">
              <span>{{ scope.row.params }}</span>
            </el-form-item>
            <el-form-item label="执行时间">
              <span>{{ scope.row.time }}ms</span>
            </el-form-item>
            <el-form-item label="操作IP">
              <span>{{ scope.row.ip }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ scope.row.created }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="id" 
        label="ID"
        header-align="center"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="method"
        label="方法"
        header-align="center"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="params"
        label="参数"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="time"
        label="执行时间"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="操作IP"
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
