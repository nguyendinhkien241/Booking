import React from "react";
import Sidebar from "../../components/sideBar/sideBar";
import "./HotelList.css"
import Header from "../../components/header/Header.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import RoomManagement from "../../components/room/ManageRoom.jsx";


const RoomList = () => {
    return (
        <>
            <Navbar />
            <Header type="list"/>
            <div className="hotelList">
                <Sidebar/>
                <div className="hotel-main">
                    <RoomManagement />
                </div>
            </div>
        </>
            
    )
}

export default RoomList;