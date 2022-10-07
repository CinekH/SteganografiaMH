import sizeToBitArray from './sizeToBitArray.js';
import embedInPixel from './embedInPixel.js';
//Ukrycie wymiarów obrazu
const hideSize = (width, height, imageDataArray) => {
    //Przekształcenie szerokości i wysokości obrazu na tablicę binarną
    let sizeBitArray = sizeToBitArray(width);
    sizeBitArray.push(...sizeToBitArray(height));
    let imageDataArrayIndex = 4;
    for(let sizeBitArrayIndex = 0; sizeBitArrayIndex < sizeBitArray.length; imageDataArrayIndex += 4) {
        //Osadzenie tablicy w obrazie
        sizeBitArrayIndex = embedInPixel(imageDataArray, imageDataArrayIndex, sizeBitArray, sizeBitArrayIndex);
    }

    return imageDataArrayIndex;
}

export default hideSize;