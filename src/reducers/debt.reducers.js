import { actionTypeConstants as types } from '../constants';

const initialState = {
  debtAmount: 0,
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  debtStatistic: {},
  debt: {
    totalItem: 0,
    debtList: []
  }
};
export function debt(state = initialState, action) {
  switch (action.type) {
    case types.DEBT.INIT.SUCCESS:
      let { paging } = action.data.data;
      return {
        ...state,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.DEBT.SEARCH.SUCCESS:
      let { debtStatistic, debtAmount, debtList, totalItem } = action.data.data;
      return {
        ...state,
        debtStatistic: debtStatistic,
        debtAmount: debtAmount,
        debt: {
          debtList: debtList || [],
          totalItem: totalItem || 0
        }
      };
    default:
      return state
  }
}