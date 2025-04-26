import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
    },
    img: {
        type: String,
    },
    city: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isHotelier: [
        {
            authority: { type: Boolean, default: false },
            hotelId: { type: String, default: null }
        }
    ]
}, {timestamps: true}

)

export default mongoose.model('User', UserSchema);