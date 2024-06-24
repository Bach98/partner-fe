import {
  layoutConstants
} from '../constants';
// import _ from 'lodash'
// import {
//   leftMenu
// } from '../data';
const initHeader = {
  isShowLanguage: false,
  isShowUserMenu: false
};
const initialState = {
  header: initHeader,
  countLoadingContainer: 0
}
export function layout(state = initialState, action) {
  let countLoadingContainer = 0;

  switch (action.type) {

    case layoutConstants.TOOGLE_LANGUAGE:
      let {
        isShowLanguage
      } = state.header
      return {
        ...state,
        header: {
          ...state.header,
          isShowLanguage: !isShowLanguage,
          isShowUserMenu: false
        }
      };

    case layoutConstants.SHOW_SPINNER:
      countLoadingContainer = state.countLoadingContainer + 1;

      return {
        ...state,
        countLoadingContainer: countLoadingContainer
      };
    case layoutConstants.HIDE_SPINNER:
      countLoadingContainer = state.countLoadingContainer - 1;

      countLoadingContainer = countLoadingContainer > 0 ? countLoadingContainer : 0;

      return {
        ...state,
        countLoadingContainer: countLoadingContainer
      };

    case layoutConstants.UPDATE_PARTNER:
      let { partner } = action
      let menu = state.leftmenu;
      let reports = menu.items.find(k => k.name === 'reports')
      if (reports) {
        delete reports.path;
        reports.child = reports.child || [];
        partner.map(k => {
          let lowcase = k.name.toLowerCase()
          reports.child.push({
            name: (`reports.${lowcase}`).toLowerCase(),
            title: k.name,
            path: `/reports/${lowcase}`,
            isActive: false,
            permissions: `reports.${k.code}.VIEW`,
          })
          return k
        })
      }
      return {
        ...state,
        leftmenu: menu
      }
    default:
      return state
  }
}