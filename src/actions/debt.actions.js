import { debtServices } from '../services';
import { actionTypeConstants as types } from '../constants';

export const debtActions = {
  init,
  search,
  exportExcel,
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.DEBT.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    debtServices.init(body)
      .then(data => {
        dispatch({
          type: types.DEBT.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.DEBT.INIT.FAIL,
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
      type: types.DEBT.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    debtServices.search(body)
      .then(data => {
        dispatch({
          type: types.DEBT.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.DEBT.SEARCH.FAIL,
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
      type: types.DEBT.EXPORT.INDEX
    });
    return debtServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.DEBT.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.DEBT.EXPORT.FAIL,
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
