import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  warehouses: [],
  products: [],
  locations: [],

};
export function whInventory(state = initialState, action) {
  switch (action.type) {
    case types.WAREHOUSE_INVENTORY.INIT.SUCCESS:
      return {
        ...state,
        ...action.data.data,
      };
    case types.WAREHOUSE_INVENTORY.SEARCH.INDEX:
      return {
        ...state,
      };
    case types.WAREHOUSE_INVENTORY.SEARCH.SUCCESS:
      return {
        ...state,
        ...action.data.data,
      };
    default:
      return state
  }
}