import { PATH } from "../constants";
import services from './api_services'

export const reconciliationRevenueServices =
{
    init,
    search,
    exportExcel,
    exportForm,
    changeReconciliationStatus,
    detail,
    getCashSheetDetail,
    searchMachine,
    create
};

function init(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.INIT, data);
}

function search(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.SEARCH, data);
}

function exportExcel(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.EXPORT_EXCEL, data);
}

function exportForm(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.EXPORT_FORM, data);
}

function changeReconciliationStatus(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.CHANGE_RECONCILIATION_STATUS, data);
}

function detail(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.DETAIL, data);
}

function getCashSheetDetail(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.GET_CASH_SHEET_DETAIL, data);
}

function searchMachine(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.SEARCH_MACHINE, data);
}

function create(data) {
    return services.post(PATH.RECONCILIATION_REVENUE.CREATE, data);
}


