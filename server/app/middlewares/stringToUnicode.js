/* Przekształcanie łancucha znaków w tablicę wartości Unicode */
const stringToUnicode = (string) => {
    let ascii = [];
    for(let index = 0; index < string.length; index++) {
        ascii[index] = string.charCodeAt(index);
    }
    return ascii;
}

export default stringToUnicode;