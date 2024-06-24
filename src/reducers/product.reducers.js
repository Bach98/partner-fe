import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  product: {
    total: 0,
    productList: []
  },
};
export function product(state = initialState, action) {
  switch (action.type) {
    case types.PRODUCT.INIT.SUCCESS:
      return {
        ...state,
        paging: {
          pageSizes: [10, 20, 50, 100],
          pageSizeDefault: 10
        },
      };
    case types.PRODUCT.SEARCH.SUCCESS:
      let {
        productList,
        total
      } = action.data.data;
      productList.forEach(item => {
        item.pointsPartner = item.points; // Gán giá trị của 'points' cho 'pointsPartner'
      });
      return {
        ...state,
        product: {
          productList: productList || [],
          total: total || 0
        }
      };
    case types.PRODUCT.EDIT_PRODUCT.SUCCESS:
      return {
        ...state,
      }
    default:
      return state
  }
}