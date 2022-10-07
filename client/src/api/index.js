import axios from 'axios';

const API = axios.create({ baseURL: 'https://transfermarkt-354320.lm.r.appspot.com/api' });

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
});

export const sendMail = ( formData, config ) => API.post('/mail/send', formData, config);
export const signIn = (formData) => API.post('/users/signIn', formData);
export const signUp = (formData) => API.post('/users/signUp', formData);
export const activateAccount = (hash) => API.get('/users/activateUser/' + hash);
export const activationRepeat = (email) => API.post('/users/activationRepeat', { email });
export const saveImage = (base64, userId, config) => API.post('/image/saveImage', { base64, userId }, config);
export const loadImage = () => API.post('/image/loadImage', { });
export const loadImageFromURL = (url) => API.post('/image/loadImageFromURL', { url });
export const loadGallery = () => API.post('/image/loadGallery', { });
export const encodeImage = (images, config) => API.post('/image/encodeImage', images, config);
export const decodeImage = (image, config) => API.post('/image/decodeImage', { image }, config);
export const loadUserImages = (skip) => API.get('/image/loadUserImages/' + skip);
export const deleteImage = (id) => API.post('/image/deleteImage', { id });
export const downloadImage = (id) => API.post('/image/downloadImage/', { id });