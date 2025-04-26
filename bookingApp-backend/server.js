import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './src/config/mongodb.js';
import authRouter from './src/routes/auth.js';
import chatRouter from './src/routes/chat.js';
import emailRouter from './src/routes/email.js';
import hotelsRouter from './src/routes/hotels.js';
import roomsRouter from './src/routes/rooms.js';
import usersRouter from './src/routes/users.js';
import invoiceRouter from './src/routes/invoices.js';
import discountRouter from './src/routes/discounts.js';
import revenueRouter from './src/routes/revenue.js';
import hotelOwnerRequest from './src/routes/hotelOwnerRequest.js';
import cookieParser from 'cookie-parser';

import connectCloudinary from './src/config/cloudinary.js';

const app = express();


connectDB();
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', // URL frontend
    credentials: true // Cho phép gửi cookie
  }));

app.use("/api/auth/", authRouter)
app.use("/api/chat/", chatRouter)
app.use("/api/email/", emailRouter)
app.use("/api/hotels/", hotelsRouter)
app.use("/api/rooms/", roomsRouter)
app.use("/api/users/", usersRouter)
app.use("/api/invoices/", invoiceRouter)
app.use("/api/discounts/", discountRouter)
app.use("/api/revenue", revenueRouter);
app.use("/api/hotelOwnerRequests/", hotelOwnerRequest)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})


app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(8800, () => {
    console.log("Connected to backend!!!");
})  