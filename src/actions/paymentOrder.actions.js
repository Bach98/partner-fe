import {
  paymentOrderServices,
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';
export const paymentOrderActions = {
  init,
  search,
  refund,
  exportExcel,
  reRefund
};

function init() {
  return dispatch => {
    dispatch({
      type: types.PAYMENT_ORDER.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return paymentOrderServices.init()
      .then(data => {
        dispatch({
          type: types.PAYMENT_ORDER.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PAYMENT_ORDER.INIT.FAIL,
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
      type: types.PAYMENT_ORDER.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return paymentOrderServices.search({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYMENT_ORDER.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PAYMENT_ORDER.SEARCH.FAIL,
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

function reRefund(body) {
  return dispatch => {
    dispatch({
      type: types.PAYMENT_ORDER.RE_REFUND.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return paymentOrderServices.reRefund({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYMENT_ORDER.RE_REFUND.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.PAYMENT_ORDER.RE_REFUND.FAIL,
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
function refund(body) {
  return dispatch => {
    dispatch({
      type: types.PAYMENT_ORDER.REFUND.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return paymentOrderServices.refund({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYMENT_ORDER.REFUND.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.PAYMENT_ORDER.REFUND.FAIL,
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
      type: types.PAYMENT_ORDER.EXPORT.INDEX
    });
    return paymentOrderServices.exportExcel({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYMENT_ORDER.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.PAYMENT_ORDER.EXPORT.FAIL,
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
