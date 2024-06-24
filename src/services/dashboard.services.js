import services from './api_services'
import { PATH } from '../constants';
export const dashboardServices = {
  init,
  exportExcel
};

function init(data) {
  return services.post(PATH.DASHBOARD.INIT, data);
}
function exportExcel(data) {
  return services.post(PATH.DASHBOARD.EXPORT, data);
}
