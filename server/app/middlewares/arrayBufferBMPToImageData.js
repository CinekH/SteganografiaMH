import BGRtoRGB from './BGRtoRGB.js';
/* Zamiana typu BMP na PNG */
const arrayBufferBMPToImageData = (buffer) => {
    const imageData = {
        /* Szerokość i wysokość odczytywana jest z konkretnych części nagłówka pliku BMP
           W tablicy utworzonej z pliku BMP te wartości są zapisane na czterech parach 
           bitów szesnastkowych np.: FF FF FF FF */
        "width": buffer[18] + Math.pow(16, 2) * buffer[19] + Math.pow(16, 4) * buffer[20] + Math.pow(16, 6) * buffer[21],
        "height": buffer[22] + Math.pow(16, 2) * buffer[23] + Math.pow(16, 4) * buffer[24] + Math.pow(16, 6) * buffer[25],
        "depth": 8,
        "colorType": 2,
        "compression": 0,
        "interlace": 0,
        "filter": 0,
        "data": null
    }

    imageData["data"] = BGRtoRGB(buffer, imageData["width"], imageData["height"]);

    return imageData;
}

export default arrayBufferBMPToImageData;