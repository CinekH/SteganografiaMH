import messageCompress from './messageCompress.js';
import hideSize from './hideSize.js';
import embedInPixel from './embedInPixel.js';
import shuffleArray from './shuffleArray.js';
import unicodeToBitArray from './unicodeToBitArray.js';
import hideType from './hideType.js';
import hideLength from './hideLength.js';

//Ukrycie wiadomości
const hideMessage = (imageData, messageData, type) => {
    const imageDataArray = imageData["data"];
    let messageBitArray = [];
    // Zamiana wiadomości na tablicę o odpowiednim układzie
    if (type === 'image') {
        messageBitArray = messageCompress(messageData["data"]);
    } else {
        messageBitArray = unicodeToBitArray(messageData);
    }

    let imageDataArrayIndex = 4;
    hideType(type, imageDataArray); //Ukrycie typu wiadomości

    if (type === 'image') {
        //Ukrycie wymiarów obrazu
        imageDataArrayIndex = hideSize(messageData['width'], messageData['height'], imageDataArray);
    } else {
        //Ukrycie długości tekstu
        imageDataArrayIndex = hideLength(messageBitArray.length, imageDataArray);
    }

    for (let messageBitArrayIndex = 0; messageBitArrayIndex < messageBitArray.length; imageDataArrayIndex += 4) {
        //Ukrycie właściwej wiadomości w obrazie
        messageBitArrayIndex =
            embedInPixel(imageDataArray, imageDataArrayIndex, messageBitArray, messageBitArrayIndex);
    }

    let saltArray = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    shuffleArray(saltArray); //Mieszanie tablicy

    while (imageDataArrayIndex < imageDataArray.length) {
        //Wypełnienie pozostałej przestrzeni obrazu losowymi wartościami
        embedInPixel(imageDataArray, imageDataArrayIndex, saltArray, 0);
        shuffleArray(saltArray);
        imageDataArrayIndex += 4;
    }
}

export default hideMessage;