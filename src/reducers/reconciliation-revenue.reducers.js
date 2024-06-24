import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  paymentStatus: [],
  reconciliationStatus: [],
  machineModels: [],
  addressTypes: [],
  locations: [],
  locationAreaMachines: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  reconciliationRevenues: [],
  reconciliationId: undefined,
  reconciliationDetail: {},
  cashSheetDetail: [],
  reconciliationMachineList: [],
  listCashSheetDetail: [],
  listSheetDetail: {},
  totalItem: 0
};
export function reconciliationRevenue(state = initialState, action) {
  switch (action.type) {
    case types.RECONCILIATION_REVENUE.INIT.SUCCESS:

      let { machines, paymentStatus, reconciliationStatus, machineModels, addressTypes, locations, locationAreaMachines, paging } = action.data.data;

      return {
        ...state,
        machines: machines,
        paymentStatus: paymentStatus,
        reconciliationStatus: reconciliationStatus,
        machineModels: machineModels,
        addressTypes: addressTypes,
        locations: locations,
        locationAreaMachines: locationAreaMachines,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.RECONCILIATION_REVENUE.SEARCH.SUCCESS:
      return {
        ...state,
        reconciliationRevenues: action.data.data
      };
    case types.RECONCILIATION_REVENUE.CHANGE_RECONCILIATION_STATUS.SUCCESS:
      return {
        ...state,
      };
    case types.RECONCILIATION_REVENUE.GOTO_DETAIL.SUCCESS:
      return {
        ...state,
        reconciliationId: action.data,
      };
    case types.RECONCILIATION_REVENUE.DETAIL.SUCCESS:
      let listSheetDetail = action.data.data.listSheetDetail || {};
      return {
        ...state,
        reconciliationDetail: action.data.data || {},
        listCashSheetDetail: listSheetDetail.listCashSheetDetail || [],
        listSheetDetail: listSheetDetail || {}
      }
    case types.RECONCILIATION_REVENUE.GET_CASH_SHEET_DETAIL.SUCCESS:
      return {
        ...state,
        cashSheetDetail: action.data.data
      }
    case types.RECONCILIATION_REVENUE.SEARCH_MACHINE.SUCCESS:
      return {
        ...state,
        reconciliationMachineList: action.data.data.reconciliationRevenueList,
        totalItem: action.data.data.totalItem
      };
    default:
      return state
  }
}