import getRangeAndLowerBound from './getRangeAndLowerBound.js';
//Odczytanie typu wiadomości
const readType = (imageDataArray) => {
    return (imageDataArray[0] === getRangeAndLowerBound(imageDataArray[0])[1]) ? 
    'text' : 'image';
}

export default readType;