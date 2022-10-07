import { SET_MESSAGE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const sendMail = (formData, config) => async (dispatch) => {
    try {
        const { data } = await api.sendMail(formData, config);

        dispatch({ type: SET_MESSAGE, messageType: "MAIL_SENT", message: data.message });
    } catch (error) {
        dispatch({ type: SET_MESSAGE, messageType: "MAIL_ERROR", message: error.response.data.message });
    }
};
