import {
  payoutTransactionServices
} from '../services';
import { actionTypeConstants as types } from '../constants';

export const payoutTransactionActions = {
  init,
  search,
  detail,
  process,
  exportExcel
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.PAYOUT_TRANSACTION.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return payoutTransactionServices.init(body)
      .then(data => {
        dispatch({
          type: types.PAYOUT_TRANSACTION.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.PAYOUT_TRANSACTION.INIT.FAIL,
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
      type: types.PAYOUT_TRANSACTION.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return payoutTransactionServices.search({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYOUT_TRANSACTION.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.PAYOUT_TRANSACTION.SEARCH.FAIL,
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
function detail(body) {
  return dispatch => {
    dispatch({
      type: types.PAYOUT_TRANSACTION.DETAIL.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    payoutTransactionServices.detail({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYOUT_TRANSACTION.DETAIL.SUCCESS,
          data
        });

        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PAYOUT_TRANSACTION.DETAIL.FAIL,
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
      type: types.PAYOUT_TRANSACTION.PROCESS.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    return payoutTransactionServices.process({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYOUT_TRANSACTION.PROCESS.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        return data;
      },
        error => {
          dispatch({
            type: types.PAYOUT_TRANSACTION.PROCESS.FAIL,
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
      type: types.PAYOUT_TRANSACTION.EXPORT.INDEX
    });
    return payoutTransactionServices.exportExcel({ data: body })
      .then(data => {
        dispatch({
          type: types.PAYOUT_TRANSACTION.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.PAYOUT_TRANSACTION.EXPORT.FAIL,
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