import services from './api_services'
import { PATH } from '../constants';
export const whInventoryServices = {
  init,
  search,
  exportExcel
};

function init(data) {
  return services.post(PATH.WAREHOUSE_INVENTORY.INIT, data);
}
function search(data) {
  return services.post(PATH.WAREHOUSE_INVENTORY.SEARCH, data);
}
function exportExcel(data) {
  return services.post(PATH.WAREHOUSE_INVENTORY.EXPORT_EXCEL, data);
}
