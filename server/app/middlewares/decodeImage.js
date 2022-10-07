import * as byteBase64 from 'byte-base64';
import * as png from '@vivaxy/png';
import arrayBufferBMPToImageData from './arrayBufferBMPToImageData.js';
import RGBtoBGR from './RGBtoBGR.js';
import saveBMPsize from './saveBMPsize.js';

import readMessage from './readMessage.js';
/* Odczytywanie wiadomości */
const decodeImage = (image) => {
    try {
        let imageType = '';
        const bufferImage = byteBase64.base64ToBytes(image.base64.split('base64,')[1]);
        let imageData = null;

        if(image.base64.split(',')[0] === 'data:image/bmp;base64') {
            imageData = arrayBufferBMPToImageData(bufferImage); //Zamiana base64 na BMP
            imageType = 'BMP';
        } else {
            try {
                imageData = png.decode(bufferImage); //Zamiana base64 na PNG
                imageType = 'PNG'
            } catch(error) {
                return {type: 'PNG_ERROR', message: {image: '1', content: error.message.includes('Invalid file signature') ? 'Nieprawidłowa konwersja pliku' : error.message}};
            }
        }

        const readedMessage = readMessage(imageData); //Odczytywanie wiadomości

        if(readedMessage.type === 'image') {
            if(readedMessage.width === 0 || readedMessage.height === 0) {
                return ({type: 'NO_IMAGE', message: 'Nie wykryto wiadomości'});
            } 
        } else {
            if(readedMessage.text === '') {
                return ({type: 'NO_IMAGE', message: 'Nie wykryto wiadomości'});
            }
        }
        if(readedMessage.type === 'image') {
            if(imageType === 'PNG') {
                return {type: 'SUCCESS', messageType: 'image', 
                message: (image.base64.split(',')[0] + ',' + byteBase64.bytesToBase64(png.encode(readedMessage)))};
            } else {
                saveBMPsize(bufferImage, readedMessage.width, readedMessage.height)
                const header = Array.from(bufferImage).slice(0, bufferImage[10]);
                return {type: 'SUCCESS', messageType: 'image', 
                message: (image.base64.split(',')[0] + ',' + byteBase64.bytesToBase64(header.concat(RGBtoBGR(readedMessage))))};
            }
        } else {
            return {type: 'SUCCESS', messageType: 'text', message: readedMessage.text };
        }
    } catch(error) {
        console.log(error);
        return {type: 'UNKNOWN', message: 'Plik jest uszkodzony'};
    }
}

export default decodeImage;