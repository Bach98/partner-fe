import services from './api_services'
import { PATH } from '../constants';
export const whImportServices = {
  init,
  search,
  detail,
  exportExcel,
  initDetailList,
  searchDetailList,
  exportExcelDetailList,
  importExcel,
  save,
  confirm
};

function init(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.INIT, data);
}
function search(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.SEARCH, data);
}

function detail(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.DETAIL, data);
}

function save(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.SAVE, data);
}

function confirm(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.CONFIRM, data);
}

function exportExcel(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.EXPORT_EXCEL, data);
}

function initDetailList(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.INIT_DETAIL_LIST, data);
}

function searchDetailList(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.SEARCH_DETAIL_LIST, data);
}

function exportExcelDetailList(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.EXPORT_EXCEL_DETAIL_LIST, data);
}

function importExcel(data) {
  return services.post(PATH.WAREHOUSE_IMPORT.IMPORT_EXCEL, data, "file");
}
