import getRangeAndLowerBound from './getRangeAndLowerBound.js';
/* Obliczanie maksymalnej długości wiadomości jaką można pomieścić w nośniku */
const calculateCapacity = (imageData) => {
    const imageDataArray = imageData['data'];
    let bitCapacity = 0;

    /* Iteracja po całej tablicy obrazu nośnika */
    for(let imageDataArrayIndex = 0; imageDataArrayIndex < imageDataArray.length; imageDataArrayIndex += 4) {
        /* Pobieranie z tablicy przedziałów ilości bitów jaką można osadzić
        dla każdej pary kolorów składowych */
        bitCapacity += getRangeAndLowerBound(Math.abs(imageDataArray[imageDataArrayIndex] - 
            imageDataArray[imageDataArrayIndex + 1]))[0];

        bitCapacity += getRangeAndLowerBound(Math.abs(imageDataArray[imageDataArrayIndex + 1] - 
            imageDataArray[imageDataArrayIndex + 2]))[0];
    }

    bitCapacity += 24;

    return bitCapacity;
}

export default calculateCapacity;