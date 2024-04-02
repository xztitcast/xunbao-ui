<script setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./dict-add-or-update.vue";

const view = reactive({
  getDataListURL: "/sys/dict/list",
  getDataListIsPage: true,
  deleteURL: "/sys/dict/delete",
  deleteIsBatch: true,
  dataForm: {
    key: ''
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })

const addOrUpdateRef = ref(null)
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id)
}
</script>

<template>
  <div class="mod-sys__dict">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-input v-model="state.dataForm.key" placeholder="参数（Key）键" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()" type="primary" icon="Search" round>查询</el-button>
        <el-button v-if="state.isAuth('sys:dict:save')" @click="addOrUpdateHandle()" type="success" icon="Plus" round>新增</el-button>
        <el-button v-if="state.isAuth('sys:dict:delete')" @click="state.deleteHandle()" :disabled="state.dataListSelections.length <= 0" type="danger" icon="Delete" round>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      style="width: 100%;"
      :data="state.dataList"
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
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="key"
        header-align="center"
        align="center"
        label="字典(KEY)">
      </el-table-column>
      <el-table-column
        prop="value"
        header-align="center"
        align="center"
        label="字典值">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="created"
        sortable="custom"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template v-slot="scope">
          <el-button v-if="state.isAuth('sys:dict:update')" @click="addOrUpdateHandle(scope.row.id)" type="primary" link size="small">修改</el-button>
          <el-button v-if="state.isAuth('sys:dict:delete')" @click="state.deleteHandle(scope.row.id)" type="primary" link size="small">删除</el-button>
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
