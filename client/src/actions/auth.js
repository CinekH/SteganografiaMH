import { AUTH, AUTH_ERROR, ACTIVATE_ACCOUNT, USER_REGISTERED, ACTIVATE_ERROR, SET_MESSAGE, MESSAGE_CLEAR } from '../constants/actionTypes';
import { ACCOUNT_ACTIVATED_MESSAGE } from '../constants/messages';
import * as api from '../api/index.js';

export const signIn = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data });
        
        history.push('/');
    } catch (error) {
        if(error.response.status === 401) {
            dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ERROR, message: error.response.data.message })
        } else {
            dispatch({ type: SET_MESSAGE, messageType: AUTH_ERROR, message: error.response.data.message });
        }
    }
};

export const signUp = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: USER_REGISTERED, data });
        dispatch({ type: MESSAGE_CLEAR });
        dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ACCOUNT, message: data.message });

        history.push('/');
    } catch (error) {
        if(error.response.status === 401) {
            dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ERROR, message: error.response.data.message })
        } else {
            dispatch({ type: SET_MESSAGE, messageType: AUTH_ERROR, message: error.response.data.message });
        }
    }
};

export const activateAccount = (hash, history) => async (dispatch) => {
    try {
        const  { data } = await api.activateAccount(hash);

        dispatch({ type: ACTIVATE_ACCOUNT, data });
        dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ACCOUNT, message: ACCOUNT_ACTIVATED_MESSAGE });

        history.push('/'); 
    } catch (error) {
        dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ERROR, message: error.response.data.message });
        history.push('/'); 
    }
};

export const activationRepeat = (email, history) => async (dispatch) => {
    try {
        const { data } = await api.activationRepeat(email);

        dispatch({ type: USER_REGISTERED, data });
        dispatch({ type: MESSAGE_CLEAR });
        dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ACCOUNT, message: data.message });

        history.push('/');
    } catch (error) {
        if(error.response.status === 401) {
            dispatch({ type: SET_MESSAGE, messageType: ACTIVATE_ERROR, message: error.response.data.message })
        } else {
            dispatch({ type: SET_MESSAGE, messageType: AUTH_ERROR, message: error.response.data.message });
        }

    }
}