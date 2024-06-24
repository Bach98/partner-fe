import services from './api_services'
import { PATH } from '../constants';
export const billServices = {
  init,
  search,
  searchDetail,
  exportExcel,
  exportExcelDetail,
  searchBillDetail,
  exportExcelBillDetail,
  getListOrderDetail,
  createInvoice,
  sendInvoice
};

function init(data) {
  return services.post(PATH.BILL.INIT, data);
}

function search(data) {
  return services.post(PATH.BILL.SEARCH, data);
}

function searchDetail(data) {
  return services.post(PATH.BILL.SEARCH_DETAIL, data);
}

function getListOrderDetail(data) {
  return services.post(PATH.BILL.GET_LIST_ORDER_DETAIL, data);
}

function searchBillDetail(data) {
  return services.post(PATH.BILL.SEARCH_BILL_DETAIL, data);
}

function exportExcel(data) {
  return services.post(PATH.BILL.EXPORT_EXCEL, data);
}

function exportExcelDetail(data) {
  return services.post(PATH.BILL.EXPORT_EXCEL_DETAIL, data);
}

function exportExcelBillDetail(data) {
  return services.post(PATH.BILL.EXPORT_EXCEL_BILL_DETAIL, data);
}

function createInvoice(data) {
  return services.post(PATH.BILL.CREATE_INVOICE, data);
}

function sendInvoice(data) {
  return services.post(PATH.BILL.SEND_INVOICE, data);
}