import {
  actionTypeConstants as types
} from '../constants';

const initialState = {
  layout: {},
  machines: [],
  machineId: undefined,
  machineInfo: {},
  machineModels: [],
  addressTypes: [],
  cities: [],
  districts: [],
  wards: [],
  cityIdDefault: undefined,
  locations: [],
  locationAreaMachines: [],
  statusMaintenance: [],
  statusInternet: [],
  vendingMachineModels: [],
};
export function machine(state = initialState, action) {
  switch (action.type) {
    case types.MACHINE.INIT.SUCCESS:
      return {
        ...state,
        machines: action.data.data.machines,
        machineModels: action.data.data.machineModels,
        addressTypes: action.data.data.addressTypes,
        cities: action.data.data.cities,
        districts: action.data.data.districts,
        cityIdDefault: action.data.data.cityIdDefault,
        locations: action.data.data.locations,
        locationAreaMachines: action.data.data.locationAreaMachines,
        statusMaintenance: action.data.data.statusMaintenance,
        statusInternet: action.data.data.statusInternet,
        vendingMachineModels: action.data.data.vendingMachineModels,
      };
    case types.MACHINE.GOTO_DETAIL.SUCCESS:
      return {
        ...state,
        machineId: action.data,
      };
    case types.MACHINE.DETAIL.SUCCESS:
      return {
        ...state,
        ...action.data.data,
      };
    case types.LOCATION.GET_DISTRICT.SUCCESS:
      return {
        ...state,
        districts: action.data.data,
        wards: []
      };
    case types.LOCATION.GET_WARD.SUCCESS:
      return {
        ...state,
        wards: action.data.data
      };
    default:
      return state
  }
}