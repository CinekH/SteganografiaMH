import express from 'express';

import { saveImage, loadImage, loadGallery, encode, decode, loadUserImages, deleteImage, downloadImage } from '../controllers/image.controller.js';

const router = express.Router();
import auth from "../middlewares/auth.js";

router.post("/saveImage", saveImage);
router.post("/loadImage", loadImage);
router.post("/loadGallery", loadGallery);
router.post("/encodeImage", encode);
router.post("/decodeImage", decode);
router.get("/loadUserImages/:skip", auth, loadUserImages);
router.post("/downloadImage", auth, downloadImage);
router.post("/deleteImage", auth, deleteImage);

export default router;