import { PATH } from "../constants";
import services from './api_services'

export const materialInventoryReportServices = 
{
    init,
    search,
    exportExcel
};

function init(data) {
    return services.post(PATH.MATERIAL_INVENTORY_REPORT.INIT, data);
}

function search(data) {
    return services.post(PATH.MATERIAL_INVENTORY_REPORT.SEARCH, data);
}

function exportExcel(data){
    return services.post(PATH.MATERIAL_INVENTORY_REPORT.EXPORT_EXCEL, data);
}