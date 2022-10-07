import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage } from '../../actions/message';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './styles.css';
import encodeImage from '../../images/encode.png';
import decodeImage from '../../images/decode.png';
import pvd from '../../images/PVD.png';

const Home = () => {
    const [show, setShow] = useState(false);
    const [content, setContent] = useState([]);
    const container = useRef(null);

    const history = useHistory();

    document.title = 'Marcin Herman - Steganografia';

    const dispatch = useDispatch();

    const handleClose = () => {
        setShow(false);
        dispatch(clearMessage());
    }

    useEffect(() => {
        let cy = 60;
        let cx = 55;
        let r = 55;
        let slices = 3
        for (var i = 0; i < slices; i++) {
            let fromAngle = i * 360 / slices;
            let toAngle = (i + 1) * 360 / slices;
            let fromCoordX = cx + (r * Math.cos(fromAngle * Math.PI / 180));
            let fromCoordY = cy + (r * Math.sin(fromAngle * Math.PI / 180));
            let toCoordX = cx + (r * Math.cos(toAngle * Math.PI / 180));
            let toCoordY = cy + (r * Math.sin(toAngle * Math.PI / 180));
            let d = 'M' + cx + ',' + cy + ' L' + fromCoordX + ',' + fromCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';
            setContent(content => [...content, d]);
        }
    }, []);

    const message = useSelector(state => state.message);

    useEffect(() => {
        if (message.text !== undefined && message.text !== null) setShow(true);
    }, [message]);

    return (
        <Container className="auth-container">
            <Row className="justify-content-center mt-5 h-100" ref={container}>
                {message.text !== null && (
                    <Col xs lg="12">
                        <Row>
                            <Col lg="6">
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Wiadomość</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>{message.text}</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Zamknij
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </Col>
                        </Row>
                    </Col>
                )}
                <Col lg="8" md="10" sm="12">
                    <svg viewBox="-2 0 114 120">
                        <pattern id="image1" x="0" y="0" patternUnits="userSpaceOnUse" height="100" width="100">
                            <rect width="100" height="100" fill="#dd0000    "></rect>
                            <image transform="rotate(90 90 90)" x="37" y="130" height="40%" width="40%" href={encodeImage}></image>
                        </pattern>
                        <pattern id="image2" x="0" y="0" patternUnits="userSpaceOnUse" height="100" width="100">
                            <rect width="100" height="100" fill="blue"></rect>
                            <image transform="rotate(10 10 10)" x="50" y="0" height="40%" width="40%" href={decodeImage}></image>
                        </pattern>
                        <pattern id="image0" x="-6" y="10" patternUnits="userSpaceOnUse" height="100" width="100">
                            <rect width="100" height="100" fill="#1e1"></rect>
                            <image transform="rotate(-35 -35 -35)" x="-37" y="90" height="50%" width="50%" href={pvd}></image>
                        </pattern>
                        {content.map((data, index) => {
                            return (
                                <a key={index} className="home-link" href="javascript:void(0)" onClick={() => history.push(index === 0 ?
                                    '/pvd' : (index === 1 ?
                                        '/encode' : '/decode'))}>
                                    <path 
                                        d={data} fill={`url(#image${index})`}></path>
                                </a>
                            );
                        })}
                    </svg>
                </Col>
            </Row>
        </Container>
    )
}

export default Home
