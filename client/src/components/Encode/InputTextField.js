import { Form, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';

const InputTextField = ({ loadText, message }) => {
    const [text, setText] = useState('');
    const [showTextField, setShowTextField] = useState(false);

    const handleInputChange = (event) => {
        setText(event.target.value);
        loadText(event.target.value, 'text');
    };

    return (
        <Row className="pl-2 pr-2">
            <Col lg="7" md="8" sm="7" xs="12">
                <Button className={`w-100 border-components textfield-button form-control bg-white 
                ${text !== '' ? 'border-components-success' : ''} ${message !== '' ? 'border-components-error' : ''}`}
                onClick={() => setShowTextField(true)}>
                    {text}
                </Button>
            </Col>
            <Col lg="5" md="4" sm="5" xs="12">
                <small className={`small-alert pl-1 pr-1 pt-2 pb-2 alert alert-danger ${message !== '' ? '' : 'd-none'}`}>
                    {message}
                </small>
            </Col>
            {showTextField && (
                <div className="message-text-field-container pr-3 pl-3">
                    <div className="mail-container pb-4">
                        <div className='mail-top'>
                            <Row>
                                <Col xs="2">
                                    <div className="mail-send-exit"><div onClick={() => {setShowTextField(false)}} className="mail-send-exit-image"></div></div>
                                </Col>
                                <Col>
                                    <h2>Wiadomość</h2>
                                </Col>
                                <Col xs="2"></Col>
                            </Row>
                        </div>
                        <div className="mail-content-container">
                            <div className="mail-content ml-2 mr-2">
                                <Form.Control value={text} onChange={handleInputChange} as="textarea" className="border-components text-area-min-height" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Row>
    )
};

export default InputTextField;