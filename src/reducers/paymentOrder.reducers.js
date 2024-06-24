import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  paymentMethods: [],
  paymentStatusList: [],
  locations: [],
  paymentTransactionData: [],
  total: 0,
  totalAmount: 0,
  totalRefund: 0,
};
export function paymentOrder(state = initialState, action) {
  switch (action.type) {
    case types.PAYMENT_ORDER.INIT.SUCCESS:
      let { machines, locations, paymentStatusList, paymentMethods, fromDate, toDate, fromTime, toTime } = action.data.data;
      return {
        ...state,
        machines: machines || [],
        paymentMethods: paymentMethods || [],
        paymentStatusList: paymentStatusList || [],
        locations: locations || [],
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
      };
    case types.PAYMENT_ORDER.SEARCH.INDEX:
      return {
        ...state,
        paymentTransactionData: [],
        total: 0,
        totalAmount: 0,
        totalRefund: 0,
      };
    case types.PAYMENT_ORDER.SEARCH.SUCCESS:
      return {
        ...state,
        paymentTransactionData: (action.data.data && action.data.data.paymentOrderList) || [],
        total: (action.data.data && action.data.data.totalItem) || 0,
        totalAmount: (action.data.data && action.data.data.totalAmount) || 0,
        totalRefund: (action.data.data && action.data.data.totalRefund) || 0,
      };
    default:
      return state
  }
}