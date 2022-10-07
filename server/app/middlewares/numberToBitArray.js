//Przekształcenie liczby na tablicę binarną
const numberToBitArray = (number, numberOfBits) => {
    let bitArray = [];
    bitArray.length = numberOfBits;
    for (let position = numberOfBits - 1, shift = 0; position >= 0; position--, shift++) {
        bitArray[shift] = (number >> position) & 1;
    }
    return bitArray;
}

export default numberToBitArray;