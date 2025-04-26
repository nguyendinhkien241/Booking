import express from 'express';
import { verifyAdmin } from '../utils/verifyToken.js';
import { createDiscount, deleteDiscount, findDiscount, getAllDiscount, getDiscount, updateDiscount } from '../controllers/discountController.js';

const router = express.Router();

router.post('/', verifyAdmin ,createDiscount);
router.delete('/:id', verifyAdmin ,deleteDiscount);
router.put('/:id', verifyAdmin ,updateDiscount);
router.get('/:code', getDiscount);
router.get('/', getAllDiscount);
router.get('/find/:id', findDiscount);


export default router