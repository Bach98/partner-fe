import {
  reconciliationRevenueServices,
} from '../services';
import {
  actionTypeConstants as types, LOCAL_PATH,
} from '../constants';
import { history } from '../store';

export const reconciliationRevenueActions = {
  init,
  search,
  exportExcel,
  exportForm,
  changeReconciliationStatus,
  gotoDetail,
  detail,
  getCashSheetDetail,
  searchMachine,
  create
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    reconciliationRevenueServices.init(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.INIT.FAIL,
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
      type: types.RECONCILIATION_REVENUE.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reconciliationRevenueServices.search(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.SEARCH.FAIL,
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
      type: types.RECONCILIATION_REVENUE.EXPORT.INDEX
    });
    return reconciliationRevenueServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.EXPORT.FAIL,
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

function exportForm(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.EXPORT_FORM.INDEX
    });
    return reconciliationRevenueServices.exportForm(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.EXPORT_FORM.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.EXPORT_FORM.FAIL,
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

function changeReconciliationStatus(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.CHANGE_RECONCILIATION_STATUS.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return reconciliationRevenueServices.changeReconciliationStatus(body)
      .then(res => {
        if (res.resultCode === "SUCCESS") {
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 1,
              message: res.message
            }
          });
        } else {
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: res.message
            }
          });
        }
        dispatch({
          type: types.RECONCILIATION_REVENUE.CHANGE_RECONCILIATION_STATUS.SUCCESS,
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.CHANGE_RECONCILIATION_STATUS.FAIL,
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

function gotoDetail(idCrypt) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.GOTO_DETAIL.SUCCESS,
      data: idCrypt
    });
  }
}

function detail(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reconciliationRevenueServices.detail(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.DETAIL.FAIL,
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

function getCashSheetDetail(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.GET_CASH_SHEET_DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reconciliationRevenueServices.getCashSheetDetail(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.GET_CASH_SHEET_DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.GET_CASH_SHEET_DETAIL.FAIL,
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

function searchMachine(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.SEARCH_MACHINE.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    reconciliationRevenueServices.searchMachine(body)
      .then(data => {
        dispatch({
          type: types.RECONCILIATION_REVENUE.SEARCH_MACHINE.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.SEARCH_MACHINE.FAIL,
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

function create(body) {
  return dispatch => {
    dispatch({
      type: types.RECONCILIATION_REVENUE.CREATE.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return reconciliationRevenueServices.create(body)
      .then(res => {
        if (res.resultCode === "SUCCESS") {
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 1,
              message: res.message
            }
          });
          history.push(LOCAL_PATH.FINANCE.RECONCILIATION_REVENUE.INDEX);
        } else {
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: res.message
            }
          });
        }
        dispatch({
          type: types.RECONCILIATION_REVENUE.CREATE.SUCCESS,
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.RECONCILIATION_REVENUE.CREATE.FAIL,
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
