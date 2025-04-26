import Discount from '../models/Discount.js';
import { createError } from '../utils/error.js';

export const createDiscount =  async (req, res, next) => {
    const newDiscount = new Discount(req.body);
    try {
        const savedDiscount = await newDiscount.save();
        res.status(200).json("Discount is saved successfully")
    } catch (err) {
        next(err);
    }
}

export const updateDiscount = async (req, res, next) => {
    try {
        const updatedDisCount = await Discount.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body},
            { new: true }
        )
        res.status(200).json(updatedDisCount)
    } catch(err) {
        next(err);
    }
}

export const deleteDiscount = async (req, res, next) => {
    try {
        await Discount.findByIdAndDelete(
            req.params.id
        )
        res.status(200).json("Discount has been deleted")
    } catch(err) {
        next(err);
    }
}

export const getAllDiscount = async (req, res, next) => {
    try {
        const users = await Discount.find()
        res.status(200).json(users)
    } catch(err) {
        next(err);
    }
}

export const findDiscount = async (req, res, next) => {
    try {
        const discount = await Discount.findById(req.params.id);
        res.status(200).json(discount);
    } catch (error) {
        next(error);
    }
}

export const getDiscount = async (req, res, next) => {
    try {
        const { code } = req.params; // Lấy mã discount từ params

        // Tìm discount theo code
        const discount = await Discount.findOne({ "code" : code });

        if (!discount) {
            return res.status(404).json({
                success: false,
                message: "Mã giảm giá không tồn tại"
            });
        }

        // Kiểm tra tính hợp lệ của discount
        const currentDate = new Date();
        const isValidDate = currentDate >= new Date(discount.startDate) && currentDate <= new Date(discount.endDate);
        const isUnderLimit = discount.timesUsed < 1000;

        if (!isValidDate) {
            return res.status(400).json({
                success: false,
                message: "Mã giảm giá đã hết hạn hoặc chưa bắt đầu"
            });
        }

        if (!isUnderLimit) {
            return res.status(400).json({
                success: false,
                message: "Mã giảm giá đã vượt quá giới hạn sử dụng (1000 lần)"
            });
        }

        // Trả về discount nếu hợp lệ
        res.status(200).json({
            success: true,
            message: "Mã giảm giá hợp lệ",
            data: discount
        });
    } catch (err) {
        next(err);
    }
};

