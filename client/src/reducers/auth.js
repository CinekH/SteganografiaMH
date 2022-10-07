import { AUTH, LOGOUT, AUTH_ERROR, ACTIVATE_ACCOUNT, ACTIVATE_ERROR, USER_REGISTERED } from '../constants/actionTypes'

const authReducer = (state = { authData: null, message: null }, action) => {
    switch(action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data, message: null };
        case USER_REGISTERED:
            return { ...state, message: action?.data.message };
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null, message: null };
        case AUTH_ERROR:
            localStorage.clear();
            return { ...state, message: action?.message };
        case ACTIVATE_ERROR:
            return { ...state, message: action?.message };
        case ACTIVATE_ACCOUNT:
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data, message: "Aktywacja konta przebiegła pomyślnie" };
        default:
            return state;
    }
}

export default authReducer;
