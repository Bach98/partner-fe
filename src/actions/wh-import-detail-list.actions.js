import {
  whImportServices
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';
export const whImportDetailListActions = {
  initDetailList,
  searchDetailList,
  exportExcelDetailList
};

function initDetailList(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.initDetailList(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.INIT.FAIL,
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

function searchDetailList(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.SEARCH_DETAIL_LIST.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.searchDetailList(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.SEARCH_DETAIL_LIST.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.SEARCH_DETAIL_LIST.FAIL,
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


function exportExcelDetailList(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.EXPORT_DETAIL_LIST.INDEX
    });
    return whImportServices.exportExcelDetailList(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.EXPORT_DETAIL_LIST.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.EXPORT_DETAIL_LIST.FAIL,
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
