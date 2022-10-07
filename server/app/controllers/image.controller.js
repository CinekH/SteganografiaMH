//import imageThumbnail from 'image-thumbnail';
import ByteBase64 from 'byte-base64';
import decodeBMP from 'decode-bmp';
import { convert } from 'rgba-to-datauri';
import imageThumbnail from 'image-thumbnail';
import * as png from '@vivaxy/png';
import Image from '../models/image.model.js';
import fetch from 'node-fetch';
import FileSystem from 'fs';

import encodeImage from '../middlewares/encodeImage.js';
import decodeImage from '../middlewares/decodeImage.js';

const pngHeader = 'data:image/png;base64,';
const bmpHeader = 'data:image/bmp;base64,';
const thumbnailDir = 'app/images/thumbnails/';
const fullImgDir = 'app/images/full-images/';

export const saveImage = async (req, res) => {
    const { base64, userId } = req.body;
    try {
        let pngBase64 = await base64;

        if(pngBase64.split(';base64,')[0].includes('bmp')) {
            const imageArray = [];
            const bmpImage = await decodeBMP(ByteBase64.base64ToBytes(base64.split(';base64,')[1]));
            bmpImage.data.map((value, index) => imageArray[index] = value);
            const arrayBuffer = new Buffer.from(imageArray);
            pngBase64 = convert(arrayBuffer, bmpImage.width, bmpImage.height);
        } else {
            const imageData = png.decode(ByteBase64.base64ToBytes(base64.split(';base64,')[1]));
            pngBase64 = convert(Buffer.from(imageData.data), imageData.width, imageData.height);
        }
        const options = { responseType: 'base64', width: 400, height: 400, fit: 'inside' };
        const thumbnail = await imageThumbnail(pngBase64.split(';base64,')[1], options);

        Image.create({ userId: userId, thumbnail: pngHeader + thumbnail, fullImage: base64 });
        res.status(200).json({ message: 'Obraz zapisano pomyślnie' });
        
        
    } catch(error) {
        console.log(error);
        res.status(500).json({message: 'Błąd serwera, spróbój ponownie później'});
    }
}

export const loadImage = async (req, res) => {
    try {
        const image = await Image.find({}, 'thumbnail email').sort({_id:-1}).limit(1);
        console.log(image[0].email);
        res.status(200).json({ message: image[0].thumbnail });
    } catch (error) {
        console.log(error)
    }
}

const loadImageFromURL = async (url) => {
    try {
        const extension = url.slice(url.length - 4);
        if(extension === '.png' || extension === '.bmp') {
            const response = await fetch(url);
            const buffer = await response.buffer();
            const base64 = ByteBase64.bytesToBase64(buffer);
            
            if(extension === '.png') return pngHeader + base64;
            if(extension === '.bmp') return bmpHeader + base64;
        } else {
            return null;
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}

const loadImageByName = async (filename) => {
    try {
        return pngHeader + FileSystem.readFileSync(fullImgDir + filename, { encoding: 'base64' });
    } catch (error) {
        console.log(error);
        return null;
    }
}


export const loadGallery = async (req, res) => {
    const FilesArray = [];
    try {
        const fileNames = FileSystem.readdirSync(thumbnailDir);
        fileNames.map((filename) => {
            FilesArray.push({ 
                imageName: filename, 
                base64: pngHeader + FileSystem.readFileSync(thumbnailDir + filename, { encoding: 'base64' }) 
            });     
        });
        res.status(200).json({ data: FilesArray });
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

export const encode = async (req, res) => {
    const {image, message} = req.body;
    try {
        let imageToEncode = null;
        if(image.type === 'base64') imageToEncode = image.data;
        if(image.type === 'URL') imageToEncode = await loadImageFromURL(image.data);
        if(image.type === 'gallery') imageToEncode = await loadImageByName(image.data);

        const data = encodeImage({ base64: imageToEncode }, message);
        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ error: error });
    }
}

export const decode = async (req, res) => {
    const { image } = req.body;
    try {
        const data = decodeImage({ base64: image.data });

        res.status(200).json({ data });
    } catch (error) {
        res.status(400).json({ error });
    }
}

export const loadUserImages = async (req, res) => {
    const skip = parseInt(req.params.skip);
    try {
        const userId = req.userId;
        let images = await Image.find({ userId: userId }, 'thumbnail id', { skip: skip, limit: 5 }).sort({_id:-1});
        let count = await Image.countDocuments({ userId: userId });
        images = count === 0 ? ['no images'] : images; 

        res.status(200).json({ data: { images, count } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Coś poszło nie tak, spróbuj ponownie później' });
    }
}

export const deleteImage = async (req, res) => {
    const { id } = req.body;
    const userId = req.userId;
    try {
        const response = await Image.findOneAndDelete({ _id: id, userId: userId});
        if(response === null) {
            res.status(400).json({ message: "Nie można usunąć żądanego obrazu."})
        } else {
            res.status(200).json({ message: "Usunięto żądany obraz." });
        } 

    } catch (error) {
        res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie później" });
    }
}

export const downloadImage = async (req, res) => {
    const { id } = req.body;
    const userId = req.userId;
    try {
        const image = await Image.findOne({ _id: id, userId: userId }, 'fullImage id');
        if (image === null) {
            res.status(400).json({ message: "Nie można usunąć żądanego obrazu." });
        } else {
            res.status(200).json({ data: image.fullImage });
        }

    } catch (error) {
        res.status(500).json({ message: "Coś poszło nie tak, spróbuj ponownie później" });
    }
}