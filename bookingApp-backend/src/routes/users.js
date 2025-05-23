import express from 'express';
import {countUser, deleteUser, getAllUser, getUser, updateHotelierStatus, updateUser } from '../controllers/userController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// router.get('/checkauthentication', verifyToken, (req, res, next) => {
//     res.send("hello user, you are logged in!");
// })

// router.get('/checkuser/:id', verifyUser,(req, res, next) => {
//     res.send("hello user, you are logged in and you can delete your account");
// })

// router.get('/checkadmin/:id', verifyAdmin,(req, res, next) => {
//     res.send("hello admin, you are logged in and you can delete all account");
// })

//UPDATE
router.put('/:id', verifyUser ,updateUser)
router.put("/hotelier/:userId", updateHotelierStatus);

//DELETE
router.delete('/:id', verifyUser ,deleteUser)

//GET
router.get('/count', countUser)
router.get('/:id', verifyUser, getUser)

//GET ALL
router.get('/', verifyAdmin, getAllUser)

export default router