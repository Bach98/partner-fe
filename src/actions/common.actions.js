import {
  actionTypeConstants as types,
  messageConstants
} from '../constants';

export function showSuccessMessage(message) {
  return (dispatch) => {
    let messContent = {
      type: 1,
      message: 'MESS_' + message
    };

    dispatch({
      type: types.MESSAGE.SHOW,
      messContent
    });
  }
}
export function showErrorMessage(message) {
  return (dispatch) => {
    let messContent = {
      type: 2,
      message: 'MESS.' + message
    };

    dispatch({
      type: messageConstants.SHOW_MESS,
      messContent
    });
  }
}
export function showErrorServer(error) {
  return (dispatch) => {
    let messContent = {
      type: 0,
      message: error
    };

    dispatch({
      type: types.MESSAGE.BACKEND,
      messContent
    });
  }
}