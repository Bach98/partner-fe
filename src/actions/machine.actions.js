import {
  machineServices,
  locationServices
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';
export const machineActions = {
  init,
  search,
  detail,
  gotoDetail,
  getDistrict,
  getWard
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.MACHINE.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    machineServices.init(body)
      .then(data => {
        dispatch({
          type: types.MACHINE.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.MACHINE.INIT.FAIL,
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
      type: types.MACHINE.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    machineServices.search(body)
      .then(data => {
        dispatch({
          type: types.MACHINE.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.MACHINE.SEARCH.FAIL,
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

function detail(body) {
  return dispatch => {
    dispatch({
      type: types.MACHINE.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    machineServices.detail(body)
      .then(data => {
        dispatch({
          type: types.MACHINE.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.MACHINE.DETAIL.FAIL,
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
      type: types.MACHINE.GOTO_DETAIL.SUCCESS,
      data: id
    });
  }
}


function getDistrict(body) {
  return dispatch => {
    dispatch({
      type: types.LOCATION.GET_DISTRICT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    locationServices.getDistrict(body)
      .then(data => {
        dispatch({
          type: types.LOCATION.GET_DISTRICT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.LOCATION.GET_DISTRICT.FAIL,
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

function getWard(body) {
  return dispatch => {
    dispatch({
      type: types.LOCATION.GET_WARD.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    locationServices.getWard(body)
      .then(data => {
        dispatch({
          type: types.LOCATION.GET_WARD.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.LOCATION.GET_WARD.FAIL,
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