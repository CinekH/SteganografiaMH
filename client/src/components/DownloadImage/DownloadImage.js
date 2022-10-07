import React from 'react';
import { Button } from 'react-bootstrap';

const Account = ({ base64, name }) => {

    const downloadImage = () => {
        let a = document.createElement("a");
        a.href = base64;
        let type = base64.split(',')[0] === 'data:image/bmp;base64' ? 'bmp' : 'png';
        a.download = `${name}.${type}`;
        a.click();
    }

    return (
        <Button className={`border-components b-height-two-lines w-100`} onClick={() => downloadImage()}>Pobierz</Button>
    )
}

export default Account
