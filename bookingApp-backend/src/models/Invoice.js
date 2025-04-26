import mongoose from 'mongoose';
const { Schema } = mongoose;

const InvoiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    rooms: 
        [{
            roomId: String,
            price: Number,
            roomNumber: Number,
        }]
        ,
    date: [{type: Date}],
    adults: {type: Number, default: 0},
    children: {type: Number, default: 0},
    totalPrice: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    status: {
        type: Number, default: 0
    },
    userId: {
        type: String,
        required: true
    }

}, {timestamps: true}

)

export default mongoose.model('Invoice', InvoiceSchema);
