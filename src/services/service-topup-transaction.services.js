import services from './api_services'
import { PATH } from '../constants';
export const serviceTopupTransactionServices = {
    init,
    search,
    exportExcel
};

function init(data) {
    return services.post(PATH.SERVICE_TOPUP_TRANSACTION.INIT, data);
}

function search(data) {
    return services.post(PATH.SERVICE_TOPUP_TRANSACTION.SEARCH, data);
}

function exportExcel(data) {
    return services.post(PATH.SERVICE_TOPUP_TRANSACTION.EXPORT_EXCEL, data);
}