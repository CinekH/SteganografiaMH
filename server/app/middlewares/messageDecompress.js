import bitsToNumber from './bitsToNumber.js';
//Dekompresja wiadomości
const messageDecompress = (bitArray) => {
    let messageDataArray = [];
    messageDataArray.length = bitArray.length / 3;

    for (let bitArrayIndex = 0, messageDataArrayIndex = 0; bitArrayIndex < bitArray.length; bitArrayIndex += 4, messageDataArrayIndex++) {
        if (messageDataArrayIndex % 4 == 3) {
            messageDataArray[messageDataArrayIndex++] = 255;
        }
        //Zamiana koloru zapisanego na 4 bitach na kolor zapisany na 8 bitach
        messageDataArray[messageDataArrayIndex] = 16 * bitsToNumber(bitArray, bitArrayIndex, 4);
    }

    return messageDataArray;
}

export default messageDecompress;