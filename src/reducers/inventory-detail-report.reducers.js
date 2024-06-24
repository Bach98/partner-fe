import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  fromDate: undefined,
  toDate: undefined,
  vendingList: [],
  productList: [],
  locationList: [],
  addressTypeList: [],
  machineModelList: [],
  productTypeList: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  inventoryDetail: {
    totalItems: 0,
    inventoryDetailList: []
  }
};
export function inventoryDetailReport(state = initialState, action) {
  switch (action.type) {
    case types.INVENTORY_DETAIL_REPORT.INIT.SUCCESS:
      let { fromDate, toDate, vendingList, productList, locationList, addressTypeList, machineModelList, productTypeList } = action.data.data;
      let { paging } = action.data;
      return {
        ...state,
        fromDate: fromDate,
        toDate: toDate,
        vendingList: vendingList,
        productList: productList,
        locationList: locationList,
        addressTypeList: addressTypeList,
        machineModelList: machineModelList,
        productTypeList: productTypeList,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.INVENTORY_DETAIL_REPORT.SEARCH.SUCCESS:
      let {
        inventoryDetailList,
        totalItem
      } = action.data.data;
      return {
        ...state,
        inventoryDetail: {
          inventoryDetailList: inventoryDetailList || [],
          totalItem: totalItem || 0
        }
      };
    default:
      return state
  }
}