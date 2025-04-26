import mongoose from 'mongoose';
const { Schema } = mongoose;

const DiscountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    timesUsed: {
        type: Number,
        default: 0
    }
}, {timestamps: true}

)

export default mongoose.model('Discount', DiscountSchema);