import { productServices, } from '../services';
import { actionTypeConstants as types, } from '../constants';
import { showSuccessMessage } from "./index";
export const productActions = {
  init,
  search,
  exportExcel,
  editProduct
};


function init(body) {
  return dispatch => {
    dispatch({
      type: types.PRODUCT.INIT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    dispatch({
      type: types.PRODUCT.INIT.SUCCESS,
    });
    dispatch({
      type: types.LAYOUT.HIDE_SPINNER
    });
  }
}

// function init(body) {
//   return dispatch => {
//     dispatch({
//       type: types.PRODUCT.INIT.INDEX
//     });
//     dispatch({
//       type: types.LAYOUT.SHOW_SPINNER
//     });
//     productServices.init(body)
//       .then(data => {
//         dispatch({
//           type: types.PRODUCT.INIT.SUCCESS,
//           data
//         });
//         dispatch({
//           type: types.LAYOUT.HIDE_SPINNER
//         });
//       },
//         error => {
//           dispatch({
//             type: types.PRODUCT.INIT.FAIL,
//           });
//           dispatch({
//             type: types.LAYOUT.HIDE_SPINNER
//           });
//           dispatch({
//             type: types.MESSAGE.BACKEND,
//             messContent: {
//               type: 0,
//               message: error.code
//             }
//           });
//         }
//       );
//   };
// }

function search(body) {
  return dispatch => {
    dispatch({
      type: types.PRODUCT.SEARCH.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    productServices.search(body)
      .then(data => {
        dispatch({
          type: types.PRODUCT.SEARCH.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
      },
        error => {
          dispatch({
            type: types.PRODUCT.SEARCH.FAIL,
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

function editProduct(body) {
  return dispatch => {
    dispatch({
      type: types.PRODUCT.EDIT_PRODUCT.INDEX
    });
    dispatch({
      type: types.LAYOUT.SHOW_SPINNER
    });
    productServices.editProduct({ data: body })
      .then(data => {
        dispatch({
          type: types.PRODUCT.EDIT_PRODUCT.SUCCESS,
          data
        });
        dispatch({
          type: types.LAYOUT.HIDE_SPINNER
        });
        dispatch(showSuccessMessage("SUCCESS"));
        dispatch(search({
          data: {
            paging: {
              pageIndex: 1,
              pageSize: 10,
            }
          }
        }))
      },
        error => {
          dispatch({
            type: types.PRODUCT.EDIT_PRODUCT.FAIL,
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
      type: types.PRODUCT.EXPORT.INDEX
    });
    return productServices.exportExcel(body)
      .then(data => {
        dispatch({
          type: types.PRODUCT.EXPORT.SUCCESS,
          data
        });
        return data.data;
      },
        error => {
          dispatch({
            type: types.PRODUCT.EXPORT.FAIL,
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