// controllers/revenue.js
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

export const getRevenue = async (req, res, next) => {
  try {
    const { userId, hotelId, year } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hotels = user.isHotelier
      .filter((h) => h.authority && h.hotelId)
      .map((h) => h.hotelId);

    if (!hotels.length) {
      return res.status(404).json({ message: "No hotels found for this user" });
    }

    const hotelDetails = await Hotel.find({ _id: { $in: hotels } }).select(
      "_id name"
    );

    if (!hotelId) {
      return res.status(200).json({ hotels: hotelDetails });
    }

    if (!hotels.includes(hotelId)) {
      return res.status(403).json({ message: "Unauthorized access to hotel" });
    }

    const rooms = await Room.find({ hotelId }).select("_id");
    const roomIds = rooms.map((room) => room._id.toString());

    const startDate = new Date(year || new Date().getFullYear(), 0, 1);
    const endDate = new Date(year || new Date().getFullYear(), 11, 31, 23, 59, 59);

    const invoices = await Invoice.aggregate([
      {
        $match: {
          "rooms.roomId": { $in: roomIds },
          status: { $in: [1, 2] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalPrice" },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    const result = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const data = invoices.find(
        (inv) => inv._id.month === month && inv._id.year === parseInt(year)
      );
      return {
        month,
        revenue: data ? data.totalRevenue / 1000000 : 0,
        bookingCount: data ? data.bookingCount : 0,
      };
    });

    res.status(200).json({ data: result, hotels: hotelDetails });
  } catch (err) {
    next(err);
  }
};