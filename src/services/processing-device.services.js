import services from './api_services'
import { PATH } from '../constants';
export const processingDeviceServices = {
  init,
  searchStatus,
  exportExcel,
  searchAliveHistory
};

function init(data) {
  return services.post(PATH.PROCESSING_DEVICE.INIT, data);
}

function searchStatus(data) {
  return services.post(PATH.PROCESSING_DEVICE.SEARCH_STATUS, data);
}

function exportExcel(data) {
  return services.post(PATH.PROCESSING_DEVICE.EXPORT_EXCEL, data);
}

function searchAliveHistory(data) {
  return services.post(PATH.PROCESSING_DEVICE.SEARCH_ALIVE_HISTORY, data);
}