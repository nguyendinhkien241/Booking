import express from 'express';
import Hotel from '../models/Hotel.js'
import { countByCity, countByType, countHotel, createHotel, deleteHotel, getAllHotel, getHotel, getHotelByUserId, getHotelRooms, getLatestHotelByUserId, getMultipleHotels, updateHotel } from '../controllers/hotelController.js';
import { verifyAdmin, verifyHotelier } from '../utils/verifyToken.js';

const router = express.Router();

//CREATE
router.post('/', verifyAdmin, createHotel);

//UPDATE
router.put('/:id', verifyHotelier, updateHotel)

//DELETE
router.delete('/:id', verifyHotelier, deleteHotel)

//GET
router.get('/find/:id', getHotel)
router.get("/latest/:userId", getLatestHotelByUserId);
router.get("/user/:userId", getHotelByUserId);

//GET ALL
router.get('/', getAllHotel)
router.get("/multiple", getMultipleHotels);
router.get('/count', countHotel)
router.get('/countByCity', countByCity)
router.get('/countByType', countByType)
router.get('/room/:id', getHotelRooms)


export default router