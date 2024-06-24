import {
  actionTypeConstants as types
} from '../constants';
import moment from 'moment';
const initialState = {
  machines: [],
  locations: [],
  statusList: [],
  providerList: [],
  charityList: [],
  bankList: [],
  fromDate: undefined,
  toDate: undefined,
  fromTime: undefined,
  toTime: undefined,
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  payoutTransactionData: {
    totalItem: 0,
    totalAmount: 0,
    payoutTransactionList: [],
    totalSumNotYetReceived: 0
  },
  dataList: {},
  detailList: []
};
export function payoutTransaction(state = initialState, action) {
  switch (action.type) {
    case types.PAYOUT_TRANSACTION.INIT.SUCCESS:

      let { machines, locations, statusList, providerList, charityList, fromDate, toDate, fromTime, toTime } = action.data.data;
      return {
        ...state,
        machines: machines,
        statusList: statusList,
        providerList: providerList,
        charityList: charityList,
        locations: locations,
        bankList: [],
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        paging: {
          pageSizes: [10, 20, 50, 100],
          pageSizeDefault: 10
        },
      };
    case types.PAYOUT_TRANSACTION.SEARCH.SUCCESS:
      let {
        payoutTransactionList,
        totalItem,
        totalAmount,
        totalSumNotYetReceived
      } = action.data.data;

      return {
        ...state,
        payoutTransactionData: {
          payoutTransactionList: payoutTransactionList || [],
          totalItem: totalItem || 0,
          totalAmount: totalAmount || 0,
          totalSumNotYetReceived: totalSumNotYetReceived || 0
        }
      };
    case types.PAYOUT_TRANSACTION.DETAIL.INDEX:
      return {
        ...state,
        dataList: {},
        detailList: [],
      }
    case types.PAYOUT_TRANSACTION.DETAIL.SUCCESS:
      let dataIndex = action.data.data || {}
      if (dataIndex !== null) {
        let { createTime, updateTime } = dataIndex;
        if (createTime && updateTime) {
          dataIndex.createTime = moment(createTime);
          dataIndex.updateTime = moment(updateTime);
        }
      }
      return {
        ...state,
        dataList: dataIndex,
        detailList: action.data.data.detailList || [],
      }
    default:
      return state
  }
}