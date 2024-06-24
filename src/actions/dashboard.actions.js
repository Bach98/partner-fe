import {
    dashboardServices,
} from '../services';
import {
    actionTypeConstants as types,
} from '../constants';
export const dashboardActions = {
    init,
    exportExcel
};

function init(body) {
    return dispatch => {
        dispatch({
            type: types.DASHBOARD.INIT.INDEX
        });
        dispatch({
            type: types.LAYOUT.SHOW_SPINNER
        });
        dashboardServices.init(body)
            .then(data => {
                dispatch({
                    type: types.DASHBOARD.INIT.SUCCESS,
                    data
                });
                dispatch({
                    type: types.LAYOUT.HIDE_SPINNER
                });
            },
                error => {
                    dispatch({
                        type: types.DASHBOARD.INIT.FAIL,
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
            type: types.DASHBOARD.EXPORT.INDEX
        });
        return dashboardServices.exportExcel({ data: body })
            .then(data => {
                dispatch({
                    type: types.DASHBOARD.EXPORT.SUCCESS,
                    data
                });
                return data.data;
            },
                error => {
                    dispatch({
                        type: types.DASHBOARD.EXPORT.FAIL,
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
