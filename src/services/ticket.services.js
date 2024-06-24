import services from './api_services'
import { PATH } from '../constants';
export const ticketServices = {
  init,
  search,
  detail
};

function init(data) {
  return services.post(PATH.TICKET.INIT, data);
}

function search(data) {
  return services.post(PATH.TICKET.SEARCH, data);
}

function detail(data) {
  return services.post(PATH.TICKET.DETAIL, data);
}
