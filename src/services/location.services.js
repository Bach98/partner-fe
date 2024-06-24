import services from './api_services'
import { PATH } from '../constants';
export const locationServices = {
  getDistrict,
  getWard
};


function getDistrict(data) {
  return services.post(PATH.LOCATION.GET_DISTRICT, data);
}

function getWard(data) {
  return services.post(PATH.LOCATION.GET_WARD, data);
}