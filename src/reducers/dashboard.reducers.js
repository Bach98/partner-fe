import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  dashboard: {
    fromDate: undefined,
    toDate: undefined,
    fromTime: undefined,
    toTime: undefined,
    totalVMOn: 0,
    totalVMOff: 0,
    totalTransaction: 0,
    topQuantity: 0,
    listVMAmountHight: [],
    listVMAmountLow: [],
    listProductHight: [],
    listProductLow: [],
    listLocationTypeHigh: [],
    listLocationTypeLow: [],
    listProductLocationType: [],
    listDataColumnChartWalet: []
  }
};
export function dashboard(state = initialState, action) {
  switch (action.type) {
    case types.DASHBOARD.INIT.SUCCESS:
      return {
        ...state,
        dashboard: {
          fromDate: action.data.data.fromDate,
          toDate: action.data.data.toDate,
          fromTime: action.data.data.fromTime,
          toTime: action.data.data.toTime,
          totalVMOn: action.data.data.totalVMOn,
          totalVMOff: action.data.data.totalVMOff,
          totalTransaction: action.data.data.totalTransaction,
          topQuantity: action.data.data.topQuantity,
          listVMAmountHight: action.data.data.listVMAmountHight,
          listVMAmountLow: action.data.data.listVMAmountLow,
          listProductHight: action.data.data.listProductHight,
          listProductLow: action.data.data.listProductLow,
          listLocationTypeHigh: action.data.data.listLocationTypeHigh,
          listLocationTypeLow: action.data.data.listLocationTypeLow,
          listProductLocationType: action.data.data.listProductLocationType,
          listDataColumnChartWalet: action.data.data.listDataColumnChartWalet
        }
      };
    default:
      return state
  }
}