import {
  actionTypeConstants as types
} from '../constants';
const initialState = {
  content: null
};
export function message(state = initialState, action) {
  switch (action.type) {
    case types.MESSAGE.SHOW:
      return {
        ...state,
        content: action.messContent
      };
    case types.MESSAGE.BACKEND:
      action.messContent.message = `MESS_BE_${action.messContent.message}`;
      return {
        ...state,
        content: action.messContent
      };
    case types.MESSAGE.CLEAR:
      return initialState
    default:
      return state
  }
}