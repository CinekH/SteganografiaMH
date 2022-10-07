import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import wzor from '../../images/wzor.svg';


const PVD = () => {
    document.title = 'Metoda PVD';
    return (
        
        <Container>
            <Row className="justify-content-center mb-5">
                <Col className="mt-5 text-white">
                    <h3 className="text-center">W jaki sposób wiadomość jest ukrywana?</h3>
                    <p className="mt-4">
                        Do ukrycia wiadomości wykorzystywana jest metoda PVD, która polega na ukrywaniu informacji w różnicy między sąsiadującymi 
                        wartościami kolorów składowych pikseli. Oprócz tego należy ukryć takie wartości jak długość wiadomości oraz jej typ. 
                    </p>
                    <h4 className="text-center">Tablica przedziałów</h4>
                    <Row className="justify-content-center mb-3">
                        <Col lg="7" md="9" sm="12">
                            <Table bordered className="text-center" variant="dark">
                                <thead>
                                    <tr className="bg-secondary">
                                        <th className="bg-primary">Ri</th>
                                        <th>R1</th>
                                        <th>R2</th>
                                        <th>R3</th>
                                        <th>R4</th>
                                        <th>R5</th>
                                        <th>R6</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="bg-primary">T</td>
                                        <td>3</td>
                                        <td>3</td>
                                        <td>4</td>
                                        <td>5</td>
                                        <td>5</td>
                                        <td>6</td>
                                    </tr>
                                    <tr>
                                        <td className="bg-primary">{`<>`}</td>
                                        <td>{`<0, 7>`}</td>
                                        <td>{`<8, 15>`}</td>
                                        <td>{`<16, 31>`}</td>
                                        <td>{`<32, 63>`}</td>
                                        <td>{`<64, 127>`}</td>
                                        <td>{`<128, 255>`}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <p>
                        Zaletą metody PVD jest to, że ilość bitów jaką można zakodować pomiędzy sąsiadującymi wartościami jest zmienna, przez co 
                        nie jest tak łatwo ukrytej wiadomości odczytać. Za to, jaką ilość bitów możemy zakodować odpowiada tablica przedziałów, która
                        sprawdza w jakim przedziale obliczona różnica pomiędzy wartościami się mieści i zwraca ilość bitów jaką można dla danej 
                        pary zakodować. Kolejnym etapem jest wykorzystanie funkcji opartej o wzór: 
                    </p>
                    <Row className="justify-content-center mb-3 mt-2">
                        <Col lg="7" md="9" sm="12">
                            <img className="w-100" src={wzor} alt="wzór"/>
                        </Col>
                    </Row>
                    <p>
                        Pobiera ona kolejne bity z wiadomości (ich ilość zależy od wartości otrzymanej z tablicy przedziałów), zamienia te bity na liczbę 
                        i dodaje ją do wartości brzegowej pobranej również z tablicy przedziałów. W przypadku plików graficznych wartościami są kolory 
                        składowe R G B, z tego wynika, iż pary dla których będzie się stosować wyżej wymienioną sekwencję to: R G oraz G B dla każdego 
                        piksela. Jednak po ukryciu bitów dla obu par zauważymy, że wartości koloru G pomiędzy jedną parą a drugą się różnią. Dlatego 
                        wartości G należy uśrednić i dokonać odpowiedniej korekty dla kolorów R i B poprzez dodanie bądź odjęcie ilości o jaką zmieniła 
                        się wartość G dla konkretnej pary.
                    </p>
                    <p>
                        Dekodowanie wiadomości odbywa się poprzez pobranie różnicy dla par R G oraz R B dla każdego piksela. Różnica jest reprezentacją 
                        dziesiętną binarnego ciągu znaków, więc otrzymaną różnicę przekształcamy na ciąg binarny i powtarzamy to dla każdej kolejnej pary 
                        składając wiadomość w całość. Pozostaje tylko zamienić ciąg binarny na odpowiednią formę charakterystyczną dla typu wiadomości, 
                        czyli obraz bądź tekst.
                    </p>
                    <p>
                        Jak to się odbywa w samej aplikacji? Na początku obraz który jest nośnikiem zamieniany jest na tablicę zawierającą wartości 
                        kolejnych kolorów składowych każdego piksela, a wiadomość przekształcana jest do postaci tablicy kolejnych bitów. Jeżeli jest 
                        to obraz, to każdy kolor składowy przekształcany jest do postaci czterobitowej, a kanał alfa odpowiedzialny za przezroczystość 
                        jest pomijany. W przypadku tekstu każdy kolejny znak zamieniamy na postać w standardzie Unicode, w którym jeden znak zapisany 
                        jest na 16 bitach. Po sprawdzeniu czy wielkośc nośnika jest wystarczająca, aby zakodować w nim całą wiadomość odbywa się jej 
                        ukrywanie. 
                    </p>
                    <p>
                        Na początku kodowana jest flaga oznaczająca typ ukrytej wiadomości. Wykorzystano do tego tablicę przedziałów, a konkretniej 
                        granice przedziałów. Flaga kodowana jest na pierwszym pikselu obrazu, a dokładnie na kolorze R. Jeżeli ukrywaną wiadomością 
                        jest tekst, to wartość R jest ustalana jako dolna granica przedziału w którym kolor R się mieści, jeżeli natomiast jest to obraz, 
                        to kolorowi przypisujemy wartość o 1 większą od dolnej granicy przedziału. Od piksela drugiego rozpoczyna się ukrywanie długości 
                        lub wymiarów wiadomości w zależności od tego, czy jest to tekst czy obraz. W przypadku pierwszym długość tablicy w której 
                        zapisana jest wiadomość w postaci ciągu binarnego zapisana zostaje na 24 bitach, które są ukrywane w kolejnych pikselach za 
                        pomocą funkcji opisanej w drugim paragrafie. Jeżeli wiadomość jest obrazem, to wymiary zapisywane są również na 24 bitach, 
                        z czego pierwszych 12 to długość, a następne 12 to szerokość. Po zakodowaniu rozmiaru wiadomośći ukrywana jest sama wiadomość 
                        w ten sam sposób co jej rozmiar. Po ukryciu całej wiadomości w pozostałych pikselach nośnika ukrywane są losowe wartośći, aby 
                        jak najlepiej ukryć ślady ingerencji w obraz.
                    </p>
                    <p>
                        Odczytywanie wiadomości jest procesem bardzo podobnym. Na początku odczytywana jest flaga ukryta na kolorze R pierwszego piksela, 
                        jeżeli nie jest ona liczbą 0 lub 1 to oznacza, że obraz został uszkodzony albo nie została w nim ukryta wiadomość. Następnie od 
                        drugiego piksela odczytywany jest rozmiar wiadomości. Dla każdego piksela wybierane zostają pary kolorów R G oraz G B. Kolejno 
                        obliczana jest różnica pomiędzy kolorami w parze i na podstawie otrzymanego wyniku odkodowywany jest fragment wiadomości. 
                        W tym celu pobierana jest dolna granica oraz ilość bitów z tablicy przedziałów. Od różnicy odejmuje się pobraną granicę, a 
                        otrzymaną wartość zapisuje zostaje na pobranej ilości bitów. Tę sekwencję powtarza się, dopóki długość łańcucha binarnego będzie 
                        wynosić 24. Jeżeli typem ukrytej wiadomości jest obraz, to pobrany rozmiar zostaje podzielony na dwa równe segmenty i wyznaczane 
                        są z nich szerokość oraz wysokość obrazu. Na ich podstawie obliczana jest długość wynikowej tablicy do której zostanie zapisana 
                        wiadomość. W przypadku wiadomości tekstowej, otrzymany ciąg binarny przekształcany jest na liczbę dziesiętną, która jest już 
                        długością tablicy wynikowej. Odczytywanie samej wiadomości odbywa się w sposób identyczny do dekodowania rozmiaru, z tą różnicą, 
                        że długość łańcucha binarnego jest zmienna i zależy od rozmiaru wiadomości. Wynikowa tablica przekształcana jest na obraz bądź 
                        tekst, w zależności od odczytanego na początku typu, a wiadomość zostaje przesłana użytkownikowi. 
                    </p>
                </Col>
            </Row>
        </Container>
    )
}

export default PVD
