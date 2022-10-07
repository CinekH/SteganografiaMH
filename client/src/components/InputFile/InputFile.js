import { Form, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

const InputFile = ({ loadImage, message }) => {
    const [filename, setfilename] = useState('Wybierz plik BMP/PNG');
    const [isFileLoaded, setisFileLoaded] = useState(false);

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();
        
            reader.readAsDataURL(file);
        
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    const handleInputChange = (e) => {
        let file = e.target.files[0];
        setfilename(file.name);
        setisFileLoaded(true);
        getBase64(file)
        .then(result => {
            file["base64"] = result;
            loadImage(file.base64, 'base64');
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        
        <Form.File id="formcheck-api-custom" custom>
            <Row className="pl-2 pr-2">
                <Col className={`c-file border-components 
                ${message === '' ? (isFileLoaded ? 'border-components-success' : '') : 'border-components-error'}`} 
                lg="7" md="8" sm="7" xs="12">
                    <Form.File.Input className="c-pointer" accept=".bmp, .png" isValid={isFileLoaded && message === ''} 
                    isInvalid={message !== ''}
                    onChange={handleInputChange} />
                    <Form.File.Label className="c-pointer" data-browse="Wybierz plik">
                        {filename}
                    </Form.File.Label>
                </Col>
                <Col lg="5" md="4" sm="5" xs="12">
                    <small className={`small-alert pl-1 pr-1 pt-2 pb-2 alert alert-danger ${message !== '' ? '' : 'd-none'}`}>
                        {message}
                    </small>
                </Col>
            </Row>
        </Form.File>
    )
};

export default InputFile;