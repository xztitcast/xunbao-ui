import app from "@/constants/app";
import { EMitt, EThemeSetting } from "@/constants/enum";
import { registerDynamicToRouterAndNext } from "@/router";
import baseService from "@/service/baseService";
import { getToken } from "@/utils/cache";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { checkPermission, getDictLabel } from "@/utils";
import qs from "qs";
import { onActivated, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store";
import { ElMessage, ElMessageBox } from "element-plus";

/**
 * 通用视图业务逻辑（列表/增删改查基本业务）
 * @param props 自定义通用业务state
 * @returns 返回响应式自定义state和通用方法
 */
const useView = (props) => {
  const router = useRouter();
  const route = useRoute();
  const store = useAppStore();
  const defaultOptions = {
    createdIsNeed: true,
    activatedIsNeed: false,
    getDataListURL: "",
    getDataListIsPage: false,
    deleteURL: "",
    deleteIsBatch: false,
    deleteIsBatchKey: "id",
    exportURL: "",
    statusURL: '',
    dataForm: {},
    dataList: [],
    order: "",
    orderField: "",
    pageNum: 1,
    pageSize: 10,
    total: 0,
    dataListLoading: false,
    dataListSelections: [],
    elTable: {}
  };
  const mergeDefaultStateToPageState = (options, props) => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key];
      }
    }
    return props;
  };
  const state = mergeDefaultStateToPageState(defaultOptions, props);
  onMounted(() => {
    if (state.createdIsNeed && !state.activatedIsNeed) {
      viewFns.query();
    }
  });
  onActivated(() => {
    if (store.state.closedTabs.includes(store.state.activeTabName)) {
      //如果当前打开的tab页面是之前已经关闭过的会存在keep-alive缓存
      //这里采用临时刷新页面解决方案
      //待vue官方开放缓存策略后再行实现 https://github.com/vuejs/vue-next/pull/4339   https://github.com/vuejs/rfcs/pull/284

      const closedTabs = store.state.closedTabs;
      store.updateState({
        closedTabs: closedTabs.filter((x) => x !== store.state.activeTabName)
      });
      emits.emit(EMitt.OnReloadTabPage);
    }

    if (state.activatedIsNeed) {
      viewFns.query();
    }
  });

  //
  const rejectFns = {
    isAuth(key) {
      return checkPermission(store.state.permissions, key);
    },
    getDictLabel(dictType, dictValue) {
      return getDictLabel(store.state.dicts, dictType, dictValue);
    }
  };

  //
  const viewFns = {
    // 获取数据列表
    query() {
      if (!state.getDataListURL) {
        return;
      }
      state.dataListLoading = true;
      baseService
        .get(state.getDataListURL, {
          order: state.order,
          orderField: state.orderField,
          pageNum: state.getDataListIsPage ? state.pageNum : null,
          pageSize: state.getDataListIsPage ? state.pageSize : null,
          ...state.dataForm
        })
        .then(({ data }) => {
          state.dataListLoading = false;
          state.dataList = state.getDataListIsPage ? data.result.pageList : data.result;
          state.total = state.getDataListIsPage ? data.result.total : 0;
        })
        .catch(() => {
          state.dataListLoading = false;
        });
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      state.dataListSelections = val;
    },
    // 排序
    dataListSortChangeHandle(data) {
      if (!data.order || !data.prop) {
        state.order = "";
        state.orderField = "";
        return false;
      }
      state.order = data.order.replace(/ending$/, "") === "asc";
      state.orderField = data.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
      viewFns.query();
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      state.pageNum = 1;
      state.pageSize = val;
      viewFns.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      state.pageNum = val;
      viewFns.query();
    },
    //搜索
    getDataList() {
      state.pageNum = 1;
      viewFns.query();
    },
    // 删除
    deleteHandle(id) {
      return new Promise((resolve, reject) => {
        if (
          state.deleteIsBatch &&
          !id &&
          state.dataListSelections &&
          state.dataListSelections.length <= 0
        ) {
          ElMessage.warning({
            message: "请选择操作项",
            duration: 500
          });
          return;
        }
        ElMessageBox.confirm("确定进行[删除]操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            baseService
              .delete(
                `${state.deleteURL}${state.deleteIsBatch ? "" : "/" + id}`,
                state.deleteIsBatch
                  ? id
                    ? [id]
                    : state.dataListSelections
                    ? state.dataListSelections.map(
                        (item) => state.deleteIsBatchKey && item[state.deleteIsBatchKey]
                      )
                    : {}
                  : {}
              )
              .then(({ data }) => {
                if (data && data.code === 0) {
                  ElMessage.success({
                    message: "删除成功",
                    duration: 500,
                    onClose: () => {
                      viewFns.query();
                      resolve(true);
                    }
                  });
                } else {
                  ElMessage.error(data.message)
                }
              });
          })
          .catch(() => {
            //
          });
      });
    },
    // 导出
    exportHandle() {
      window.location.href = `${app.api}${state.exportURL}?${qs.stringify({
        ...state.dataForm,
        token: getToken()
      })}`;
    },
    switchChangeHandle(row) {
      baseService.post(state.statusURL, {
          "id": row.id,
          "status": row.status
      }).then(({ data }) => {
        if(data && data.code === 0) {
          ElMessage.success({
            message: "修改成功",
            duration: 500,
            onClose: () => {
              viewFns.query();
            }
          })
        }else {
          ElMessage.error(data.message)
        }
      })
    },
    //关闭当前窗口
    closeCurrentTab() {
      if (getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage)) {
        emits.emit(EMitt.OnCloseCurrTab);
      } else {
        router.replace("/home");
      }
    },
    // 处理流程路由
    handleFlowRoute(data) {
      const routeParams = {
        path: `/flow/task-form`,
        query: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          processDefinitionId: data.processDefinitionId,
          showType: "taskHandle",
          _mt: `${route.meta.title} - ${data.processDefinitionName}`
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    },
    // 查看流程详情
    flowDetailRoute(data) {
      const routeParams = {
        path: `/flow/task-form`,
        query: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          processDefinitionId: data.processDefinitionId,
          showType: "detail",
          _mt: `${route.meta.title} - ${data.processDefinitionName}`
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    }
  };

  //
  return {
    ...viewFns,
    ...rejectFns
  };
};

export default useView;
