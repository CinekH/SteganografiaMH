import { SET_IMAGE, SET_DATA, SET_GALLERY, SET_DECODED_DATA, SET_USER_IMAGES, DELETE_IMAGE } from '../constants/actionTypes';

const imageReducer = (state = { base64: null, data: null, gallery: [], userImages: { images: [], count: 0 } }, action) => {
    switch(action.type) {
        case SET_IMAGE:
            return { ...state, base64: action?.data.data };
        case SET_DATA:
            return { ...state, data: action?.data.data };
        case SET_GALLERY:
            return { ...state, gallery: action?.data.data };
        case SET_DECODED_DATA:
            return { ...state, decodedData: action?.data.data };
        case SET_USER_IMAGES:
            return { ...state, userImages: action?.data.data };
        case DELETE_IMAGE:
            return { ...state, userImages: { images: state.userImages.images.filter((image) => image._id !== action.payload), 
                count: state.userImages.count - 1 } };
        default:
            return state;
    }
}

export default imageReducer;
