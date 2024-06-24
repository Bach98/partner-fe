import {
  cashLeftOverServices
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';

export const cashLeftOverActions = {
  init,
  search,
  process,
  exportExcel,
  getBankList
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.CASH_LEFT_OVER.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    cashLeftOverServices.init(body)
      .then(data => {
        dispatch({
          type: types.CASH_LEFT_OVER.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.CASH_LEFT_OVER.INIT.FAIL,
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
      type: types.CASH_LEFT_OVER.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    cashLeftOverServices.search(body)
      .then(data => {
        dispatch({
          type: types.CASH_LEFT_OVER.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.CASH_LEFT_OVER.SEARCH.FAIL,
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
function process(body) {
  return dispatch => {
    dispatch({
      type: types.CASH_LEFT_OVER.PROCESS.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return cashLeftOverServices.process(body)
      .then(data => {
        if (data.resultCode === "SUCCESS") {
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 1,
              message: data.message
            }
          });
        } else {
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: data.message
            }
          });
        }
        dispatch({
          type: types.CASH_LEFT_OVER.PROCESS.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      }, error => {
        dispatch({
          type: types.CASH_LEFT_OVER.PROCESS.FAIL,
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
      type: types.CASH_LEFT_OVER.EXPORT.INDEX
    });
    return cashLeftOverServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.CASH_LEFT_OVER.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.CASH_LEFT_OVER.EXPORT.FAIL,
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

function getBankList(body) {
  return dispatch => {
    dispatch({
      type: types.CASH_LEFT_OVER.BANK.INDEX
    });
    return cashLeftOverServices.getBankList(body)
      .then(data => {
        dispatch({
          type: types.CASH_LEFT_OVER.BANK.SUCCESS,
          data
        });
        return data;
      },
        error => {
          dispatch({
            type: types.CASH_LEFT_OVER.BANK.FAIL,
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
