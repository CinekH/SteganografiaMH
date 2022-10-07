import express from 'express';

import { sendMail } from '../controllers/mail.controller.js';

const router = express.Router();
import auth from "../middlewares/auth.js";


router.post("/send", sendMail);

export default router;
