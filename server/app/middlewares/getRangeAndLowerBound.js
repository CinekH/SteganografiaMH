//Tablica przedziałów, zwraca ilość bitów oraz dolny przedział
const getRangeAndLowerBound = (byte) => {
    switch(true) {
        case (byte <= 7):
            return [3, 0];
        case (byte <= 15):
            return [3, 8];
        case (byte <= 31):
            return [4, 16];
        case (byte <= 63):
            return [5, 32];
        case (byte <= 127):
            return [5, 64];
        case (byte <= 255):
            return [6, 128];
    }
}

export default getRangeAndLowerBound;