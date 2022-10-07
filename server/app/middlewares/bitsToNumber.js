/* Zamiana tablicy wartości bitowych na liczbę */
const bitsToNumber = (bitArray, start, amount) => {
    let decValue = 0;
    for(let shift = 0, power = amount - 1 ; shift < amount; shift++, power--) {
        decValue += Math.pow(2, power) * bitArray[start + shift];
    }
    return decValue;
}

export default bitsToNumber;