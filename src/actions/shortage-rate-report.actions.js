import {
  shortageRateReportServices,
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';

export const shortageRateReportActions = {
  init,
  search,
  exportExcel
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.SHORTAGE_RATE_REPORT.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    shortageRateReportServices.init(body)
      .then(data => {
        dispatch({
          type: types.SHORTAGE_RATE_REPORT.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.SHORTAGE_RATE_REPORT.INIT.FAIL,
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
      type: types.SHORTAGE_RATE_REPORT.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    shortageRateReportServices.search(body)
      .then(data => {
        dispatch({
          type: types.SHORTAGE_RATE_REPORT.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.SHORTAGE_RATE_REPORT.SEARCH.FAIL,
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
      type: types.SHORTAGE_RATE_REPORT.EXPORT.INDEX
    });
    return shortageRateReportServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.SHORTAGE_RATE_REPORT.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.SHORTAGE_RATE_REPORT.EXPORT.FAIL,
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
