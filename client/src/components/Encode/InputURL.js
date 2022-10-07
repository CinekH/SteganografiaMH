import { Form, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

const InputURL = ({ loadImage, message }) => {
    const [isInputTouched, setIsInputTouched] = useState(false)

    const handleInputChange = (event) => {
        setIsInputTouched(true);
        loadImage(event.target.value, 'URL');
    };

    return (
            <Row className="pl-2 pr-2">
                <Col lg="7" md="8" sm="7" xs="12">
                    <Form.Control onChange={handleInputChange} 
                    className={`border-components ${message === '' ? (isInputTouched ? 'border-components-success' : '') : 'border-components-error'}`} placeholder="wklej link do obrazu PNG/BMP" />
                </Col>
                <Col lg="5" md="4" sm="5" xs="12">
                    <small className={`small-alert pl-1 pr-1 pt-2 pb-2 alert alert-danger ${message !== '' ? '' : 'd-none'}`}>
                        {message}
                    </small>
                </Col>
            </Row>
    )
};

export default InputURL;