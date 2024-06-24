import { PATH } from "../constants";
import services from './api_services'

export const inventoryDetailReportServices =
{
    init,
    search,
    exportExcel
};

function init(data) {
    return services.post(PATH.INVENTORY_DETAIL_REPORT.INIT, data);
}

function search(data) {
    return services.post(PATH.INVENTORY_DETAIL_REPORT.SEARCH, data);
}

function exportExcel(data) {
    return services.post(PATH.INVENTORY_DETAIL_REPORT.EXPORT_EXCEL, data);
}