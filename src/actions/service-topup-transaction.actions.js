import { serviceTopupTransactionServices } from '../services';
import { actionTypeConstants as types, } from '../constants';
export const serviceTopupTransactionActions = {
  init,
  search,
  exportExcel
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.SERVICE_TOPUP_TRANSACTION.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    serviceTopupTransactionServices.init(body)
      .then(data => {
        dispatch({
          type: types.SERVICE_TOPUP_TRANSACTION.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.SERVICE_TOPUP_TRANSACTION.INIT.FAIL,
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

function search(body) {
  return dispatch => {
    dispatch({
      type: types.SERVICE_TOPUP_TRANSACTION.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    serviceTopupTransactionServices.search(body)
      .then(data => {
        dispatch({
          type: types.SERVICE_TOPUP_TRANSACTION.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.SERVICE_TOPUP_TRANSACTION.SEARCH.FAIL,
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

function exportExcel(body) {
  return dispatch => {
    dispatch({
      type: types.SERVICE_TOPUP_TRANSACTION.EXPORT.INDEX
    });
    return serviceTopupTransactionServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.SERVICE_TOPUP_TRANSACTION.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.SERVICE_TOPUP_TRANSACTION.EXPORT.FAIL,
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
