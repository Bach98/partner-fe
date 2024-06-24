import { PATH } from "../constants";
import services from './api_services'

export const payoutTransactionServices =
{
    init,
    search,
    detail,
    process,
    exportExcel
};

function init(data) {
    return services.post(PATH.PAYOUT_TRANSACTION.INIT, data);
}

function search(data) {
    return services.post(PATH.PAYOUT_TRANSACTION.SEARCH, data);
}

function detail(data) {
    return services.post(PATH.PAYOUT_TRANSACTION.DETAIL, data);
}

function process(data) {
    return services.post(PATH.PAYOUT_TRANSACTION.PROCESS, data);
}

function exportExcel(data) {
    return services.post(PATH.PAYOUT_TRANSACTION.EXPORT_EXCEL, data);
}