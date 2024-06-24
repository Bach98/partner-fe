import services from './api_services'
import {
  PATH
} from '../constants';
export const permissionsServices = {
  initPermission,
  detailPermission,
  savePermission
};

function initPermission(data) {
  return services.post(PATH.USER.PERMISSION.INIT, data);
}

function detailPermission(data) {
  return services.post(PATH.USER.PERMISSION.DETAIL, data);
}

function savePermission(data) {
  return services.post(PATH.USER.PERMISSION.SAVE, data);
}