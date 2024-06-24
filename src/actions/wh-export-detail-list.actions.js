import {
  whExportServices
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';
export const whExportDetailListActions = {
  initDetailList,
  searchDetailList,
  exportExcelDetailList
};

function initDetailList(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.initDetailList(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.INIT.FAIL,
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
      type: types.WAREHOUSE_EXPORT.SEARCH_DETAIL_LIST.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.searchDetailList(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.SEARCH_DETAIL_LIST.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.SEARCH_DETAIL_LIST.FAIL,
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
    return whExportServices.exportExcelDetailList(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.EXPORT_DETAIL_LIST.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.EXPORT_DETAIL_LIST.FAIL,
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
