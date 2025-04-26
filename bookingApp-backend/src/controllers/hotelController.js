import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body)
    try {
        const saveHotel = await newHotel.save();
        res.status(200).json(saveHotel)
    } catch(err) {
        next(err);
    }
}

export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body},
            { new: true }
        )
        res.status(200).json(updatedHotel)
    } catch(err) {
        next(err);
    }
}

export const deleteHotel = async (req, res, next) => {
    try {
      const hotelId = req.params.id;
  
      // Kiểm tra xem khách sạn có tồn tại không
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
  
      // Xóa khách sạn
      await Hotel.findByIdAndDelete(hotelId);
  
      // Xóa tất cả phòng liên quan đến khách sạn
      const deletedRooms = await Room.deleteMany({ hotelId });
  
      res.status(200).json({
        message: "Hotel and its rooms have been deleted",
        deletedRoomsCount: deletedRooms.deletedCount,
      });
    } catch (err) {
      next(err);
    }
  };

export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(
            req.params.id
        )
        res.status(200).json(hotel)
    } catch(err) {
        next(err);
    }
}

export const getAllHotel = async (req, res, next) => {
    try {
        const { min, max, limit, ...query } = req.query; // Tách limit ra khỏi query  
        const hotels = await Hotel.find({
            ...query,
        }).limit(Number(limit) || 0); // Chuyển limit sang số, nếu không có thì mặc định là 0 (không giới hạn)  
        res.status(200).json(hotels)
    } catch(err) {
        next(err);
    }
}

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(',')
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({city: city})
        }))
        res.status(200).json(list)
    } catch(err) {
        next(err);
    }
}

export const countByType = async (req, res, next) => {
    
    try {
        const hotelCount = await Hotel.countDocuments({type: 'hotel'});
        const apartmentCount = await Hotel.countDocuments({type: 'apartment'});
        const resortCount = await Hotel.countDocuments({type:'resort'});
        const villaCount = await Hotel.countDocuments({type:'villa'});
        const cabinCount = await Hotel.countDocuments({type:'cabin'});
        
        res.status(200).json([
            {type: 'hotel', count: hotelCount},
            {type: 'apartments', count: apartmentCount},
            {type:'resorts', count: resortCount},
            {type: 'villas', count: villaCount},
            {type: 'cabins', count: cabinCount}
        ])
    } catch(err) {
        next(err);
    }
}

export const countHotel = async (req, res, next) => {
    
    try {
        const hotelCount = await Hotel.countDocuments();
        
        res.status(200).json(hotelCount)
    } catch(err) {
        next(err);
    }
}

export const getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const list = await Promise.all(
            hotel.rooms.map((room) => {
                return Room.findById(room);
            })
        )
        res.status(200).json(list)
    } catch (err) {
        next(err);
    }
}

export const getMultipleHotels = async (req, res, next) => {
    try {
      const { hotelIds } = req.query;
  
      if (!hotelIds) {
        return res.status(400).json({ message: "Hotel IDs are required" });
      }
  
      // Chuyển chuỗi hotelIds thành mảng
      const ids = hotelIds.split(",").filter((id) => id); // Lọc bỏ giá trị rỗng
      if (!ids.length) {
        return res.status(400).json({ message: "No valid hotel IDs provided" });
      }
  
      // Tìm các khách sạn theo danh sách IDs
      const hotels = await Hotel.find({ _id: { $in: ids } }).select("_id name");
  
      if (!hotels.length) {
        return res.status(404).json({ message: "No hotels found" });
      }
  
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };

export const getLatestHotelByUserId = async (req, res, next) => {
    try {
      const userId = req.params.userId; // Get userId from request params
  
      // Find the most recent hotel for the given userId, sorted by createdAt in descending order
      const latestHotel = await Hotel.findOne({ userId })
        .sort({ createdAt: -1 }) // Sort by createdAt (descending) to get the latest
        .select("_id"); // Only return the hotelId (_id)
  
      if (!latestHotel) {
        return res.status(404).json({ message: "No hotel found for this user" });
      }
  
      res.status(200).json({ hotelId: latestHotel._id });
    } catch (err) {
      next(err); // Pass error to error-handling middleware
    }
  };

  export const getHotelByUserId = async (req, res, next) => {
    try {
      const userId = req.params.userId; // Get userId from request params
  
      // Find the most recent hotel for the given userId, sorted by createdAt in descending order
      const latestHotel = await Hotel.find({ userId })
  
      if (!latestHotel) {
        return res.status(404).json({ message: "No hotel found for this user" });
      }
  
      res.status(200).json(latestHotel);
    } catch (err) {
      next(err); // Pass error to error-handling middleware
    }
  };