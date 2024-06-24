import services from './api_services'
import { PATH } from '../constants';
export const productServices = {
  init,
  search,
  exportExcel,
  editProduct
};

function init(data) {
  return services.post(PATH.PRODUCT.INIT, data);
}

function search(data) {
  return services.post(PATH.PRODUCT.SEARCH, data);
}

function exportExcel(data) {
  return services.post(PATH.PRODUCT.EXPORT_EXCEL, data);
}

function editProduct(data) {
  return services.post(PATH.PRODUCT.EDIT_PRODUCT, data);
}
