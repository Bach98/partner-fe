import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  products: [],
  machines: [],
  paymentMethods: [],
  statuses: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  bill: {
    header: [],
    bills: [],
    summary: [],
    totalItem: 0
  },
  billDetail: {
    header: [],
    billDetails: [],
    summary: [],
    totalItem: 0
  },
  billDetailList: {
    header: [],
    body: [],
    summary: [],
    totalItem: 0
  },
  machineModels: [],
  addressTypes: [],
  locations: [],
  dropStatusList: [],
  refundStatusList: [],
  listOrderDetail: [],
  listResourceSetting: [],
  listOrderDetailInvoice: [],
};
export function bill(state = initialState, action) {
  switch (action.type) {
    case types.BILL.INIT.SUCCESS:
      let { paging } = action.data.data;
      return {
        ...state,
        ...action.data.data,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.BILL.SEARCH.INDEX:
      return {
        ...state,
        bill: {
          header: [],
          bills: [],
          summary: [],
          totalItem: 0
        },
      };
    case types.BILL.SEARCH.SUCCESS:
      let {
        bills: billBody,
        header: billHeader,
        summary: billSummary,
        totalItem: billTotal
      } = action.data.data
      return {
        ...state,
        bill: {
          bills: billBody || [],
          header: billHeader || [],
          summary: billSummary || [],
          totalItem: billTotal || 0,
        }
      };
    case types.BILL.SEARCH_DETAIL.SUCCESS:
      let {
        billDetails: billDetailBody,
        header: billDetailHeader,
        summary: billDetailSummary,
        totalItem: billDetailTotal
      } = action.data.data
      return {
        ...state,
        billDetail: {
          billDetails: billDetailBody || [],
          header: billDetailHeader || [],
          summary: billDetailSummary || [],
          totalItem: billDetailTotal || 0,
        }
      };

    case types.BILL.SEARCH_BILL_DETAIL.SUCCESS:
      return {
        ...state,
        billDetailList: {
          body: action.data.data.billDetails || [],
          summary: action.data.data.summary || [],
          totalItem: action.data.data.totalItem || 0,
        }
      };
    case types.BILL.GET_LIST_ORDER_DETAIL.INDEX:
      return {
        ...state,
        listOrderDetail: [],
        total: 0
      };
    case types.BILL.GET_LIST_ORDER_DETAIL.SUCCESS:
      return {
        ...state,
        listOrderDetail: (action.data.data && action.data.data.billDetails) || [],
        listResourceSetting: (action.data.data && action.data.data.initDataModels) || [],
        total: (action.data.data && action.data.data.totalItem) || 0
      };
    case types.BILL.CREATE_INVOICE.INDEX:
      return {
        ...state,
        listOrderDetailInvoice: []
      };
    case types.BILL.CREATE_INVOICE.SUCCESS:
      return {
        ...state,
        listOrderDetailInvoice: action.data.data || [],
      };
    default:
      return state
  }
}