import getRangeAndLowerBound from './getRangeAndLowerBound.js';
import numberToBitArray from'./numberToBitArray.js';

const PVDdecode = (leftByte, rightByte) => {
    let difference = Math.abs(leftByte - rightByte); //Obliczenie różnicy pomiędzy parą kolorów
    let rangeAndLowerBound = getRangeAndLowerBound(difference); //Pobranie wartości z tablicy przedziałów

    //Przekształcenie otrzymanej wartości na tablicę binarną
    let bitArray = numberToBitArray(difference - rangeAndLowerBound[1], rangeAndLowerBound[0]); 
    return bitArray;
}

export default PVDdecode;