import * as byteBase64 from 'byte-base64';
import * as png from '@vivaxy/png';

import calculateCapacity from './calculateCapacity.js';
import hideMessage from './hideMessage.js';
import arrayBufferBMPToImageData from './arrayBufferBMPToImageData.js';
import RGBtoBGR from './RGBtoBGR.js';
import stringToUnicode from './stringToUnicode.js';
// test
import fs from 'fs';
//test

const encodeImage = (image, message) => {
    try {
        let imageType = '';
        let RGBImage = null;
        let RGBMessage = null;
        let messageLength = 0;
        /* Zamiana typu base64 na tablicę której każdy element zapisany jest 8bitową liczbą */
        const bufferImage = byteBase64.base64ToBytes(image.base64.split('base64,')[1]);
        let bufferMessage = null;
        if(message.type === 'text') {
            /* Zamiana tekstu wiadomości na tablicę kodów Unicode */
            bufferMessage = stringToUnicode(message.data);
        } else {
            bufferMessage = byteBase64.base64ToBytes(message.data.split('base64,')[1]);
        }
        
        console.log('1');
        if(image.base64.split(',')[0] === 'data:image/bmp;base64') {
            RGBImage = arrayBufferBMPToImageData(bufferImage); //zamiana tablicy w formacie BMP na typ wspólny dla BMP i PNG
            imageType = 'BMP';
        } else {
            try {
                RGBImage = png.decode(bufferImage); //zamiana tablicy w formacie PNG na typ wspólny dla BMP i PNG
                imageType = 'PNG'
            } catch(error) {
                /* Jeżeli plik PNG nie został przekonwetowany, tylko zmieniono jego rozszerzenie, 
                to nie będzie można na nim przeprowadzać całej operacji ukrycia informacji */
                return {type: 'PNG_ERROR', message: {image: '1', content: error.message.includes('Invalid file signature') ? 'Nieprawidłowa konwersja pierwszego pliku' : error.message}};
            }
        }
        console.log('2');
        if(message.type !== 'text') {
            if(message.data.split(',')[0] === 'data:image/bmp;base64') {
                console.log('2.5');
                RGBMessage = arrayBufferBMPToImageData(bufferMessage);
            } else {
                console.log('2.55');
                try {
                    RGBMessage = png.decode(bufferMessage);
                } catch(error) {
                    console.log(error);
                    return {type: 'PNG_ERROR', message: {image: '2', content: error.message.includes('Invalid file signature') ? 'Nieprawidłowa konwersja drugiego pliku' : error.message}};
                }
            }
        }
        console.log('3');
        if(message.type === 'text') {
            messageLength = message.data.length * 16;
        } else {
            messageLength = RGBMessage.width * RGBMessage.height * 12;
        }

        /* Sprawdzanie, czy obraz zdoła pomieścić całą wiadomość */
        if(calculateCapacity(RGBImage) > messageLength) {
           
            if(message.type === 'text') {
                hideMessage(RGBImage, bufferMessage, 'text'); //Osadzanie wiadomości w obrazie
            } else {
                hideMessage(RGBImage, RGBMessage, 'image'); //Osadzenie wiadomości w obrazie
            }
           
            if(imageType === 'PNG') {
                return {imageType: '.png', type: 'SUCCESS', image: (image.base64.split(',')[0] + ',' + byteBase64.bytesToBase64(png.encode(RGBImage)))}; //Zamiana na typ base64
            } else {
                const header = Array.from(bufferImage).slice(0, bufferImage[10]);
                return {imageType: '.bmp', type: 'SUCCESS', image: (image.base64.split(',')[0] + ',' + byteBase64.bytesToBase64(header.concat(RGBtoBGR(RGBImage))))}; //Zamiana na typ base64
            }
            
        } else {
            return {type: 'TOO_BIG', message: 'Zbyt mały obraz'};
        }
    } catch (error) {
        console.log(error);
        return {type: 'UNKNOWN', message: 'Błąd pliku'};
    }
    
    
}

export default encodeImage;