import { reportCashServices, } from '../services';
import { actionTypeConstants as types, } from '../constants';
export const reportCashActions = {
  init,
  search,
  exportExcel,
  exportExcelDetail,
  getCashSheetDetail
};


function init(body) {
  return dispatch => {
    dispatch({
      type: types.REPORT_CASH.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reportCashServices.init(body)
      .then(data => {
        dispatch({
          type: types.REPORT_CASH.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.REPORT_CASH.INIT.FAIL,
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
      type: types.REPORT_CASH.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reportCashServices.search(body)
      .then(data => {
        dispatch({
          type: types.REPORT_CASH.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.REPORT_CASH.SEARCH.FAIL,
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
      type: types.REPORT_CASH.EXPORT.INDEX
    });
    return reportCashServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.REPORT_CASH.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.REPORT_CASH.EXPORT.FAIL,
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
      type: types.REPORT_CASH.EXPORT_DETAIL.INDEX
    });
    return reportCashServices.exportExcelDetail(body)
      .then(data => {
        dispatch({
          type: types.REPORT_CASH.EXPORT_DETAIL.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.REPORT_CASH.EXPORT_DETAIL.FAIL,
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

function getCashSheetDetail(body) {
  return dispatch => {
    dispatch({
      type: types.REPORT_CASH.GET_CASH_SHEET_DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reportCashServices.getCashSheetDetail(body)
      .then(data => {
        dispatch({
          type: types.REPORT_CASH.GET_CASH_SHEET_DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.REPORT_CASH.GET_CASH_SHEET_DETAIL.FAIL,
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