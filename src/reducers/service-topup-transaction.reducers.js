import { actionTypeConstants as types } from "../constants";

const initState = {
  serviceTopupTransList: [],
  total: 0,
  totalAmount: 0,
  vendingList: [],
  machineModelList: [],
  locationList: [],
  topupTypeList: [],
  statusList: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
};

export function serviceTopupTransaction(state = initState, action) {
  switch (action.type) {
    case types.SERVICE_TOPUP_TRANSACTION.INIT.INDEX:
      return {
        ...state,
        vendingList: [],
        machineModelList: [],
        locationList: [],
        total: 0,
        serviceTopupTransList: []
      }
    case types.SERVICE_TOPUP_TRANSACTION.INIT.SUCCESS:
      return {
        ...state,
        vendingList: action.data.data.vendingList || [],
        machineModelList: action.data.data.machineModelList || [],
        locationList: action.data.data.locationList || [],
        topupTypeList: action.data.data.topupTypeList || [],
        statusList: action.data.data.statusList || [],
        paging: {
          pageSizes: [10, 20, 50, 100],
          pageSizeDefault: 10
        }
      }
    case types.SERVICE_TOPUP_TRANSACTION.SEARCH.SUCCESS:
      return {
        ...state,
        serviceTopupTransList: action.data.data.resultList || [],
        total: action.data.data.total || 0,
        totalAmount: action.data.data.totalAmount || 0,
      }
    default:
      return state;
  }
}
