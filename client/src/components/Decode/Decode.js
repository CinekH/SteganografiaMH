import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Modal, ProgressBar, Alert, Collapse, Button, Image } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';

import InputFile from '../InputFile/InputFile';
import DownloadImage from '../DownloadImage/DownloadImage';

import { clearMessage } from '../../actions/message';

import { decodeImage } from '../../actions/image';

const Decode = () => {
    document.title = 'Odczytaj wiadomość';

    const [image, setImage] = useState(null);
    const [decodedData, setDecodedData] = useState(null);
    const [imageAlert, setImageAlert] = useState('');
    const [progress, setProgress] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const APImessage = useSelector(state => state.message);
    const response = useSelector(state => state.image.decodedData);

    const dispatch = useDispatch();

    useEffect(() => {
        const checkResponse = () => {
            if (response?.type === 'PNG_ERROR') {
                if (response.message.image === 1) { setImageAlert(response.message.content) }
            }

            if (response?.type === 'UNKNOWN') {
                setImageAlert(response.message);
            }

            if (response?.type === 'NO_IMAGE') {
                setImageAlert(response.message);
            }

            if (response?.type === 'SUCCESS') {
                setDecodedData(response);
            }

            setShowSpinner(false);
        }
        if (response !== null) checkResponse();
    }, [response]);

    useEffect(() => {
        if (progress >= 99) setModalShow(false);
    }, [progress]);

    useEffect(() => {
        if (APImessage.text !== undefined && APImessage.text !== null) {
            setAlertShow(true);
        } else {
            setAlertShow(false);
        }
    }, [APImessage]);

    const checkBase64 = (base64) => {
        if (base64.split(',')[0] === 'data:image/png;base64') return true;
        if (base64.split(',')[0] === 'data:image/bmp;base64') return true;
        return false;
    }

    const validateImage = (data) => {
        if (!checkBase64(data)) {
            setImageAlert('Nieprawidłowy obraz');
        }
    }

    const handleUpdateImage = (data, type) => {
        setImage({ type, data });
        setImageAlert('');
        validateImage(data);
    };

    const clear = () => {
        setDecodedData(null);
        setImageAlert('');
        setImage(null);
    }

    const requestOptions = {
        onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            setProgress(percent);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setImageAlert('');

        if (image === null) {
            setImageAlert('Proszę wybrać plik');
        }

        if (image !== null) {
            if (!checkBase64(image.data)) {
                setImageAlert('Tylko pliki PNG i BMP');
            }

            if (checkBase64(image.data)) {
                setModalShow(true);
                dispatch(decodeImage(image, requestOptions));
                setShowSpinner(true);
            }
        }
    }

    return (
        <div>
            <Row className=" text-white justify-content-center mt-3">
                <Collapse className="mt-5" in={alertShow}>
                    <Col lg="12">
                        <Row className="justify-content-center">
                            <Col lg="6" className="align-self-center">
                                <Alert variant="success" onClose={() => { setAlertShow(false); dispatch(clearMessage()); }} dismissible>
                                    <p>{APImessage.text}</p>
                                </Alert>
                            </Col>
                        </Row>
                    </Col>
                </Collapse>
                <Col xl="8" lg="10">
                    <Row className="justify-content-center">
                        <Col lg="12" className="text-center">
                            <h1 className="mt-3 mb-4">Odczytaj Wiadomość</h1>
                        </Col>
                        {decodedData === null && (
                            <Col lg="12">
                                <form onSubmit={handleSubmit}>
                                    <Row className="justify-content-end mb-3 file-input-xs">
                                        <Col lg="3" className="d-flex align-items-center justify-content-start justify-content-lg-end">
                                            <Row className="mb-2 mb-lg-0 mb-xl-0 w-100 justify-content-end">
                                                <Col className="mt-auto mb-auto">
                                                    <h5 className="mr-4 text-lg-right text-xl-right text-left">Wczytaj obraz</h5>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg="8" className="mt-auto mb-auto">
                                            <InputFile loadImage={handleUpdateImage} message={imageAlert}></InputFile>
                                        </Col>
                                    </Row>
                                    <Row className="mb-5 justify-content-center">
                                        <Button type="submit" className="border-components mt-0 mt-sm-4 pl-5 pr-5"><strong>Wyślij</strong></Button>
                                    </Row>
                                </form>
                            </Col>
                        )}
                        <Modal size="sm" show={(modalShow && progress < 100)} onHide={() => { }} aria-labelledby="example-modal-sizes-title-sm">
                            <Modal.Header>
                                <Modal.Title className="text-center w-100">
                                    Przesyłanie pliku
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="justify-content-center">
                                <ProgressBar active striped animated now={progress} label={`${progress}%`} />
                            </Modal.Body>
                        </Modal>
                        <Modal size="sm" show={showSpinner && !modalShow} onHide={() => { }}>
                            <Modal.Header>
                                <Modal.Title className="text-center w-100">
                                    Odczytywanie wiadomości...
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="spinners-border">
                                <PropagateLoader size="40" color="#33f" />
                            </Modal.Body>
                        </Modal>
                    </Row>
                </Col>
                {decodedData !== null && (
                    <Col lg="12" className="mt-5">
                        <Row>
                            <Col xs={{ order: 'last' }} sm={{ order: 'last' }} lg={{ span: 12, order: 'first' }} md={{ span: 12, order: 'last' }}>
                                <Row className="justify-content-center mb-5">
                                    <Col lg="10" md="11">
                                        <Row className="justify-content-center ml-2 mr-2">
                                            {decodedData.messageType === 'image' ? (
                                                <Image className="border-components border-white" src={decodedData.message} id="encodedImage" alt="" fluid />
                                            ) : (
                                                <div className="text-message-container border-components">{decodedData.message}</div>
                                            )}
                                        </Row>
                                    </Col>
                                    <Col xs={{ order: 'first' }} sm={{ order: 'first' }} lg={{ span: 2, order: 'last' }} md={{ span: 12, order: 'first' }}>
                                        <Row className="justify-content-around">
                                            {decodedData.messageType === 'image' && (
                                                <Col lg="12" md="3" sm="4" xs="12" className="mb-lg-4 mb-md-3 mb-3">
                                                    {decodedData !== null && (
                                                        <DownloadImage base64={decodedData} name='Wiadomosc'/>
                                                    )}
                                                </Col>
                                            )}
                                            <Row className="w-100 justify-content-center">
                                                <Col lg="12" md="4" sm="6" xs="12" className="mb-lg-4 mb-md-3 mb-3">
                                                    <Button className={`border-components b-height-two-lines w-100 ${decodedData === null ? 'd-none' : ''}`}
                                                        onClick={clear} variant="warning">Odczytaj inną wiadomość</Button>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                )}
            </Row>
        </div>
    )
};

export default Decode;