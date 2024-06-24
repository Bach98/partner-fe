import { transactVendingLogServices, } from '../services';
import { actionTypeConstants as types, } from '../constants';
export const transactVendingLogActions = {
  init,
  search,
  exportExcel,
  exportExcelDetail,
  getTransactVendingLogDetail
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.TRANSACT_VENDING_LOG.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    transactVendingLogServices.init(body)
      .then(data => {
        dispatch({
          type: types.TRANSACT_VENDING_LOG.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.TRANSACT_VENDING_LOG.INIT.FAIL,
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
      type: types.TRANSACT_VENDING_LOG.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    transactVendingLogServices.search(body)
      .then(data => {
        dispatch({
          type: types.TRANSACT_VENDING_LOG.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.TRANSACT_VENDING_LOG.SEARCH.FAIL,
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
      type: types.TRANSACT_VENDING_LOG.EXPORT.INDEX
    });
    return transactVendingLogServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.TRANSACT_VENDING_LOG.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.TRANSACT_VENDING_LOG.EXPORT.FAIL,
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


function exportExcelDetail(body) {
  return dispatch => {
    dispatch({
      type: types.TRANSACT_VENDING_LOG.EXPORT_DETAIL.INDEX
    });
    return transactVendingLogServices.exportExcelDetail(body)
      .then(data => {
        dispatch({
          type: types.TRANSACT_VENDING_LOG.EXPORT_DETAIL.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.TRANSACT_VENDING_LOG.EXPORT_DETAIL.FAIL,
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

function getTransactVendingLogDetail(body) {
  return dispatch => {
    dispatch({
      type: types.TRANSACT_VENDING_LOG.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return transactVendingLogServices.getTransactVendingLogDetail(body)
      .then(data => {
        dispatch({
          type: types.TRANSACT_VENDING_LOG.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.TRANSACT_VENDING_LOG.DETAIL.FAIL,
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
