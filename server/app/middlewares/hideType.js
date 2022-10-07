import getRangeAndLowerBound from './getRangeAndLowerBound.js';

const hideType = (type, imageDataArray) => {
    //Osadzenie typu wiadomości w obrazie
    imageDataArray[0] = (type === 'text') ?
        getRangeAndLowerBound(imageDataArray[0])[1] :
        getRangeAndLowerBound(imageDataArray[0])[1] + 1;
}

export default hideType;