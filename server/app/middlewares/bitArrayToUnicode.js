import bitsToNumber from './bitsToNumber.js';
/* Zamiana tablicy wartości binarnych na tablicę wartości Unicode */
const bitArrayToUnicode = (bitArray) => {
    let messageArray = [];
    messageArray.length = bitArray.length / 16;

    for (let bitArrayIndex = 0, messageArrayIndex = 0; bitArrayIndex < bitArray.length; bitArrayIndex += 16, messageArrayIndex++) {
        messageArray[messageArrayIndex] = bitsToNumber(bitArray, bitArrayIndex, 16);
    } 

    return messageArray;
}

export default bitArrayToUnicode;