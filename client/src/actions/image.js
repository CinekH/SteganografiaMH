import { SET_IMAGE, SET_DATA, SET_GALLERY, SET_MESSAGE, SET_DECODED_DATA, SET_USER_IMAGES, DELETE_IMAGE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const encodeImage = (images, config) => async (dispatch) => {
    try {
        const { data } = await api.encodeImage(images, config);
        dispatch({ type: SET_DATA, data });
    } catch (error) {
        console.log(error);
    }
}

export const decodeImage = (image, config) => async (dispatch) => {
    try {
        const { data } = await api.decodeImage(image, config);
        dispatch({ type: SET_DECODED_DATA, data });
    } catch (error) {
        console.log(error);
    }
}

export const saveImage = (base64, userId, config) => async (dispatch) => {
    try {
        console.log(userId);
        const { data } = await api.saveImage(base64, userId, config);

        dispatch({ type: SET_MESSAGE, message: 'Obraz zapisano w bazie' });
    } catch (error) {
        console.log(error);
    }
};

export const loadImage = () => async (dispatch) => {
    try {
        const { data } = await api.loadImage();
        console.log(data.message);

        //TEST
        dispatch({ type: SET_IMAGE, data });
    } catch (error) {
        console.log(error);
    }
};

export const loadImageFromURL = ( url ) => async (dispatch) => {
    try {
        const { data } = await api.loadImageFromURL(url);
        console.log(data.message);

        //TEST
        dispatch({ type: SET_IMAGE, data });
    } catch (error) {
        console.log(error);
    }
}

export const loadGallery = () => async (dispatch) => {
    try {
        const { data } = await api.loadGallery();
        dispatch({ type: SET_GALLERY, data });
    } catch (error) {
        console.log(error.message);
    }
}

export const loadUserImages = (skip) => async (dispatch) => {
    try {
        const { data } = await api.loadUserImages(skip);
        
        dispatch({ type: SET_USER_IMAGES, data: data });
    } catch (error) {
        console.log(error);
    }
}

export const deleteImage = (id) => async (dispatch) => {
    try {
        const { data } = await api.deleteImage(id);

        dispatch({ type: DELETE_IMAGE, payload: id });
    } catch (error) {
        console.log(error);
    }
}

export const downloadImage = (id) => async (dispatch) => {
    try {
        const { data } = await api.downloadImage(id);

        dispatch({ type: SET_IMAGE, data});
    } catch (error) {
        console.log(error);
    }
}

export const clearImage = () => async (dispatch) => {
    try {
        dispatch({ type: SET_IMAGE, data: { data: null } });
    } catch (error) {
        console.log(error);
    }
}