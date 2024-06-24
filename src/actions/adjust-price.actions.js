import {
  adjustPriceServices,
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';

export const adjustPriceActions = {
  init,
  search,
  confirmAdjustPrice
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.ADJUST_PRICE.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    adjustPriceServices.init(body)
      .then(data => {
        dispatch({
          type: types.ADJUST_PRICE.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.ADJUST_PRICE.INIT.FAIL,
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
      type: types.ADJUST_PRICE.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    adjustPriceServices.search(body)
      .then(data => {
        dispatch({
          type: types.ADJUST_PRICE.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.ADJUST_PRICE.SEARCH.FAIL,
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

function confirmAdjustPrice(body) {
  return dispatch => {
    dispatch({
      type: types.ADJUST_PRICE.CONFIRM.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    adjustPriceServices.confirmAdjustPrice(body)
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
          type: types.ADJUST_PRICE.CONFIRM.SUCCESS,
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.ADJUST_PRICE.CONFIRM.FAIL,
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
