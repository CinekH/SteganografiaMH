import bitsToNumber from './bitsToNumber.js';
import PVDdecode from './PVDdecode.js';
//Odczytanie wymiarów obrazu
const readSize = (imageDataArray) => {
    let bitArray = [];
    let imageDataArrayIndex = 4;
    while(bitArray.length < 24) {
        //Odczytanie osadzonej części rozmiaru obrazu z kolejnych par kolorów
        bitArray.push(...PVDdecode(imageDataArray[imageDataArrayIndex], imageDataArray[imageDataArrayIndex + 1]));
        bitArray.push(...PVDdecode(imageDataArray[imageDataArrayIndex + 1], imageDataArray[imageDataArrayIndex + 2]));
        imageDataArrayIndex += 4;
    }
    //Zamiana tablicny binarnej na liczbę
    let width = bitsToNumber(bitArray, 0, 12);
    let height = bitsToNumber(bitArray, 12, 12);
    return [width, height, imageDataArrayIndex];
}

export default readSize;