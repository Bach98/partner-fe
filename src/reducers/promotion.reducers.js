import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  promotionCategoryList: [],
  promotionStatusList: [],
  vendingList: [],
  locationList: [],
  promotion: {
    total: 0,
    promotionList: []
  },
  promotionId: undefined,
  promotionDetail: {
    vendingList: [],
    productList: []
  },
  promotionUserList: [],
  total: 0,
};
export function promotion(state = initialState, action) {
  switch (action.type) {
    case types.PROMOTION.INIT.SUCCESS:
      let { promotionCategoryList, promotionStatusList, vendingList, locationList } = action.data.data;
      let { paging } = action.data;
      return {
        ...state,
        promotionCategoryList: promotionCategoryList,
        promotionStatusList: promotionStatusList,
        vendingList: vendingList,
        locationList: locationList,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        },
      };
    case types.PROMOTION.SEARCH.SUCCESS:
      let {
        promotionList,
        total
      } = action.data.data;
      return {
        ...state,
        promotion: {
          promotionList: promotionList || [],
          total: total || 0
        }
      };
    case types.PROMOTION.GOTO_DETAIL.SUCCESS:
      return {
        ...state,
        promotionId: action.data,
      };
    case types.PROMOTION.DETAIL.SUCCESS:
      return {
        ...state,
        promotionDetail: action.data.data || {}
      };
    case types.PROMOTION.PROMOTION_USER_LIST_SEARCH.SUCCESS:
      return {
        ...state,
        promotionUserList: action.data.data.promotionUserList || [],
        total: action.data.data.total
      };
    default:
      return state
  }
}