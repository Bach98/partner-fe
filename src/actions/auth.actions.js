import {
  authService, commonServices,
} from '../services';
import { actionTypeConstants as types, commonConstants, LOCAL_PATH } from '../constants';
import { history } from '../store';
import { showSuccessMessage, showErrorServer } from "./index";
export const authActions = {
  login,
  logout,
  userInfo,
  changePassword
};

function login(body) {
  return dispatch => {
    dispatch({
      type: types.AUTH.LOGIN.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    authService.login(body)
      .then(data => {
        dispatch({
          type: types.AUTH.LOGIN.SUCCESS,
          data
        });
        localStorage.setItem("acc_token", JSON.stringify(data));
        dispatch(userInfo())
          .then(e => {
            var redirectUrl = e.data.redirectUrl;
            let prevPageVisit = localStorage.getItem("prevPageVisit");

            if (prevPageVisit) {
              localStorage.removeItem("prevPageVisit");
              history.push(prevPageVisit);
            } else {
              if (!!redirectUrl) {
                history.push(redirectUrl);
              }
            }
            dispatch({
              type: types.LAYOUT.HIDE_SPINNER
            });
          });
      },
        error => {
          dispatch({
            type: types.AUTH.LOGIN.FAIL,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER
          });
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 2,
              message: error.error_description
            }
          });
        }
      );
  };
}

function logout() {
  return dispatch => {
    dispatch({
      type: types.AUTH.LOGOUT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    authService.logout({})
      .then(data => {
        dispatch({
          type: types.AUTH.LOGOUT.SUCCESS,
          data
        });
        localStorage.removeItem("acc_token");
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        history.push(LOCAL_PATH.EMPTY);
      },
        error => {
          dispatch({
            type: types.AUTH.LOGOUT.FAIL,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER
          });
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: error.code
            }
          });
        }
      );
  };
}

function userInfo(body) {
  let acc_token = localStorage.acc_token;
  if (!acc_token) {
    let pageURL = window.location.pathname;
    if (pageURL !== LOCAL_PATH.LOGIN) {
      localStorage.setItem("prevPageVisit", window.location.pathname);
    }
    return dispatch => null;
  }
  return dispatch => {
    dispatch({
      type: types.AUTH.USERINFO.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return authService.userInfo(body)
      .then(data => {
        let { data: { user, redirectUrl, permissionList } } = data;
        dispatch({
          type: types.AUTH.USERINFO.SUCCESS,
          data: { userInfo: user, userPermission: permissionList || [], redirectUrl }
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });

        return data;
      },
        error => {
          dispatch({
            type: types.AUTH.USERINFO.FAIL,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER
          });
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: error.code
            }
          });
          if (!!error.code) {
            localStorage.clear();
            history.push(LOCAL_PATH.LOGIN);
          }
        }
      );
  };
}

function changePassword(body) {
  return (dispatch) => {
    dispatch({
      type: commonConstants.CHANGE_PASSWORD
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER,
    });
    commonServices.changePassword(body)
      .then(data => {
        if (data.resultCode === "SUCCESS") {
          dispatch({
            type: commonConstants.CHANGE_PASSWORD_SUCCESS,
            data,
          });
          localStorage.removeItem("acc_token");
          history.push(LOCAL_PATH.EMPTY);
          dispatch(showSuccessMessage("SUCCESS"));
        } else {
          dispatch({
            type: commonConstants.CHANGE_PASSWORD_FAIL
          });
          dispatch(showErrorServer(data.message));
        }
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER,
        });
      }
      )
      .catch(
        error => {
          dispatch({
            type: commonConstants.CHANGE_PASSWORD_FAIL
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER,
          });
          dispatch(showErrorServer("FAIL"));
          // dispatch({
          //   type: types.MESSAGE.BACKEND,
          //   messContent: {
          //     type: 0,
          //     message: error.message
          //   }
          // });
        }
      );
  }
}