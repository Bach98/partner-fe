import services from './api_services'
import { PATH } from '../constants';
export const paymentOrderServices = {
  init,
  search,
  refund,
  exportExcel,
  reRefund
};

function init(data) {
  return services.post(PATH.PAYMENT_ORDER.INIT, data);
}

function search(data) {
  return services.post(PATH.PAYMENT_ORDER.SEARCH, data);
}

function refund(data) {
  return services.post(PATH.PAYMENT_ORDER.REFUND, data);
}

function reRefund(data) {
  return services.post(PATH.PAYMENT_ORDER.RE_REFUND, data);
}

function exportExcel(data) {
  return services.post(PATH.PAYMENT_ORDER.EXPORT_EXCEL, data);
}
