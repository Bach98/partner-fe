import { PATH } from "../constants";
import services from './api_services'

export const cashLeftOverServices =
{
    init,
    search,
    process,
    exportExcel,
    getBankList
};

function init(data) {
    return services.post(PATH.CASH_LEFT_OVER.INIT, data);
}

function search(data) {
    return services.post(PATH.CASH_LEFT_OVER.SEARCH, data);
}

function process(data) {
    return services.post(PATH.CASH_LEFT_OVER.PROCESS, data);
}

function exportExcel(data) {
    return services.post(PATH.CASH_LEFT_OVER.EXPORT_EXCEL, data);
}

function getBankList(data) {
    return services.post(PATH.CASH_LEFT_OVER.GET_BANK, data);
}