import {
  actionTypeConstants as types,
} from '../constants';

const initialState = {
}

export function auth(state = initialState, action) {
  switch (action.type) {
    case types.AUTH.LOGOUT.SUCCESS:
      return {
        ...initialState
      }
    case types.AUTH.USERINFO.SUCCESS:
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}