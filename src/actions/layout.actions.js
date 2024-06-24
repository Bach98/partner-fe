import {
  layoutConstants
} from '../constants';
export const toogleMenu = () => {
  return dispatch => {
    dispatch({
        type: layoutConstants.TOOGLE_MENU
    });
  }
}
export const ShowSpinner = () => {
  return dispatch => {
    dispatch( {
        type: layoutConstants.SHOW_SPINNER
    });
  }
}
export const menuClickItems = (item) => {
  return dispatch => {
    dispatch({
      type: layoutConstants.TOOGLE_SUB_ITEMS,
      item
    });
  }
}
// export const MenuClickItems = (item) => {
//   return dispatch => {
//     dispatch({
//         type: layoutConstants.TOOGLE_SUB_ITEMS,
//         item
//     });
//   }
// }
export const HideSpinner = () => {
  return dispatch => {
    dispatch({
      type: layoutConstants.HIDE_SPINNER
    });
  }
}
export const toogleUserMenu = () => {
  return dispatch => {
    dispatch({
      type: layoutConstants.TOOGLE_USER_MENU
    });
  }
}
export const toogleLanguage = () => {
  return dispatch => {
    dispatch({
      type: layoutConstants.TOOGLE_LANGUAGE
    });
  }
}

export const updatePartner = (partner) => {
  return dispatch => {
    dispatch({
      type: layoutConstants.UPDATE_PARTNER,
      partner
    })
  }
}