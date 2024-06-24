import {
  whImportServices
} from '../services';
import {
  actionTypeConstants as types, LOCAL_PATH
} from '../constants';
import { showSuccessMessage } from "./index";
import {
  history
} from '../store';
export const whImportActions = {
  init,
  search,
  gotoDetail,
  detail,
  exportExcel,
  importExcel,
  save,
  confirm
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.init(body)
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

function search(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.search(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.SEARCH.FAIL,
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


function gotoDetail(id) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.GOTO_DETAIL.SUCCESS,
      data: id
    });
  }
}


function detail(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.detail(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.DETAIL.FAIL,
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

function save(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.SAVE.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.save({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.SAVE.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        dispatch(showSuccessMessage("SUCCESS"));
        history.push(LOCAL_PATH.WAREHOUSE.IMPORT.DETAIL.replace(":id", data.data.id));
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.SAVE.FAIL,
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
      type: types.WAREHOUSE_IMPORT.EXPORT.INDEX
    });
    return whImportServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.EXPORT.FAIL,
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

function importExcel(body, id) {
  return (dispatch) => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.IMPORT_EXCEL.INDEX,
    });

    dispatch({
      type: types.LAYOUT.SHOW_SPINNER,
    });

    return whImportServices.importExcel(body, id)
      .then(data => {

        dispatch({
          type: types.LAYOUT.HIDE_SPINNER,
        });
        let { resultCode, message } = data
        if (resultCode && resultCode === "FAIL") {
          return dispatch({
            type: types.MESSAGE.BACKEND,
            messContent: {
              type: 2,
              message: message,
            }
          });
        } else if (resultCode && resultCode === "SUCCESS") {
          dispatch({
            type: types.WAREHOUSE_IMPORT.IMPORT_EXCEL.SUCCESS,
            data,
          });
        }
      },
        (error) => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.IMPORT_EXCEL.FAIL,
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
  };
}

function confirm(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_IMPORT.CONFIRM.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whImportServices.confirm({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_IMPORT.CONFIRM.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        dispatch(showSuccessMessage("SUCCESS"));
        dispatch(detail({ data: { importId: body.id } }));
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_IMPORT.CONFIRM.FAIL,
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