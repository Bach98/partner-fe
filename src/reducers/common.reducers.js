import { commonConstants } from '../constants';

const initialState = {
    positions: [],
    department: [],
    merchantTypes: [],
    businessLines: [],
    nations: [],
    cities: [],
    wards: [],
    streets: [],
    districts: [],
    merchants: [],
    branchs: [],
    stores: [],
    listAllDepartment: [],
    isLoadingMerchant: false,
    isLoadingBranch: false,
    isLoadingStore: false,
    previewContent: null,
    isShowConfirmPopup: false,
    dataConfirmPopup: {}
};

export function common(state = initialState, action) {
    switch (action.type) {
        case commonConstants.FETCH_POSITION:
            return state
        case commonConstants.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                positions: action.data
            };
        case commonConstants.FETCH_POSITION_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_DEPARTMENT:
            return {
                ...state,
                positions: []
            }
        case commonConstants.FETCH_DEPARTMENT_SUCCESS:
            return {
                ...state,
                department: action.data
            };
        case commonConstants.FETCH_DEPARTMENT_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_MERCHANT_TYPE:
            return state
        case commonConstants.FETCH_MERCHANT_TYPE_SUCCESS:
            return {
                ...state,
                merchantTypes: action.data
            };
        case commonConstants.FETCH_BUSINESS_LINE_SUCCESS:
            return {
                ...state,
                businessLines: action.data
            };
        case commonConstants.FETCH_MERCHANT_TYPE_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_NATION_SUCCESS:
            return {
                ...state,
                nations: action.data
            };
        case commonConstants.FETCH_NATION_FAIL:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_CITY_SUCCESS:
            return {
                ...state,
                cities: action.data
            };
        case commonConstants.FETCH_CITY_FAIL:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_DISTRICT_SUCCESS:
            return {
                ...state,
                districts: action.data
            };
        case commonConstants.FETCH_DISTRICT_FAIL:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_WARD_SUCCESS:
            return {
                ...state,
                wards: action.data
            };
        case commonConstants.FETCH_WARD_FAIL:
            return {
                ...state,
                error: action.error
            };
        case commonConstants.FETCH_STREET_SUCCESS:
            return {
                ...state,
                streets: action.data
            };
        case commonConstants.FETCH_STREET_FAIL:
            return {
                ...state,
                error: action.error
            };

        case commonConstants.FETCH_MERCHANT_SELECT:
            return {
                ...state,
                isLoadingMerchant: true
            };

        case commonConstants.FETCH_MERCHANT_SELECT_SUCCESS:
            return {
                ...state,
                merchants: action.data.content,
                isLoadingMerchant: false
            };

        case commonConstants.FETCH_MERCHANT_SELECT_FAIL:
            return {
                ...state,
                isLoadingMerchant: false
            };

        case commonConstants.FETCH_BRANCH_SELECT:
            return {
                ...state,
                isLoadingBranch: true
            };
        case commonConstants.FETCH_BRANCH_SELECT_SUCCESS:
            return {
                ...state,
                branchs: action.data.content,
                isLoadingBranch: false
            };

        case commonConstants.FETCH_BRANCH_SELECT_FAIL:
            return {
                ...state,
                isLoadingBranch: false
            };

        case commonConstants.FETCH_STORE_SELECT:
            return {
                ...state,
                isLoadingStore: true
            };

        case commonConstants.FETCH_STORE_SELECT_SUCCESS:
            return {
                ...state,
                stores: action.data.content,
                isLoadingStore: false
            };

        case commonConstants.FETCH_STORE_SELECT_FAIL:
            return {
                ...state,
                isLoadingStore: false
            };

        case commonConstants.GET_LIST_ALL_DEPARTMENT:
            return {
                ...state,
                listAllDepartment: action.data.content
            };

        case commonConstants.PREVIEW_CONTENT:
            return {
                ...state,
                previewContent: action.data
            };

        case commonConstants.RESET_DATA_PREVIEW_CONTENT:
            return {
                ...state,
                previewContent: null
            };

        case commonConstants.SHOW_CONFIRM_POPUP:
            return {
                ...state,
                isShowConfirmPopup: true,
                dataConfirmPopup: action.data
            };

        case commonConstants.HIDE_CONFIRM_POPUP:
            return {
                ...state,
                isShowConfirmPopup: false,
                dataConfirmPopup: {}
            };

        default:
            return state
    }
}