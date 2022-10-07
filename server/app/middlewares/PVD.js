import getRangeAndLowerBound from './getRangeAndLowerBound.js';
import bitsToNumber from './bitsToNumber.js';
//Funkcja PVD
const PVD = (bitArray, leftByte, rightByte, start) => {
    //Obliczanie różnicy pomiędzy parą kolorów
    const byteDifferenceValue = Math.abs(leftByte - rightByte); 
    
    //Pobieranie wartości z tablicy przedziałów
    let rangeAndLowerBound = getRangeAndLowerBound(byteDifferenceValue); 

    if (start + rangeAndLowerBound[0] >= bitArray.length) {
        //Jeżeli pozostała długość wiadomości jest mniejsza niż ilość bitów, 
        //która ma zostać ukryta dla tej pary kolorów, to dopełniana jest ona zerami
        for (let index = bitArray.length; index < start + rangeAndLowerBound[0]; index++) {
            bitArray[index] = 0;
        }
    }
    const newDifference = bitsToNumber(bitArray, start, rangeAndLowerBound[0]) + 
    rangeAndLowerBound[1]; //Wynikowa różnica pomiędzy kolorami

    //Wartość pomocnicza którą należy dodać do kolorów
    const addition = Math.abs(newDifference - byteDifferenceValue) / 2; 
    let embeddedLeftByte = 0;
    let embeddedRightByte = 0;

    //Dodawanie wartości pomocniczej do kolorów
    if (leftByte >= rightByte) {
        if (newDifference > byteDifferenceValue) {
            embeddedLeftByte = leftByte + Math.ceil(addition);
            embeddedRightByte = rightByte - Math.floor(addition);
        } else {
            embeddedLeftByte = leftByte - Math.ceil(addition);
            embeddedRightByte = rightByte + Math.floor(addition);
        }
    } else {
        if (newDifference > byteDifferenceValue) {
            embeddedLeftByte = leftByte - Math.floor(addition);
            embeddedRightByte = rightByte + Math.ceil(addition);
        } else {
            embeddedLeftByte = leftByte + Math.ceil(addition);
            embeddedRightByte = rightByte - Math.floor(addition);
        }
    }

    //Korekta w przypadku przekroczenia wartości brzegowych
    if (embeddedLeftByte < 0) {
        embeddedRightByte += Math.abs(embeddedLeftByte);
        embeddedLeftByte = 0;
    }

    if (embeddedLeftByte > 255) {
        embeddedRightByte -= embeddedLeftByte - 255;
        embeddedLeftByte = 255;
    }

    if (embeddedRightByte < 0) {
        embeddedLeftByte += Math.abs(embeddedRightByte);
        embeddedRightByte = 0;
    }

    if (embeddedRightByte > 255) {
        embeddedLeftByte -= embeddedRightByte - 255;
        embeddedRightByte = 255;
    }

    return [embeddedLeftByte, embeddedRightByte, rangeAndLowerBound[0], rangeAndLowerBound[1]];
}

export default PVD;