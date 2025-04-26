import express from 'express';
import { google, login, logout, register } from '../controllers/authController.js';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/google", google);
router.post("/logout", logout);


export default router