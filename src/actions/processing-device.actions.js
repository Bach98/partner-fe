import { processingDeviceServices } from "../services";
import { actionTypeConstants as types } from "../constants";
export const processingDeviceActions = {
  init,
  searchStatus,
  exportExcel,
  searchAliveHistory
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.PROCESSING_DEVICE.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    processingDeviceServices.init(body)
      .then(data => {
        dispatch({
          type: types.PROCESSING_DEVICE.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PROCESSING_DEVICE.INIT.FAIL,
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

function searchStatus(body) {
  return (dispatch) => {
    dispatch({
      type: types.PROCESSING_DEVICE.SEARCH_STATUS.INDEX,
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER,
    });
    processingDeviceServices.searchStatus(body)
      .then(
        data => {
          dispatch({
            type: types.PROCESSING_DEVICE.SEARCH_STATUS.SUCCESS,
            data,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER,
          });
        }
      )
      .catch(
        error => {
          dispatch({
            type: types.PROCESSING_DEVICE.SEARCH_STATUS.FAIL,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER,
          });
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: error.code,
            },
          });
        }
      );
  }
}

function exportExcel(body) {
  return dispatch => {
    dispatch({
      type: types.PROCESSING_DEVICE.EXPORT.INDEX
    });
    return processingDeviceServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.PROCESSING_DEVICE.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.PROCESSING_DEVICE.EXPORT.FAIL,
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

function searchAliveHistory(body) {
  return (dispatch) => {
    dispatch({
      type: types.PROCESSING_DEVICE.SEARCH_ALIVE_HISTORY.INDEX,
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER,
    });
    processingDeviceServices.searchAliveHistory(body)
      .then(
        data => {
          dispatch({
            type: types.PROCESSING_DEVICE.SEARCH_ALIVE_HISTORY.SUCCESS,
            data,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER,
          });
        }
      )
      .catch(
        error => {
          dispatch({
            type: types.PROCESSING_DEVICE.SEARCH_ALIVE_HISTORY.FAIL,
          });
          dispatch({
            type: types.LAYOUT.HIDE_SPINNER,
          });
          dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 0,
              message: error.code,
            },
          });
        }
      );
  }
}
