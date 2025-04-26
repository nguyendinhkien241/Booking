import express from 'express';
import { SendEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/' , SendEmail);


export default router