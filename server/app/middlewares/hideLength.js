import embedInPixel from './embedInPixel.js';
import numberToBitArray from './numberToBitArray.js';

/* Ukrywanie długości wiadomości w obrazie */
const hideLength = (length, imageDataArray) => {
    let lengthBitArray = numberToBitArray(length, 24); //Przekształcanie długości na tablicę binarną
    let imageDataArrayIndex = 4;

    for(let lengthBitArrayIndex = 0; lengthBitArrayIndex < lengthBitArray.length; imageDataArrayIndex += 4) {
        lengthBitArrayIndex = embedInPixel(imageDataArray, imageDataArrayIndex, lengthBitArray, lengthBitArrayIndex);
    }
    return imageDataArrayIndex;
}

export default hideLength;