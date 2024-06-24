import { PATH } from "../constants";
import services from './api_services'

export const adjustPriceServices =
{
    init,
    search,
    confirmAdjustPrice
};

function init(data) {
    return services.post(PATH.ADJUST_PRICE.INIT, data);
}

function search(data) {
    return services.post(PATH.ADJUST_PRICE.SEARCH, data);
}

function confirmAdjustPrice(data) {
    return services.post(PATH.ADJUST_PRICE.CONFIRM, data);
}