import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  transactVendingLog: {
    total: 0,
    listCashSheet: [],
  },
  transactVendingLogDetail: {
    listCashSheetDetail: []
  }
};
export function transactVendingLog(state = initialState, action) {
  switch (action.type) {
    case types.TRANSACT_VENDING_LOG.INIT.SUCCESS:
      let { machines } = action.data.data;
      return {
        ...state,
        machines: machines,
        paging: {
          pageSizes: [10, 20, 50, 100],
          pageSizeDefault: 10
        },
        transactVendingLogList: [],
      };
    case types.TRANSACT_VENDING_LOG.SEARCH.SUCCESS:
      let {
        listCashSheet,
        total
      } = action.data.data;
      return {
        ...state,
        transactVendingLog: {
          listCashSheet: listCashSheet || [],
          total: total || 0
        }
      };
    case types.TRANSACT_VENDING_LOG.DETAIL.SUCCESS:
      let {
        listCashSheetDetail
      } = action.data.data;
      return {
        ...state,
        transactVendingLogDetail: {
          listCashSheetDetail: listCashSheetDetail || []
        }
      };
    default:
      return state
  }
}