import { MESSAGE_CLEAR, SET_MESSAGE } from '../constants/actionTypes';

const messageReducer = (state = { text: null }, action) => {
    switch(action.type) {
        case MESSAGE_CLEAR:
            return { ...state, text: null, type: null };
        case SET_MESSAGE:
            return { ...state, text: action?.message, type: action?.messageType };
        default:
            return state;
    }
}

export default messageReducer;
