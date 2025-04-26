import HotelOwnerRequest from '../models/HotelOwnerRequest.js'

export const saveRequest = async (req, res, next) => {
    try {
      const request = new HotelOwnerRequest({
        ...req.body,
        userId: req.user.id, // Gán userId từ token
      });
      const savedRequest = await request.save();
      res.status(201).json(savedRequest);
      } catch (error) {
        next(error);
      }
}

export const getAllRequest = async (req, res, next) => {
    try {
        const users = await HotelOwnerRequest.find(
            req.params.id
        )
        res.status(200).json(users)
    } catch(err) {
        next(err);
    }
}

export const getRequestHotel = async (req, res, next) => {
    try {
        const request = await HotelOwnerRequest.findById(
            req.params.id
        )
        res.status(200).json(request);
    } catch(err) {
        next(err);
    }
}

export const updateRequestStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedRequest = await HotelOwnerRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      
      res.status(200).json(updatedRequest);
    } catch (err) {
      next(err);
    }
};


export const deleteRequest = async (req, res, next) => {
    try {
        await HotelOwnerRequest.findByIdAndDelete(
            req.params.id
        )
        res.status(200).json("Request has been deleted")
    } catch(err) {
        next(err);
    }
}
  

  deleteRequest