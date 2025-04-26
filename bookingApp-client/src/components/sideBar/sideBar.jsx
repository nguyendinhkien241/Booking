import React, { useContext, useState } from 'react';
import './sideBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import {
  faTachometerAlt,
  faCalendarCheck,
  faStar,
  faComment,
  faHeart,
  faWallet,
  faMoneyBillWave,
  faUser,
  faBell,
  faCog,
  faSignOutAlt,
  faHouseChimneyUser,
  faHouseCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';

const SideBar = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const joinDate = new Date(userData.createdAt).toLocaleString('vn-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }); // Fixed to match "Since 10 May 2025"
  const [ dropdown, setDropdown ] = useState(true);
  const handleOpenDropdown = () => {
    setDropdown(!dropdown);
  }

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const handleClick = () => {
    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất không',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đăng xuất',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
      }
    })
  }

  return (
    <div className="sidebar">
      <div className="user-profile">
        <div className="profile-content">
          <div className="profile-info">
            <img
              src={userData.img || 'https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg'}
              alt="user"
              className="avatar"
            />
            <div>
              <h6>{userData.username}</h6>
              <span>Tham gia vào {joinDate}</span>
            </div>
          </div>
          <Link to="/profile-settings" className="edit-btn">
            <FontAwesomeIcon icon={faCog} /> {/* Replace edit icon with FontAwesome */}
          </Link>
        </div>
      </div>
      <div className="sidebar-body">
        <ul>
          <li className="section-title">Main</li>
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faTachometerAlt} /> Trang chủ
            </Link>
          </li>
          <li className="submenu" onClick={handleOpenDropdown}>
            <Link to="#" className="active">
              <FontAwesomeIcon icon={faCalendarCheck} /> Đơn đặt hàng của tôi
              <span className="menu-arrow">▼</span>
            </Link>
            {dropdown && <ul className='dropdown'>
              <li>
                <Link to="/customer-flight-booking">Chuyến bay</Link>
              </li>
              <li>
                <Link to={`/info/${userData._id}`} className="active">
                  Chỗ ở
                </Link>
              </li>
              <li>
                <Link to="/customer-car-booking">Thuê xe</Link>
              </li>
              <li>
                <Link to="/customer-cruise-booking">Taxi Sân bay</Link>
              </li>
              <li>
                <Link to="/customer-tour-booking">Tour du lịch</Link>
              </li>
            </ul>}
          </li>
          <li>
            <Link to="/review">
              <FontAwesomeIcon icon={faStar} /> Đánh giá của tôi
            </Link>
          </li>
          <li className="message-content">
            <Link to="/chat">
              <FontAwesomeIcon icon={faComment} /> Tin nhắn
            </Link>
            <span className="msg-count">02</span>
          </li>
          <li>
            <Link to="/wishlist">
              <FontAwesomeIcon icon={faHeart} /> Yêu thích
            </Link>
          </li>
          <li className="section-title">Tài chính</li>
          <li>
            <Link to="/wallet">
              <FontAwesomeIcon icon={faWallet} /> Ví tiền
            </Link>
          </li>
          <li>
            <Link to="/payment">
              <FontAwesomeIcon icon={faMoneyBillWave} /> Thanh toán
            </Link>
          </li>
          <li className="section-title">Account</li>
          <li>
            <Link to="/my-profile">
              <FontAwesomeIcon icon={faUser} /> Hồ sơ của tôi
            </Link>
          </li>
          <li>
            <Link to="/register-hotel">
              <FontAwesomeIcon icon={faHouseChimneyUser} /> Đăng ký chỗ ở của bạn
            </Link>
          </li>
          {userData.isHotelier.length > 0 && <li>
            <Link to="/hotel-list">
              <FontAwesomeIcon icon={faHouseCircleCheck} /> Nơi lưu trú của tôi
            </Link>
          </li>}
          <li className="message-content">
            <Link to="/notification">
              <FontAwesomeIcon icon={faBell} /> Thông báo
            </Link>
            <span className="msg-count bg-purple">05</span>
          </li>
          <li>
            <Link to="/profile-settings">
              <FontAwesomeIcon icon={faCog} /> Cài đặt
            </Link>
          </li>
          <li>
            <Link onClick={handleClick}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;