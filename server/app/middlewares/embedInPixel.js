import PVD from './PVD.js';
import getRangeAndLowerBound from './getRangeAndLowerBound.js';
/* Osadzanie informacji w pikselu */
const embedInPixel = (imageDataArray, imageDataArrayIndex, bitArray, bitArrayIndex) => {
    //Stosowanie funkcji PVD dla par RG i GB
    let bytesValueAndRangeOne = PVD(bitArray, imageDataArray[imageDataArrayIndex], 
        imageDataArray[imageDataArrayIndex + 1], bitArrayIndex);

    let bytesValueAndRangeTwo = PVD(bitArray, imageDataArray[imageDataArrayIndex + 1], 
        imageDataArray[imageDataArrayIndex + 2], bitArrayIndex + bytesValueAndRangeOne[2]);

    let leftByte = 0;
    let rightByte = 0;
    let middleByte = 0

    //Przypisywanie wartości dla kolorów
    middleByte = Math.round((bytesValueAndRangeOne[1] + bytesValueAndRangeTwo[0]) / 2);
    leftByte = bytesValueAndRangeOne[0] - (bytesValueAndRangeOne[1] - middleByte);
    rightByte = bytesValueAndRangeTwo[1] - (bytesValueAndRangeTwo[0] - middleByte);

    bitArrayIndex += bytesValueAndRangeOne[2];
    bitArrayIndex += bytesValueAndRangeTwo[2];

    imageDataArray[imageDataArrayIndex] = leftByte;
    imageDataArray[imageDataArrayIndex + 1] = middleByte;
    imageDataArray[imageDataArrayIndex + 2] = rightByte;

    //Korygowanie wartości kolorów w przypadku przekroczenia wartości brzegowych

    if (imageDataArray[imageDataArrayIndex] < 0) {
        imageDataArray[imageDataArrayIndex + 1] -= imageDataArray[imageDataArrayIndex];
        imageDataArray[imageDataArrayIndex + 2] -= imageDataArray[imageDataArrayIndex];
        imageDataArray[imageDataArrayIndex] = 0;
    }

    if (imageDataArray[imageDataArrayIndex + 2] < 0) {
        imageDataArray[imageDataArrayIndex + 1] -= imageDataArray[imageDataArrayIndex + 2];
        imageDataArray[imageDataArrayIndex] -= imageDataArray[imageDataArrayIndex + 2];
        imageDataArray[imageDataArrayIndex + 2] = 0;
    }

    if (imageDataArray[imageDataArrayIndex] > 255) {
        imageDataArray[imageDataArrayIndex + 1] -= imageDataArray[imageDataArrayIndex] - 255;
        imageDataArray[imageDataArrayIndex + 2] -= imageDataArray[imageDataArrayIndex] - 255;
        imageDataArray[imageDataArrayIndex] = 255;
        if (imageDataArray[imageDataArrayIndex + 2] < 0) {
            if (getRangeAndLowerBound(imageDataArray[imageDataArrayIndex + 1])[1] != bytesValueAndRangeTwo[3]) {
                imageDataArray[imageDataArrayIndex + 1] -= imageDataArray[imageDataArrayIndex + 2];
            }
            imageDataArray[imageDataArrayIndex + 2] = 0;
        }
    }

    if (imageDataArray[imageDataArrayIndex + 2] > 255) {
        imageDataArray[imageDataArrayIndex + 1] -= imageDataArray[imageDataArrayIndex + 2] - 255;
        imageDataArray[imageDataArrayIndex] -= imageDataArray[imageDataArrayIndex + 2] - 255;
        imageDataArray[imageDataArrayIndex + 2] = 255;
        if (imageDataArray[imageDataArrayIndex] < 0) {
            if (getRangeAndLowerBound(imageDataArray[imageDataArrayIndex + 1])[1] != bytesValueAndRangeOne[3]) {
                imageDataArray[imageDataArrayIndex + 1] -= imageDataArray[imageDataArrayIndex];
            }
            imageDataArray[imageDataArrayIndex] = 0;
        }
    }

    return bitArrayIndex;
}

export default embedInPixel;