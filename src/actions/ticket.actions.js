import {
  ticketServices
} from '../services';
import {
  actionTypeConstants as types,
} from '../constants';
export const ticketActions = {
  init,
  search,
  gotoDetail,
  detail
};

function init(body) {
  return dispatch => {
    dispatch({
      type: types.TICKET.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    ticketServices.init(body)
      .then(data => {
        dispatch({
          type: types.TICKET.INIT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.TICKET.INIT.FAIL,
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
      type: types.TICKET.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    ticketServices.search(body)
      .then(data => {
        dispatch({
          type: types.TICKET.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.TICKET.SEARCH.FAIL,
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
      type: types.TICKET.GOTO_DETAIL.SUCCESS,
      data: id
    });
  }
}


function detail(body) {
  return dispatch => {
    dispatch({
      type: types.TICKET.DETAIL.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    ticketServices.detail(body)
      .then(data => {
        dispatch({
          type: types.TICKET.DETAIL.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.TICKET.DETAIL.FAIL,
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

