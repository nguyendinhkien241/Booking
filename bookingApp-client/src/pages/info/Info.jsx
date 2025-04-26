import React from "react";
import Sidebar from "../../components/sideBar/sideBar";
import BookingHeader from "../../components/bookingHeader/BookingHeader";
import BookingList from "../../components/bookingList/BookingList.jsx";
import "./Info.css"
import Header from "../../components/header/Header.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";


const Info = () => {
    return (
        <>
            <Navbar />
            <Header type="list"/>
            <div className="info">
                <Sidebar/>
                <div className="info-main">
                    <BookingHeader/>
                    <BookingList/>
                </div>
            </div>
        </>
            
    )
}

export default Info;