import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  exportTypes: [],
  exportStatus: [],
  machines: [],
  products: [],
  locations: [],
  code: "",
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  exports: [],
  exportDetails: [],
  exportId: undefined,
  exportInfo: {},
  total: 0,
  warehouse: [],
};
export function whExport(state = initialState, action) {
  switch (action.type) {
    case types.WAREHOUSE_EXPORT.INIT.SUCCESS:
      let { paging } = action.data.data;
      return {
        ...state,
        ...action.data.data,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.WAREHOUSE_EXPORT.SEARCH.SUCCESS:
      return {
        ...state,
        exports: action.data.data.whExportList || [],
        total: action.data.data.totalItem || 0
      };
    case types.WAREHOUSE_EXPORT.GOTO_DETAIL.SUCCESS:
      return {
        ...state,
        exportId: action.data,
      };
    case types.WAREHOUSE_EXPORT.DETAIL.INDEX:
      return {
        ...state,
        exportInfo: {}
      };
    case types.WAREHOUSE_EXPORT.DETAIL.SUCCESS:
      return {
        ...state,
        ...action.data.data,
        exportInfo: action.data.data.exportInfo || { status: "NEW", id: 0, exportType: "EXPORT_TO_MACHINE" }
      };
    case types.WAREHOUSE_EXPORT.SEARCH_DETAIL_LIST.SUCCESS:
      return {
        ...state,
        exportDetails: action.data.data.whExportDetailList,
        total: action.data.data.totalItem
      };
    case types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_LAYOUT.INDEX:
      return {
        ...state,
        products: []
      };
    case types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_LAYOUT.SUCCESS:
      return {
        ...state,
        ...action.data.data,
        products: action.data.data || []
      };
    case types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_INVENTORY_MACHINE.INDEX:
      return {
        ...state,
        products: []
      };
    case types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_INVENTORY_MACHINE.SUCCESS:
      return {
        ...state,
        ...action.data.data,
        products: action.data.data || []
      };
    default:
      return state
  }
}