import services from './api_services'
import { PATH } from '../constants';
export const whExportServices = {
  init,
  search,
  detail,
  exportExcel,
  initDetailList,
  searchDetailList,
  exportExcelDetailList,
  getProductByLayout,
  getProductByInventoryMachine,
  edit,
  confirm
};

function init(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.INIT, data);
}

function search(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.SEARCH, data);
}

function detail(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.DETAIL, data);
}

function exportExcel(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.EXPORT_EXCEL, data);
}

function initDetailList(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.INIT_DETAIL_LIST, data);
}

function searchDetailList(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.SEARCH_DETAIL_LIST, data);
}

function exportExcelDetailList(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.EXPORT_EXCEL_DETAIL_LIST, data);
}

function getProductByLayout(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.GET_PRODUCT_BY_LAYOUT, data);
}

function getProductByInventoryMachine(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.GET_PRODUCT_BY_INVENTORY_MACHINE, data);
}

function edit(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.EDIT, data);
}

function confirm(data) {
  return services.post(PATH.WAREHOUSE_EXPORT.CONFIRM, data);
}
