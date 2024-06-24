import {
  whInventoryServices
} from '../services';
import {
  actionTypeConstants as types
} from '../constants';

export const whInventoryActions = {
  init,
  search,
  exportExcel
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_INVENTORY.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whInventoryServices.init(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_INVENTORY.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_INVENTORY.INIT.FAIL,
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
      type: types.WAREHOUSE_INVENTORY.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whInventoryServices.search(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_INVENTORY.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_INVENTORY.SEARCH.FAIL,
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
      type: types.WAREHOUSE_INVENTORY.EXPORT.INDEX
    });
    return whInventoryServices.exportExcel({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_INVENTORY.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_INVENTORY.EXPORT.FAIL,
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
