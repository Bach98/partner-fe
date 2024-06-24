import services from './api_services'
import { PATH } from '../constants';
export const machineServices = {
  init,
  search,
  detail,
};

function init(data) {
  return services.post(PATH.MACHINE.INIT, data);
}

function search(data) {
  return services.post(PATH.MACHINE.SEARCH, data);
}

function detail(data) {
  return services.post(PATH.MACHINE.DETAIL, data);
}