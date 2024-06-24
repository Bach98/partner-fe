import { PATH } from "../constants";
import services from './api_services'

export const debtServices =
{
    init,
    search,
    exportExcel,
};

function init(data) {
    return services.post(PATH.DEBT.INIT, data);
}

function search(data) {
    return services.post(PATH.DEBT.SEARCH, data);
}

function exportExcel(data) {
    return services.post(PATH.DEBT.EXPORT_EXCEL, data);
}