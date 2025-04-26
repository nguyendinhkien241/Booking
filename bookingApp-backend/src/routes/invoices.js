import express from 'express';
import { verifyAdmin } from '../utils/verifyToken.js';
import { cancelInvoice, checkPaymentVnp, completeInvoice, countInvoice, createInvoice, deleteInvoice, getAllInvoice, getInvoiceById, getInvoiceByUser, paymentCredit, paymentVnpay, showInvoice, showInvoiceDetail } from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/', createInvoice);
router.post('/payment/creadit', paymentCredit);
router.post('/payment/vnpay', paymentVnpay);
router.put('/cancel/:invoiceId', cancelInvoice);
router.put('/complete/:id', completeInvoice)
router.delete('/:id', deleteInvoice);
router.get('/count', countInvoice);
router.get('/show', showInvoice);
router.get('/:userId', getInvoiceByUser);
router.get('/find/:id', getInvoiceById);
router.get('/detail/:id', showInvoiceDetail);
router.get('/', getAllInvoice);
router.get('/checkvnp/:id', checkPaymentVnp);



export default router