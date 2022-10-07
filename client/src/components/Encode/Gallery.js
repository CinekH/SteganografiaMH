import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, Image } from 'react-bootstrap';

import { loadGallery } from '../../actions/image';

const Gallery = ({ loadImage, message, hideGalery }) => {
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [imageName, setImageName] = useState('');
    const dispatch = useDispatch();

    const images = useSelector(state => state.image.gallery);

    useEffect(() => {
        dispatch(loadGallery());
    }, [dispatch]);

    const handleImageClicked = (filename) => {
        setIsImageSelected(true);
        setImageName(filename);
        loadImage(filename, 'gallery');
    }

    return (
        <>
            {!isImageSelected ? (
                <Container className="border-components gallery p-0">
                    <div className="gallery-top">
                        <div onClick={() => hideGalery(false)} className="close-div">
                            <div className="close-icon"></div>
                        </div>
                    </div>
                    <div className="gallery-content">
                        <Row className="pb-3 justify-content-center">
                        {images.length === 0 && (
                            <h2 style={{color: 'black'}}>Wczytywanie galerii...</h2>
                        )}
                        {
                            images.map((image) => (
                                    <Col key={image.imageName} className="d-block mb-auto mt-auto p-1" lg="3" md="4" sm="6" xs="12">
                                        <button onClick={() => handleImageClicked(image.imageName)} className="m-0 p-0 gallery-image-a">
                                            <Image className="gallery-image w-100" src={image.base64} />
                                        </button>
                                    </Col>
                            ))
                        }
                        </Row>
                    </div>
                    <div className="gallery-bottom">
                        <a href="https://www.freepik.com/">Obrazy pobrano ze strony - www.freepik.com</a>
                    </div>
                </Container>
            ) : (
                <Row className="pl-2 pr-2"> 
                <Col lg="7" md="8" sm="7" xs="12" className="image-name mt-auto mb-auto overflow-hidden">
                    <span>{imageName}</span>
                </Col>
                <Col lg="5" md="4" sm="5" xs="12">
                    <small className={`small-alert pl-1 pr-1 pt-2 pb-2 alert alert-danger ${message !== '' ? '' : 'd-none'}`}>
                        {message}
                    </small>
                </Col>
                </Row>
            )}  
        </>     
    )
};

export default Gallery;