import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  productIds: [],
  reconciliationStatus: [],
  machineModels: [],
  addressTypes: [],
  locations: [],
  locationAreaMachines: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  lstProduct: [],
};
export function adjustPrice(state = initialState, action) {
  switch (action.type) {
    case types.ADJUST_PRICE.INIT.SUCCESS:

      let { machines, productIds, machineModels, addressTypes, locations, locationAreaMachines, paging } = action.data.data;

      return {
        ...state,
        machines: machines,
        productIds: productIds,
        machineModels: machineModels,
        addressTypes: addressTypes,
        locations: locations,
        locationAreaMachines: locationAreaMachines,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.ADJUST_PRICE.SEARCH.SUCCESS:
      return {
        ...state,
        lstProduct: action.data.data
      };
    case types.ADJUST_PRICE.CONFIRM.SUCCESS:
      return {
        ...state,
      };
    default:
      return state
  }
}