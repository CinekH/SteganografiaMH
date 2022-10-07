import messageDecompress from './messageDecompress.js';
import readSize from './readSize.js';
import PVDdecode from './PVDdecode.js';
import readType from './readType.js';
import readLength from './readLength.js';
import bitArrayToUnicode from './bitArrayToUnicode.js';

//Odczytanie wiadomości
const readMessage = (imageData) => {
    const imageDataArray = imageData['data'];
    const type = readType(imageDataArray); //Odczytanie typu wiadomości
    let sizeAndIndex = [];
    let size = 0;
    let index = 0;

    if (type === 'image') {
        sizeAndIndex = readSize(imageDataArray); //Odczytanie wymiarów obrazu
        size = sizeAndIndex[0] * sizeAndIndex[1] * 3 * 4;
        index = sizeAndIndex[2];
    } else {
        sizeAndIndex = readLength(imageDataArray); //Odczytanie długości tekstu
        size = sizeAndIndex[0];
        index = sizeAndIndex[1];
    }

    let bitArray = [];
    for (let imageDataArrayIndex = index; bitArray.length < size; imageDataArrayIndex += 4) {
        //Odczytanie osadzonej części wiadomości dla kolejnych par kolorów
        bitArray.push(...PVDdecode(imageDataArray[imageDataArrayIndex], imageDataArray[imageDataArrayIndex + 1]));
        bitArray.push(...PVDdecode(imageDataArray[imageDataArrayIndex + 1], imageDataArray[imageDataArrayIndex + 2]));
    }

    bitArray.length = size;

    let messageData = null;
    if (type === 'image') {
        //Zamiana otrzymanej wiadomości na obraz PNG
        messageData = {
            "width": sizeAndIndex[0],
            "height": sizeAndIndex[1],
            "depth": 8,
            "colorType": 2,
            "compression": 0,
            "interlace": 0,
            "filter": 0,
            "data": messageDecompress(bitArray),
            "type": "image"
        }
    } else {
        //Zamiana otrzymanej wiadomości na tekst
        messageData = {
            text: String.fromCharCode(...bitArrayToUnicode(bitArray)),
            type: "text"
        };
    }


    return messageData;
}

export default readMessage;