import {
  PATH
} from '../constants';
import services from './api_services'
export const authService = {
  login,
  logout,
  userInfo
};

function login(body) {
  return services.postLogin(PATH.AUTH.LOGIN, body);
}

function logout(body) {
  return services.post(PATH.AUTH.LOGOUT, body);
}

function userInfo() {
  return services.post(PATH.AUTH.GET_USER_INFO, {});
}
