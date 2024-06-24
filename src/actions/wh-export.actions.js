import {
  whExportServices
} from '../services';
import {
  actionTypeConstants as types, LOCAL_PATH
} from '../constants';
import { showSuccessMessage } from "./index";
import {
  history
} from '../store';
export const whExportActions = {
  init,
  search,
  gotoDetail,
  detail,
  exportExcel,
  exportDetailExcel,
  getProductByLayout,
  getProductByInventoryMachine,
  edit,
  confirm
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.init(body)
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

function search(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.search(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.SEARCH.FAIL,
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
      type: types.WAREHOUSE_EXPORT.GOTO_DETAIL.SUCCESS,
      data: id
    });
  }
}

function detail(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.detail(body)
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.DETAIL.FAIL,
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
      type: types.WAREHOUSE_EXPORT.EXPORT.INDEX
    });
    return whExportServices.exportExcel({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.EXPORT.FAIL,
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

function exportDetailExcel(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.EXPORT_DETAIL_LIST.INDEX
    });
    return whExportServices.exportExcelDetailList({ data: body })
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

function getProductByLayout(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_LAYOUT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.getProductByLayout({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_LAYOUT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_LAYOUT.FAIL,
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

function getProductByInventoryMachine(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_INVENTORY_MACHINE.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.getProductByInventoryMachine({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_INVENTORY_MACHINE.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.GET_PRODUCT_BY_INVENTORY_MACHINE.FAIL,
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
function edit(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.EDIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.edit({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.EDIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        dispatch(showSuccessMessage("SUCCESS"));
        history.push(LOCAL_PATH.WAREHOUSE.EXPORT.DETAIL.replace(":id", data.data.id));
        dispatch(
          detail({ data: { exportId: data.data.id } })
        );
      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.EDIT.FAIL,
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

function confirm(body) {
  return dispatch => {
    dispatch({
      type: types.WAREHOUSE_EXPORT.CONFIRM.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    whExportServices.confirm({ data: body })
      .then(data => {
        dispatch({
          type: types.WAREHOUSE_EXPORT.CONFIRM.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        dispatch(showSuccessMessage("SUCCESS"));
        dispatch(
          detail({ data: { exportId: body.id } })
        );


      },
        error => {
          dispatch({
            type: types.WAREHOUSE_EXPORT.CONFIRM.FAIL,
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