import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  importTypes: [],
  machines: [],
  products: [],
  locations: [],
  importStatus: [],
  code: "",
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  imports: [],
  importDetails: [],
  importId: undefined,
  importInfo: {},
  warehouse: [],
  total: 0,
  importExcelResult: [],
  totalError: 0,
  totalAmount: 0
};
export function whImport(state = initialState, action) {
  switch (action.type) {
    case types.WAREHOUSE_IMPORT.INIT.SUCCESS:
      let { paging } = action.data.data;
      return {
        ...state,
        ...action.data.data,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.WAREHOUSE_IMPORT.SEARCH.SUCCESS:
      return {
        ...state,
        imports: action.data.data.whImportList || [],
        total: action.data.data.totalItem || 0
      };
    case types.WAREHOUSE_IMPORT.GOTO_DETAIL.SUCCESS:
      return {
        ...state,
        importId: action.data,
      };
    case types.WAREHOUSE_IMPORT.DETAIL.INDEX:
      return {
        ...state,
        importInfo: { status: "NEW", id: 0, importType: "IMPORT_PURCHASE" },
        totalAmount: 0
      };
    case types.WAREHOUSE_IMPORT.DETAIL.SUCCESS:
      return {
        ...state,
        ...action.data.data,
        importInfo: action.data.data.importInfo || { status: "NEW", id: 0, importType: "IMPORT_PURCHASE" }
      };
    case types.WAREHOUSE_IMPORT.SEARCH_DETAIL_LIST.SUCCESS:
      return {
        ...state,
        importDetails: action.data.data.whImportDetailList,
        total: action.data.data.totalItem
      };
    case types.WAREHOUSE_IMPORT.IMPORT_EXCEL.INDEX:
      return {
        ...state,
        importExcelResult: undefined,
        totalAmount: 0,
        totalError: 0
      }
    case types.WAREHOUSE_IMPORT.IMPORT_EXCEL.SUCCESS:
      return {
        ...state,
        importExcelResult: action.data.data.listImport || [],
        totalError: action.data.data.totalError || 0,
        totalAmount: action.data.data.totalAmount || 0,
      }
    default:
      return state
  }
}