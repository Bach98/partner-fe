import services from './api_services'
import { PATH } from '../constants';
export const reportCashServices = {
  init,
  search,
  exportExcel,
  exportExcelDetail,
  getCashSheetDetail
};

function init(data) {
  return services.post(PATH.REPORT_CASH.INIT, data);
}

function search(data) {
  return services.post(PATH.REPORT_CASH.SEARCH, data);
}

function exportExcel(data) {
  return services.post(PATH.REPORT_CASH.EXPORT_EXCEL, data);
}

function exportExcelDetail(data) {
  return services.post(PATH.REPORT_CASH.EXPORT_EXCEL_DETAIL, data);
}


function getCashSheetDetail(data) {
  return services.post(PATH.REPORT_CASH.GET_CASH_SHEET_DETAIL, data);
}