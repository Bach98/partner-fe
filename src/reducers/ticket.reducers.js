import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  areaList: [],
  deviceList: [],
  locationList: [],
  methodPaymentList: [],
  organizationList: [],
  priorityList: [],
  solutionList: [],
  productList: [],
  sourceList: [],
  statusList: [],
  ticketTypeList: [],
  vendingMachineList: [],
  ticketList: [],
  total: 0,
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  ticketId: undefined,
  ticket: {},
};
export function ticket(state = initialState, action) {
  switch (action.type) {
    case types.TICKET.INIT.SUCCESS:
      let { paging } = action.data.data;
      return {
        ...state,
        areaList: action.data.data.areaList || [],
        deviceList: action.data.data.deviceList || [],
        locationList: action.data.data.locationList || [],
        methodPaymentList: action.data.data.methodPaymentList || [],
        organizationList: action.data.data.organizationList || [],
        priorityList: action.data.data.priorityList || [],
        solutionList: action.data.data.solutionList || [],
        productList: action.data.data.productList || [],
        sourceList: action.data.data.sourceList || [],
        statusList: action.data.data.statusList || [],
        ticketTypeList: action.data.data.ticketTypeList || [],
        vendingMachineList: action.data.data.vendingMachineList || [],
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.TICKET.SEARCH.SUCCESS:
      return {
        ...state,
        ticketList: action.data.data.ticketList || [],
        total: action.data.data.total
      };
    case types.TICKET.GOTO_DETAIL.SUCCESS:
      return {
        ...state,
        ticket: action.data.data || {},
        statusHistoryList: [],
        ticketId: action.data,
      };
    case types.TICKET.DETAIL.INDEX:
      return {
        ...state,
        ticket: {},
        statusHistoryList: [],
      }
    case types.TICKET.DETAIL.SUCCESS:
      return {
        ...state,
        ticket: action.data.data || {},
        statusHistoryList: action.data.data.statusHistoryList || [],
      }
    default:
      return state
  }
}