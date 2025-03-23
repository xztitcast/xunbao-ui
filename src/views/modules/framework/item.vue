<script setup>
import { reactive, ref, toRefs } from 'vue'
import useView from "@/hooks/useView"
import AddOrUpdate from "./item-add-or-update.vue"

const view = reactive({
  getDataListURL: "/sys/item/list",
  getDataListIsPage: true,
  deleteURL: "/sys/item/delete",
  deleteIsBatch: true,
  statusURL: '/sys/label/change',
  dataForm: {
    name: "",
  }
})

const state = reactive({ ...useView(view), ...toRefs(view) })

const addOrUpdateRef = ref();
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id);
}

</script>

<template>
<div class="mod-sys__item">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
       <el-form-item label="奖品名称">
          <el-input v-model="state.dataForm.name" placeholder="请输入奖品名称" :maxlength="32" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()" icon="Search" type="primary" round>查询</el-button>
        <el-button v-if="state.isAuth('sys:item:save')" @click="addOrUpdateHandle()" type="success" icon="Plus" round>新增</el-button>
        <el-button v-if="state.isAuth('sys:item:delete')" @click="state.deleteHandle()" :disabled="state.dataListSelections.length <= 0" type="danger" icon="Delete" round>批量删除</el-button>
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
        header-align="left"
        align="left"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
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
        prop="status"
        label="状态"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-switch 
            v-model="scope.row.status" 
            :active-value="0" 
            :inactive-value="1" 
            active-color="#13ce66" 
            inactive-color="#ff4949" 
            active-text="禁用" 
            inactive-text="启用"
            size="small"
            @change="state.switchChangeHandle(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="图标"
        header-align="center"
        align="center">
        <template v-slot="scope">
          <el-image
            style="width: 50px; height: 50px;"
            :src="scope.row.url"
            fit="cover"
            lazy
            :preview-src-list="[scope.row.url]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="奖励金额"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expire"
        label="过期天数"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="range"
        label="排名范围(前)"
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
          <el-button v-if="state.isAuth('sys:item:update')" @click="addOrUpdateHandle(scope.row.id)" type="primary" link size="small" >修改</el-button>
          <el-button v-if="state.isAuth('sys:item:delete')" @click="state.deleteHandle(scope.row.id)" type="primary" link size="small" >删除</el-button>
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