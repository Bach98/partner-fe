import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  products: [],
  machineModels: [],
  addressTypes: [],
  locations: [],
  locationAreaMachines: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  inventory: {
    totalItems: 0,
    inventories: []
  }
};
export function inventoryReport(state = initialState, action) {
  switch (action.type) {
    case types.INVENTORY_REPORT.INIT.SUCCESS:
     
      let { machines, products, machineModels, addressTypes, locations, locationAreaMachines, paging } = action.data.data;

      return {
        ...state,
        machines: machines,
        products: products,
        machineModels: machineModels,
        addressTypes: addressTypes,
        locations: locations,
        locationAreaMachines: locationAreaMachines,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.INVENTORY_REPORT.SEARCH.SUCCESS:

      let {
        inventories,
        totalItem
      } = action.data.data;

      return {
        ...state,
        inventory: {
          inventories: inventories || [],
          totalItem: totalItem || 0
        }
      };
    default:
      return state
  }
}