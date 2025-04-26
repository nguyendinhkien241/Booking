import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body},
            { new: true }
        )
        res.status(200).json(updatedUser)
    } catch(err) {
        next(err);
    }
}

export const countUser = async (req, res, next) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json(count)
    } catch(err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(
            req.params.id
        )
        res.status(200).json("User has been deleted")
    } catch(err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(
            req.params.id
        )
        res.status(200).json(user)
    } catch(err) {
        next(err);
    }
}

export const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find(
            req.params.id
        )
        res.status(200).json(users)
    } catch(err) {
        next(err);
    }
}

export const updateHotelierStatus = async (req, res, next) => {
    try {
      const userId = req.params.userId; // Get userId from request params
      const { hotelId } = req.body; // Get hotelId from request body
  
      // Update the user's isHotelier array by pushing a new object
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            isHotelier: {
              authority: true, // Set authority to true
              hotelId: hotelId, // Add the hotelId
            },
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Hotelier status updated successfully", user: updatedUser });
    } catch (err) {
      next(err); // Pass error to error-handling middleware
    }
  };