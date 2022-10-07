import express from 'express';

import { signIn, signUp, activate, activationRepeat } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/signIn", signIn);
router.post("/signUp", signUp);
router.get("/activateUser/:hash", activate);
router.post("/activationRepeat", activationRepeat);

export default router;