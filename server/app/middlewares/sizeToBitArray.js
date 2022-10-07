import numberToBitArray from './numberToBitArray.js';
/* Przekształcanie rozmiaru na 12 elementową tablicę binarną */
const sizeToBitArray = (size) => {
    let sizeBitArray = numberToBitArray(size, 12);
    return sizeBitArray;
}

export default sizeToBitArray;