import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import useFetch from "../../hooks/useFetch";
import { Link } from "@mui/material";

const Widget = ({ type }) => {
  let data;

  const { data: countUser } = useFetch('/users/count');
  const { data: countInvoice } = useFetch('/invoices/count');
  const { data: countHotel } = useFetch('/hotels/count');
  const { data: countRoom } = useFetch('/rooms/count');
  

  //temporary
  const amount = 100;
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "Người dùng",
        isMoney: false,
        link: "Tất cả người dùng",
        path: '/users',
        count: countUser,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "invoice":
      data = {
        title: "Hóa đơn",
        isMoney: false,
        link: "Tất cả hóa đơn",
        path: '/invoices',
        count: countInvoice,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "hotel":
      data = {
        title: "Khách sạn",
        isMoney: true,
        link: "Tất cả khách sạn",
        path: '/hotels',
        count: countHotel,
        icon: (
          <HomeWorkIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "room":
      data = {
        title: "Phòng",
        isMoney: true,
        path: '/rooms',
        count: countRoom,
        link: "Tất cả phòng",
        icon: (
          <BedroomParentIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.count || amount}
        </span>
        <Link href={data.path} className="link">{data.link}</Link>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
