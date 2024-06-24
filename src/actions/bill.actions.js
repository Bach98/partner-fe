import {
  billServices,
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';
import { showSuccessMessage } from "./index";
export const billActions = {
  init,
  search,
  searchDetail,
  exportExcel,
  exportExcelDetail,
  searchBillDetail,
  exportExcelBillDetail,
  getListOrderDetail,
  createInvoice,
  sendInvoice
};

function init() {
  return dispatch => {
    dispatch({
      type: types.BILL.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    billServices.init()
      .then(data => {
        dispatch({
          type: types.BILL.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.BILL.INIT.FAIL,
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
      type: types.BILL.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    billServices.search(body)
      .then(data => {
        dispatch({
          type: types.BILL.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.BILL.SEARCH.FAIL,
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

function getListOrderDetail(body) {
  return dispatch => {
    dispatch({
      type: types.BILL.GET_LIST_ORDER_DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return billServices.getListOrderDetail(body)
      .then(data => {
        dispatch({
          type: types.BILL.GET_LIST_ORDER_DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.BILL.GET_LIST_ORDER_DETAIL.FAIL,
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

function searchDetail(body) {
  return dispatch => {
    dispatch({
      type: types.BILL.SEARCH_DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    billServices.searchDetail(body)
      .then(data => {
        dispatch({
          type: types.BILL.SEARCH_DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.BILL.SEARCH_DETAIL.FAIL,
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

function searchBillDetail(body) {
  return dispatch => {
    dispatch({
      type: types.BILL.SEARCH_BILL_DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    billServices.searchBillDetail(body)
      .then(data => {
        dispatch({
          type: types.BILL.SEARCH_BILL_DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.BILL.SEARCH_BILL_DETAIL.FAIL,
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
      type: types.BILL.EXPORT.INDEX
    });
    return billServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.BILL.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.BILL.EXPORT.FAIL,
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
      type: types.BILL.EXPORT_DETAIL.INDEX
    });
    return billServices.exportExcelDetail(body)
      .then(data => {
        dispatch({
          type: types.BILL.EXPORT_DETAIL.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.BILL.EXPORT_DETAIL.FAIL,
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

function exportExcelBillDetail(body) {
  return dispatch => {
    dispatch({
      type: types.BILL.EXPORT_BILL_DETAIL.INDEX
    });
    return billServices.exportExcelBillDetail(body)
      .then(data => {
        dispatch({
          type: types.BILL.EXPORT_BILL_DETAIL.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.BILL.EXPORT_BILL_DETAIL.FAIL,
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

function createInvoice(body) {
  return dispatch => {
    dispatch({
      type: types.BILL.CREATE_INVOICE.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return billServices.createInvoice(body)
      .then(data => {
        dispatch({
          type: types.BILL.CREATE_INVOICE.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.BILL.CREATE_INVOICE.FAIL,
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

function sendInvoice(body) {
  return dispatch => {
    dispatch({
      type: types.BILL.SEND_INVOICE.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return billServices.sendInvoice(body)
      .then(data => {
        dispatch({
          type: types.BILL.SEND_INVOICE.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        dispatch(showSuccessMessage("SUCCESS"));
      },
        error => {
          dispatch({
            type: types.BILL.SEND_INVOICE.FAIL,
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