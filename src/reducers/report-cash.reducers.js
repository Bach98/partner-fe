import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  vendingList: [],
  locationList: [],
  locationAreaMachineList: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  reportCash: {
    total: 0,
    reportCashList: []
  },
  cashSheetDetailList: [],
  paymentAmount: 0,
  fromDate: undefined
};
export function reportCash(state = initialState, action) {
  switch (action.type) {
    case types.REPORT_CASH.INIT.SUCCESS:
      let {
        vendingList,
        locationList,
        locationAreaMachineList,
        paging
      } = action.data.data;
      return {
        ...state,
        vendingList: vendingList,
        locationList: locationList,
        locationAreaMachineList: locationAreaMachineList,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        },
      };
    case types.REPORT_CASH.SEARCH.SUCCESS:
      let {
        reportCashList,
        total
      } = action.data.data;
      return {
        ...state,
        reportCash: {
          reportCashList: reportCashList || [],
          total: total || 0
        }
      };
    case types.REPORT_CASH.GET_CASH_SHEET_DETAIL.SUCCESS:
      return {
        ...state,
        cashSheetDetailList: action.data.data.cashSheetDetailList,
        paymentAmount: action.data.data.paymentAmount,
        fromDate: action.data.data.fromDate,
      }
    default:
      return state
  }
}