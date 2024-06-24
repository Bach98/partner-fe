import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  detailInfo: {},
  deviceTypeList: [],
  operatingSystemList: [],
  connectStatusList: [],
  processingDeviceStatusList: [],
  disconnetHistoryList: [],
  totalItem: 0,
  totalItemHistory: 0,
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
};
export function processingDevice(state = initialState, action) {
  switch (action.type) {
    case types.PROCESSING_DEVICE.INIT.SUCCESS:
      return {
        ...state,
        detailInfo: {},
        deviceTypeList: action.data.data.deviceTypeList || [],
        operatingSystemList: action.data.data.operatingSystemList || [],
        connectStatusList: action.data.data.connectStatusList || [],
        paging: {
          pageSizes: [10, 20, 50, 100],
          pageSizeDefault: 10
        }
      };
    case types.PROCESSING_DEVICE.SEARCH_STATUS.SUCCESS:
      return {
        ...state,
        processingDeviceStatusList: action.data.data.processingDeviceList || [],
        totalItem: action.data.data.totalItem
      };
    case types.PROCESSING_DEVICE.SEARCH_ALIVE_HISTORY.SUCCESS:
      return {
        ...state,
        disconnetHistoryList: action.data.data.disconnetHistoryList || [],
        totalItemHistory: action.data.data.totalItem
      };
    default:
      return state
  }
}