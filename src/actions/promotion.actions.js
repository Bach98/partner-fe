import { promotionServices, } from '../services';
import { actionTypeConstants as types, } from '../constants';
export const promotionActions = {
  init,
  search,
  gotoDetail,
  detail,
  exportExcel,
  searchUserList,
  exportExcelUserList
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.PROMOTION.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    promotionServices.init(body)
      .then(data => {
        dispatch({
          type: types.PROMOTION.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PROMOTION.INIT.FAIL,
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
      type: types.PROMOTION.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    promotionServices.search(body)
      .then(data => {
        dispatch({
          type: types.PROMOTION.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PROMOTION.SEARCH.FAIL,
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
      type: types.PROMOTION.GOTO_DETAIL.SUCCESS,
      data: id
    });
  }
}

function detail(body) {
  return dispatch => {
    dispatch({
      type: types.PROMOTION.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    promotionServices.detail(body)
      .then(data => {
        dispatch({
          type: types.PROMOTION.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PROMOTION.DETAIL.FAIL,
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
      type: types.PROMOTION.EXPORT.INDEX
    });
    return promotionServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.PROMOTION.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.PROMOTION.EXPORT.FAIL,
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


function searchUserList(body) {
  return dispatch => {
    dispatch({
      type: types.PROMOTION.PROMOTION_USER_LIST_SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    promotionServices.searchUserList(body)
      .then(data => {
        dispatch({
          type: types.PROMOTION.PROMOTION_USER_LIST_SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PROMOTION.PROMOTION_USER_LIST_SEARCH.FAIL,
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

function exportExcelUserList(body) {
  return dispatch => {
    dispatch({
      type: types.PROMOTION.EXPORT_EXCEL_USER_LIST.INDEX
    });
    return promotionServices.exportExcelUserList(body)
      .then(data => {
        dispatch({
          type: types.PROMOTION.EXPORT_EXCEL_USER_LIST.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.PROMOTION.EXPORT_EXCEL_USER_LIST.FAIL,
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