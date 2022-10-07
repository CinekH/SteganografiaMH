import numberToBitArray from './numberToBitArray.js';

/* Zmiana tablicy z wartościami liczbowymi na tablicę z wartościami binarnymi */
const unicodeToBitArray = (unicodeArray) => {
    let bitArray = [];
    for(let index = 0; index < unicodeArray.length; index++) {
        /* Znaki w standardzie Unicode kodowane są na 16 bitach, dlatego dla każdej liczby tworzona jest tablica szesnastoelementowa */
        bitArray.push(...numberToBitArray(unicodeArray[index], 16));
    }
    return bitArray;
}

export default unicodeToBitArray;