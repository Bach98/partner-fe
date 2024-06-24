import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  bankList: [],
  statusList: [],
  providerList: [],
  charityList: [],
  locations: [],
  fromDate: undefined,
  toDate: undefined,
  fromTime: undefined,
  toTime: undefined,
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  cashLeftOver: {
    totalItem: 0,
    totalAmount: 0,
    cashLeftOverList: []
  }
};
export function cashLeftOver(state = initialState, action) {
  switch (action.type) {
    case types.CASH_LEFT_OVER.INIT.SUCCESS:

      let { machines, locations, statusList, providerList, charityList, fromDate, toDate, fromTime, toTime, paging } = action.data.data;
      return {
        ...state,
        machines: machines,
        bankList: [],
        statusList: statusList,
        providerList: providerList,
        charityList: charityList,
        locations: locations,
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.CASH_LEFT_OVER.SEARCH.SUCCESS:
      let {
        cashLeftOverList,
        totalItem,
        totalAmount
      } = action.data.data;

      return {
        ...state,
        cashLeftOver: {
          cashLeftOverList: cashLeftOverList || [],
          totalItem: totalItem || 0,
          totalAmount: totalAmount || 0
        }
      };
    case types.CASH_LEFT_OVER.BANK.SUCCESS:
      let { bankList } = action.data.data;

      return {
        ...state,
        bankList: bankList || []
      };
    default:
      return state
  }
}