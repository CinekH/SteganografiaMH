//Kompresja obrazu doformatu tablicy binarnej, w której każdy kolor zapisany jest na 4 bitach
const messageCompress = (messageDataArray) => {
    let bitArray = [];
    bitArray.length = messageDataArray.length * 3;
    for (let bitArrayIndex = 0, messageDataArrayIndex = 0; bitArrayIndex < bitArray.length; bitArrayIndex += 4, messageDataArrayIndex++) {
        if (messageDataArrayIndex % 4 == 3) {
            messageDataArrayIndex++;
        }

        //Przekształcenie koloru zapisanego na 8 bitach na kolor zapisany na 4 bitach
        let color = Math.floor(messageDataArray[messageDataArrayIndex] / 16); 

        for (let position = 3, shift = 0; position >= 0; position--, shift++) {
            bitArray[bitArrayIndex + shift] = (color >> position) & 1;
        }
    }
    return bitArray;
}

export default messageCompress;