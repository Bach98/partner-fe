import { PATH } from "../constants";
import services from './api_services'

export const shortageRateReportServices = 
{
    init,
    search,
    exportExcel
};

function init(data) {
    return services.post(PATH.SHORTAGE_RATE_REPORT.INIT, data);
}

function search(data) {
    return services.post(PATH.SHORTAGE_RATE_REPORT.SEARCH, data);
}

function exportExcel(data){
    return services.post(PATH.SHORTAGE_RATE_REPORT.EXPORT_EXCEL, data);
}