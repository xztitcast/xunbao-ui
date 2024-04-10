<script setup>
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./menu-add-or-update.vue";

const view = reactive({
  getDataListURL: "/sys/menu/list",
  deleteURL: "/sys/menu/delete"
});

const state = reactive({ ...useView(view), ...toRefs(view) });
const addOrUpdateRef = ref();
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id);
};
</script>

<template>
  <div class="mod-sys__menu">
    <el-form :inline="true" :model="state.dataForm">
      <el-form-item>
        <el-button v-if="state.isAuth('sys:menu:save')" @click="addOrUpdateHandle()" type="success" icon="Plus" round>新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      row-key="id"
      style="width: 100%;"
      :data="state.dataList"
      show-overflow-tooltip
      v-loading="state.dataListLoading">
      <el-table-column
        prop="name"
        header-align="center"
        min-width="150"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="图标">
        <template v-slot="scope">
          <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${scope.row.icon}`"></use></svg>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template v-slot="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sorted"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        label="路由">
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="150"
        label="授权标识">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
        v-if="state.isAuth('sys:menu:update') && state.isAuth('sys:menu:delete')">
        <template v-slot="scope">
          <el-button v-if="state.isAuth('sys:menu:update')" @click="addOrUpdateHandle(scope.row.id)" type="primary" link size="small">修改</el-button>
          <el-button v-if="state.isAuth('sys:menu:delete')" @click="state.deleteHandle(scope.row.id)" type="primary" link size="small" :disabled="scope.row.status === 0">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList"></add-or-update>
  </div>
</template>

<style lang="scss">
</style>
