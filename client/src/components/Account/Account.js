import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Pagination, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { PropagateLoader } from 'react-spinners';

import { loadUserImages, deleteImage, downloadImage, clearImage } from '../../actions/image';

import './styles.css';

const Account = () => {
    document.title = 'Twoje obrazy';

    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [isPageChanging, setIsPageChanging] = useState(false);
    const images = useSelector(state => state.image.userImages);
    const imageToDownload = useSelector(state => state.image.base64);
    const history = useHistory();

    if(!(JSON.parse(localStorage.getItem('profile')))) {
        history.push('/');
    }

    useEffect(() => {
        setModalShow(false);
        if(imageToDownload !== null) {
            let a = document.createElement("a");
            a.href = imageToDownload;
            let type = imageToDownload.split(',')[0] === 'data:image/bmp;base64' ? 'bmp' : 'png';
            a.download = `Obraz.${type}`;
            a.click();
            dispatch(clearImage());
        }
    }, [imageToDownload])

    useEffect(() => {
        let itemsArray = [];
        for(let number = 1; number <= Math.ceil(images.count / 5); number++) {
            itemsArray.push(
            <Pagination.Item onClick={() => changePage(number)}key={number} active={number === page}>
                {number}
            </Pagination.Item>,);
        }
        setItems(itemsArray);
        setIsPageChanging(false);
    }, [images])

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUserImages((page - 1) * 5));
    }, [page]);

    const changePage = (page) => {
        setIsPageChanging(true);
        setPage(page);
    }

    const imageDownload = (id) => {
        setModalShow(true);
        dispatch(downloadImage(id));
    }
    
    return (
        <Container className="account-container">
            <Modal size="sm" show={modalShow} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title className="text-center w-100">
                        Pobieranie obrazu...
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="justify-content-center spinners-border">
                    <PropagateLoader size="40" color="#33f"/>
                </Modal.Body>
            </Modal>

            <Row className="justify-content-center">
                <Col xl="12">
                    <Pagination className="justify-content-center">{items}</Pagination>
                </Col>
                <Col md="12" className="account-content">
                {(images.images.length === 0 || isPageChanging) && (
                    <h2 className="text-white text-center">Wczytywanie obrazów...</h2>
                )}
                {images.images[0] === 'no images' && (
                    <h2 className="text-white text-center">Brak zapisanych obrazów</h2>
                )}
                {(!isPageChanging && images.images[0] !== 'no images') && (
                    images.images.map((image) => (
                        <Row key={image._id} className="mb-5">
                            <Col className="d-block p-1 mt-3 text-center" lg="6" md="8" sm="8" xs="12">
                                <Image className="account-image" src={image.thumbnail} />
                            </Col>
                            <Col lg="2" md="3" sm="4" xs="12" className="align-self-center">
                                <Row className="justify-content-center">
                                    <Col sm="12" xs="6" className="text-center mt-3">
                                        <Button className="btn-120px" onClick={() => dispatch(deleteImage(image._id))}>Usuń</Button>
                                    </Col>
                                    <Col sm="12" xs="6" className="text-center btn-50px mt-3">
                                        <Button className="btn-120px" onClick={() => imageDownload(image._id)}>Pobierz</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ))
                )}
                </Col>
            </Row>
        </Container>
    )
}

export default Account
