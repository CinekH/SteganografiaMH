import { MESSAGE_CLEAR } from '../constants/actionTypes';

export const clearMessage = () => async (dispatch) => {
    try {
        dispatch({ type: MESSAGE_CLEAR });
    } catch (error) {
        console.log(error);
    }
};