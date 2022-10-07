import bitsToNumber from './bitsToNumber.js';
import PVDdecode from './PVDdecode.js';
//Odczytanie długości wiadomości
const readLength = (imageDataArray) => {
    let bitArray = [];
    let imageDataArrayIndex = 4;
    while(bitArray.length < 24) {
        bitArray.push(...PVDdecode(imageDataArray[imageDataArrayIndex], imageDataArray[imageDataArrayIndex + 1]));
        bitArray.push(...PVDdecode(imageDataArray[imageDataArrayIndex + 1], imageDataArray[imageDataArrayIndex + 2]));
        imageDataArrayIndex += 4;
    }
    let length = bitsToNumber(bitArray, 0, 24); //Zamiana tablicy binarnej na liczbę
    return [length, imageDataArrayIndex];
}

export default readLength;