import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { Row, Col, Modal, ProgressBar, Alert, Collapse, Button, Image } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';

import InputFile from '../InputFile/InputFile';
import InputURL from './InputURL';
import SendMail from './SendMail';
import Gallery from './Gallery';
import InputTextField from './InputTextField';
import DownloadImage from '../DownloadImage/DownloadImage';

import './styles.css';

import { sendMail } from '../../actions/mail';
import { clearMessage } from '../../actions/message';
import { saveImage } from '../../actions/image';

import { encodeImage } from '../../actions/image';

const Encode = () => {
    document.title = 'Ukryj wiadomość';

    const [image, setImage] = useState(null);
    const [message, setMessage] = useState(null);
    const [encodedImage, setEncodedImage] = useState(null);
    const [imageAlert, setImageAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');
    const [doShowMail, setDoShowMail] = useState(false);
    const [progress, setProgress] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [doShowFile, setDoShowFile] = useState(false);
    const [doShowURL, setDoShowURL] = useState(false);
    const [doShowGallery, setDoShowGallery] = useState(false);
    const [doShowMessageFile, setDoShowMessageFile] = useState(false);
    const [doShowMessageText, setDoShowMessageText] = useState(false);

    const [user, setuser] = useState(JSON.parse(localStorage.getItem('profile')));
    const location = useLocation();

    const APImessage = useSelector(state => state.message);
    const response = useSelector(state => state.image.data);

    const dispatch = useDispatch();

    useEffect(() => {
        setuser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    useEffect(() => {
        const checkResponse = () => {
            if (response.type === 'PNG_ERROR') {
                console.log(response.message.image);
                if (response.message.image == 1) setImageAlert(response.message.content);
                if (response.message.image == 2) setMessageAlert(response.message.content);
            }

            if (response.type === 'TOO_BIG') {
                setImageAlert(response.message);
            }

            if (response.type === 'UNKNOWN') {
                setImageAlert(response.message);
            }

            if (response.type === 'SUCCESS') {
                setEncodedImage(response.image);
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

    const checkURL = (url) => {
        return /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#-=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)([.](png|bmp))/ig.test(url);
    }

    const checkImage = (image, type) => {
        switch (type) {
            case 'base64':
                return checkBase64(image);
            case 'URL':
                return checkURL(image);
            case 'gallery':
                return true;
            case 'text':
                return (image !== '');
            default:
                return false;
        }
    }

    const validateImage = (data, type) => {
        if (!checkImage(data, type)) {
            setImageAlert('Nieprawidłowy obraz');
        }
    }

    const handleUpdateImage = (data, type) => {
        setImage({ type, data });
        setImageAlert('');
        validateImage(data, type);
    };

    const clear = () => {
        setEncodedImage(null);
        setImageAlert('');
        setMessageAlert('');
        setImage(null);
        setMessage(null);
        setDoShowMail(false);
        setDoShowURL(false);
        setDoShowGallery(false);
        setDoShowFile(false);
    }

    const sendImageToDatabase = () => {
        setModalShow(true);
        let userId = user?.token.length > 500 ? user.result.googleId : user.result._id;
        dispatch(saveImage(encodedImage, userId, requestOptions));
    }

    const requestOptions = {
        onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            setProgress(percent);
        }
    }

    const handleSubmitMail = (name, fromAddress, toAddress, subject, text) => {
        if (encodedImage !== 0) {
            setModalShow(true);
            dispatch(sendMail({ name, fromAddress, toAddress, text, subject, encodedImage }, requestOptions));
            setDoShowMail(false);
        }
    }

    const handleUpdateMessage = (data, type) => {
        setMessage({ data, type });
        setMessageAlert('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setImageAlert('');
        setMessageAlert('');

        if (image === null) {
            setImageAlert('Proszę wybrać plik');
        }
        if (message === null) {
            setMessageAlert('Proszę wybrać plik');
        }
        if (image !== null && message !== null) {
            if (!checkImage(image.data, image.type)) {
                setImageAlert('Tylko pliki PNG i BMP');
            }

            if (!checkImage(message.data, message.type)) {
                setMessageAlert('Tylko pliki PNG i BMP');
            }

            if (message.data === '') {
                setMessageAlert('Wiadomość jest pusta');
            }

            if (checkImage(image.data, image.type) && checkImage(message.data, message.type)) {
                setModalShow(true);
                dispatch(encodeImage({ image, message }, requestOptions));
                setShowSpinner(true);
            }
        }
    }

    const showMail = () => {
        setDoShowMail(true);
    }

    const changeImage = () => {
        setImage(null);
        setDoShowFile(false);
        setDoShowGallery(false);
        setDoShowURL(false);
    }

    const changeMessage = () => {
        setMessage(null);
        setDoShowMessageText(false);
        setDoShowMessageFile(false);
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

                            <h1 className="mt-3 mb-4">Ukryj Wiadomość</h1>
                        </Col>
                        {encodedImage === null && (
                            <Col lg="12">
                                <form onSubmit={handleSubmit}>
                                    <Row className="justify-content-end mb-3 file-input-xs">
                                        <Col lg="3" className="d-flex align-items-center justify-content-start justify-content-lg-end">
                                            <Row className="mb-2 mb-lg-0 mb-xl-0 w-100 justify-content-end">
                                                <Col className="mt-auto mb-auto">
                                                    <h5 className="mr-4 text-lg-right text-xl-right text-left">Obraz</h5>
                                                </Col>
                                                {(doShowFile || doShowURL || doShowGallery) && (
                                                    <Col>
                                                        <Button onClick={changeImage} variant="info">Zmień</Button>
                                                    </Col>
                                                )}
                                            </Row>
                                        </Col>
                                        <Col lg="8" className="mt-auto mb-auto">
                                            {!(doShowFile || doShowURL || doShowGallery) && (
                                                <Row>
                                                    <Col>
                                                        <Row>
                                                            <Col sm="auto">
                                                                <span>Wczytaj obraz z:</span>
                                                            </Col>
                                                            <Col sm="auto" className="mt-2 mt-sm-0">
                                                                <Button onClick={() => setDoShowFile(true)} size="sm" variant="primary"
                                                                    className="mr-2 border-components">Dysku</Button>

                                                                <Button onClick={() => setDoShowURL(true)} size="sm" variant="primary"
                                                                    className="mr-2 border-components">Linku</Button>

                                                                <Button onClick={() => setDoShowGallery(true)} size="sm" variant="primary"
                                                                    className="mr-2 border-components">Galerii</Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            )}
                                            {doShowFile &&
                                                (
                                                    <InputFile loadImage={handleUpdateImage} message={imageAlert}></InputFile>
                                                )}
                                            {doShowURL &&
                                                (
                                                    <InputURL loadImage={handleUpdateImage} message={imageAlert}></InputURL>
                                                )}
                                            {doShowGallery &&
                                                (
                                                    <Gallery loadImage={handleUpdateImage} message={imageAlert} hideGalery={setDoShowGallery}></Gallery>
                                                )}
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 justify-content-end file-input-xs">
                                        <Col lg="3" className="d-flex align-items-center justify-content-start justify-content-lg-end">
                                            <Row className="mb-2 mb-lg-0 mb-xl-0 w-100 justify-content-end">
                                                <Col className="mt-auto mb-auto">
                                                    <h5 className="mr-4 text-lg-right text-xl-right text-left">Wiadomość</h5>
                                                </Col>
                                                {(doShowMessageFile || doShowMessageText) && (
                                                    <Col>
                                                        <Button onClick={changeMessage} variant="info">Zmień</Button>
                                                    </Col>
                                                )}
                                            </Row>
                                        </Col>
                                        <Col lg="8">
                                            {!(doShowMessageFile || doShowMessageText) && (
                                                <Row>
                                                    <Col>
                                                        <Row>
                                                            <Col sm="auto">
                                                                <span>Format wiadomości:</span>
                                                            </Col>
                                                            <Col sm="auto" className="mt-2 mt-sm-0">
                                                                <Button onClick={() => setDoShowMessageFile(true)} size="sm" variant="primary"
                                                                    className="mr-2 border-components">Obraz</Button>

                                                                <Button onClick={() => setDoShowMessageText(true)} size="sm" variant="primary"
                                                                    className="mr-2 border-components">Tekst</Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            )}
                                            {doShowMessageFile && (
                                                <InputFile loadImage={handleUpdateMessage} message={messageAlert}></InputFile>
                                            )}
                                            {doShowMessageText && (
                                                <InputTextField loadText={handleUpdateMessage} message={messageAlert}></InputTextField>
                                            )}
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
                                    Ukrywanie informacji...
                    </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="spinners-border">
                                <PropagateLoader size="40" color="#33f" />
                            </Modal.Body>
                        </Modal>
                    </Row>
                </Col>
                {encodedImage !== null && (
                    <Col lg="12" className="mt-5">
                        <Row>
                            <Col xs={{ order: 'last' }} sm={{ order: 'last' }} lg={{ span: 12, order: 'first' }} md={{ span: 12, order: 'last' }}>
                                <Row className="justify-content-center mb-5">
                                    <Col lg="10" md="11">
                                        <Row className="justify-content-center ml-2 mr-2">
                                            <Image className="border-components border-white" src={encodedImage} id="encodedImage" alt="" fluid />
                                        </Row>
                                    </Col>
                                    <Col xs={{ order: 'first' }} sm={{ order: 'first' }} lg={{ span: 2, order: 'last' }} md={{ span: 12, order: 'first' }} className="">
                                        <Row className="justify-content-around">
                                            <Col lg="12" md="3" sm="4" xs="12" className="mb-lg-4 mb-md-3 mb-3">
                                                {encodedImage !== null && (
                                                    <DownloadImage base64={encodedImage} name='Obraz' />
                                                )}
                                            </Col>
                                            {user !== null && (
                                                <Col lg="12" md="3" sm="4" xs="12" className="mb-lg-4 mb-md-3 mb-3">
                                                    <Button className={`border-components b-height-two-lines w-100 ${encodedImage === null ? 'd-none' : ''}`}
                                                        onClick={sendImageToDatabase}>Zapisz obraz na koncie</Button>
                                                </Col>
                                            )}
                                            {/*
                                            <Col lg="12" md="3" sm="4" xs="12" className="mb-lg-4 mb-md-3 mb-3">
                                            <Button className={`border-components b-height-two-lines w-100 ${encodedImage === null ? 'd-none' : ''}`}
                                            onClick={showMail}>Wyślij mailem</Button>
                                            </Col>
                                            */}
                                            <Row className="w-100 justify-content-center">
                                            <Col lg="12" md="4" sm="6" xs="12" className="mb-lg-4 mb-md-3 mb-3">
                                                    <Button className={`border-components b-height-two-lines w-100 ${encodedImage === null ? 'd-none' : ''}`}
                                                        onClick={clear} variant="warning">Ukryj nową wiadomość</Button>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </Col>
                                    <SendMail display={doShowMail ? '' : 'd-none'} handleSubmitMail={handleSubmitMail} showMail={setDoShowMail} user={user?.result} />
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                )}
            </Row>
        </div>
    )
};

export default Encode;