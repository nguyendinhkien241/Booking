import React from "react";
import Sidebar from "../../components/sideBar/sideBar";
import "./HotelList.css"
import Header from "../../components/header/Header.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import HotelManagement from "../../components/hotel/ManageHotel.jsx";


const HotelList = () => {
    return (
        <>
            <Navbar />
            <Header type="list"/>
            <div className="hotelList">
                <Sidebar/>
                <div className="hotel-main">
                    <HotelManagement />
                </div>
            </div>
        </>
            
    )
}

export default HotelList;