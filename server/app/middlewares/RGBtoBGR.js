//Zamiana typu RGBA na BGR charakterystyczny dla obrazu BMP 
const RGBtoBGR = (imageData) => {
    const imageDataArray = imageData["data"];
    let baseArray = [];
    let iteration = 0;
    let padding = imageData["width"] % 4;

    for(let offset = imageDataArray.length - (imageData["width"] * 4); offset >= 0; offset -= 4 * imageData["width"]) {
        const partArray = [];

        for(let offsetShift = 0; offsetShift < imageData["width"] * 4; offsetShift += 4) {
            partArray.push(...imageDataArray.slice(offset + offsetShift, offset + offsetShift + 3).reverse());
        }

        for(let i = 0; i < padding; i++) {
            partArray.push([0]);
        }

        for(let i = 0; i < partArray.length; i++){
            baseArray[imageData["width"] * iteration * 3 + i + padding * iteration] = partArray[i]
        }

        iteration++;
    }
    return baseArray;
}

export default RGBtoBGR;