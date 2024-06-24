import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  machines: [],
  products: [],
  addressTypes: [],
  locations: [],
  locationAreaMachines: [],
  machineModels: [],
  suppliers: [],
  statusBusiness: [],
  statusMaintenance: [],
  statusUsingGoods: [],
  statusBusinessGoods: [],
  paging: {
    pageSizes: [10, 20, 50, 100],
    pageSizeDefault: 10
  },
  inventory: {
    totalItems: 0,
    inventories: []
  },
  lstInventoryDetail: []
};
export function shortageRateReport(state = initialState, action) {
  switch (action.type) {
    case types.SHORTAGE_RATE_REPORT.INIT.SUCCESS:
     
      let { machines, products, addressTypes, locations, locationAreaMachines, machineModels, suppliers, categories,
        statusBusiness, statusMaintenance, statusUsingGoods, statusBusinessGoods, shortageRateFrom, shortageRateTo, paging } = action.data.data;

      return {
        ...state,
        machines: machines,
        products: products,
        addressTypes: addressTypes,
        locations : locations,
        locationAreaMachines : locationAreaMachines,
        machineModels: machineModels,
        suppliers: suppliers,
        categories: categories,
        statusBusiness: statusBusiness,
        statusMaintenance: statusMaintenance,
        statusUsingGoods: statusUsingGoods,
        statusBusinessGoods: statusBusinessGoods,
        shortageRateFrom: shortageRateFrom,
        shortageRateTo: shortageRateTo,
        paging: {
          pageSizes: paging.map(k => k.pageSize),
          pageSizeDefault: paging.find(k => k.selected).pageSize || 10
        }
      };
    case types.SHORTAGE_RATE_REPORT.SEARCH.SUCCESS:

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
      case types.SHORTAGE_RATE_REPORT.INVENTORY_DETAIL:
        return {
          ...state,
          lstInventoryDetail: action.data.data.inventories,
        };
    default:
      return state
  }
}