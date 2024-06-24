import services from './api_services'
import { PATH } from '../constants';
export const promotionServices = {
  init,
  search,
  detail,
  exportExcel,
  searchUserList,
  exportExcelUserList
};

function init(data) {
  return services.post(PATH.PROMOTION.INIT, data);
}

function search(data) {
  return services.post(PATH.PROMOTION.SEARCH, data);
}

function detail(data) {
  return services.post(PATH.PROMOTION.DETAIL, data);
}

function exportExcel(data) {
  return services.post(PATH.PROMOTION.EXPORT_EXCEL, data);
}

function searchUserList(body) {
  return services.post(PATH.PROMOTION.SEARCH_USER_LIST, body);
}

function exportExcelUserList(body) {
  return services.post(PATH.PROMOTION.EXPORT_EXCEL_USER_LIST, body);
}
