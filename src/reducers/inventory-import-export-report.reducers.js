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
  fromDate: undefined,
  toDate: undefined,
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  inventory: {
    totalItems: 0,
    inventoryList: []
  }
};
export function inventoryImportExportReport(state = initialState, action) {
  switch (action.type) {
    case types.INVENTORY_IMPORT_EXPORT_REPORT.INIT.SUCCESS:

      let { machines, products, machineModels, locations, locationAreaMachines, fromDate, toDate, paging } = action.data.data;
      return {
        ...state,
        machines: machines,
        products: products,
        machineModels: machineModels,
        locations: locations,
        locationAreaMachines: locationAreaMachines,
        fromDate: fromDate,
        toDate: toDate,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.INVENTORY_IMPORT_EXPORT_REPORT.SEARCH.SUCCESS:
      let {
        inventoryList,
        totalItem
      } = action.data.data;

      return {
        ...state,
        inventory: {
          inventoryList: inventoryList || [],
          totalItem: totalItem || 0
        }
      };
    default:
      return state
  }
}