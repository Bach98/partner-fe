import services from './api_services'
import { PATH } from '../constants';
export const transactVendingLogServices = {
  init,
  search,
  exportExcel,
  exportExcelDetail,
  getTransactVendingLogDetail
};

function init(data) {
  return services.post(PATH.TRANSACT_VENDING_LOG.INIT, data);
}

function search(data) {
  return services.post(PATH.TRANSACT_VENDING_LOG.SEARCH, data);
}

function exportExcel(data) {
  return services.post(PATH.TRANSACT_VENDING_LOG.EXPORT_EXCEL, data);
}

function exportExcelDetail(data) {
  return services.post(PATH.TRANSACT_VENDING_LOG.EXPORT_EXCEL_DETAIL, data);
}

function getTransactVendingLogDetail(data) {
  return services.post(PATH.TRANSACT_VENDING_LOG.DETAIL, data);
}
