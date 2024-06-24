import {
  inventoryImportExportReportServices
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';

export const inventoryImportExportReportActions = {
  init,
  search,
  exportExcel
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.INVENTORY_IMPORT_EXPORT_REPORT.INIT.INDEX
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });

    inventoryImportExportReportServices.init(body)
      .then(data => {
        dispatch({
          type: types.INVENTORY_IMPORT_EXPORT_REPORT.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.INVENTORY_IMPORT_EXPORT_REPORT.INIT.FAIL,
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
      type: types.INVENTORY_IMPORT_EXPORT_REPORT.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    inventoryImportExportReportServices.search(body)
      .then(data => {
        dispatch({
          type: types.INVENTORY_IMPORT_EXPORT_REPORT.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.INVENTORY_IMPORT_EXPORT_REPORT.SEARCH.FAIL,
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
      type: types.INVENTORY_IMPORT_EXPORT_REPORT.EXPORT.INDEX
    });
    return inventoryImportExportReportServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.INVENTORY_IMPORT_EXPORT_REPORT.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.INVENTORY_IMPORT_EXPORT_REPORT.EXPORT.FAIL,
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
