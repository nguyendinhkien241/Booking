import express from 'express';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
import { deleteRequest, getAllRequest, getRequestHotel, saveRequest, updateRequestStatus } from '../controllers/hotelOwnerRequestController.js';

const router = express.Router();

router.post('/:id', verifyUser ,saveRequest);
router.get('/', getAllRequest);
router.get('/:id', getRequestHotel);
router.put('/:id/status', updateRequestStatus );
router.delete('/:id', verifyAdmin, deleteRequest)

export default router