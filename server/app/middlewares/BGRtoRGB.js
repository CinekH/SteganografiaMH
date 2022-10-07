/* Zamiana tablicy pikseli w kolejności BGR charakterystycznej dla typu BMP
na tablicę w kolejności RGBA charakterystyczną dla typu PNG 
W typie PNG obraz zapisywany jest zaczynając od lewego górnego piksela idąc 
w prawo, a w typie BMP od lewego dolnego, również idąc w prawo.
*/
const BGRtoRGB = (buffer, width, height) => {
    /* Odczytywanie indeksu tablicy od którego zapisana jest bitmapa */
    const start = buffer[10] + Math.pow(16, 2) * buffer[11] + Math.pow(16, 4) * buffer[12] + Math.pow(16, 6) * buffer[13];
    const bytesPerPixel = buffer[28] / 8; // Ile kolorów przypada na piksel (3 lub 4)
    let baseArray = [];
    baseArray.length = width * height * 4; // Ustalenie długości wynikowej tablicy
    /* W typie BMP jeden rząd pikseli zapisany jest na liczbie komórek tablicy, która 
       jest wielokrotnością 4, dlatego jeżeli szerokość obrazu nie jest wielokrotnością 4 
       to dodatkowo do tablicy dodawane są puste komórki */
    const padding = bytesPerPixel === 3 ? (width) % 4 : 0;
    let iteration = 0;
    for (let offset = buffer.length - (bytesPerPixel * width) - padding; offset >= start; offset -= ((width * bytesPerPixel) + padding)) {
        let partArray = [];

        for (let bufferShift = 0; bufferShift < width * bytesPerPixel; bufferShift += 3) {
            /* Dla każdego piksela z formatu BMP odwracamy kolejność kolorów i dodajemy do tablicy
               która będzie wyglądać jak tablica pikseli dla typu PNG */
            partArray.push(...buffer.slice(offset + bufferShift, offset + bufferShift + 3).reverse(), 255);
        }

        for (var i = 0; i < partArray.length; i++) {
            baseArray[width * iteration * 4 + i] = partArray[i]
        }
        iteration++;
    }

    return baseArray;
}

export default BGRtoRGB;