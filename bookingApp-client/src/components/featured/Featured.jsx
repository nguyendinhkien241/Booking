import { useContext, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './featured.css';
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

const Featured = () => {
  const city = [
    "Hà Nội",
    "Đà Nẵng",
    "Hồ Chí Minh",
    "Vũng Tàu",
    "Đà Lạt",
    "Nha Trang",
    "Huế",
    "Ninh Bình",
  ];

  const img = [
    "https://hanoilarosahotel.com/wp-content/uploads/2024/06/dia-diem-du-lich-o-ha-noi-1.jpg",
    "https://i2.ex-cdn.com/crystalbay.com/files/content/2024/07/31/cau-rong-da-nang-1-1519.jpg",
    "https://cdnmedia.baotintuc.vn/Upload/c2tvplmdloSDblsn03qN2Q/files/2020/11/04/thanh-pho-thu-duc-tp-ho-chi-minh-41120.jpg",
    "https://cdn3.ivivu.com/2022/09/T%E1%BB%95ng-quan-du-l%E1%BB%8Bch-V%C5%A9ng-T%C3%A0u-ivivu.jpg",
    "https://nhuytravel.net/wp-content/uploads/2023/03/samten-hills-da-lat-savingbooking1-1024x682-1.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLQ8haj4baxAG-EVyEy2ZOLbh9NiA4g7AScw&s",
    "https://giaonuocnhanh.com/wp-content/uploads/2021/12/hue.jpg",
    "https://amazingo.vn/upload/image/Overview-of-Ninh-Binh-Province.jpg",
  ];

  const counts = [3817, 2509, 1203, 1823, 2145, 1663, 428];

  const sliderRef = useRef(null);
  const { dispatch } = useContext(SearchContext);
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const dates = {
    startDate: new Date(),
    endDate: new Date(),
  };

  const options = {
    adult: 1,
    children: 0,
    room: 1,
  };

  const handleClick = (destination) => {
    // Update SearchContext
    dispatch({
      type: "NEW_SEARCH",
      payload: {
        city: destination,
        dates: [dates], // Wrap dates in an array to match List component's expectation
        options,
      },
    });

    // Save to localStorage
    localStorage.setItem(
      "searchData",
      JSON.stringify({ city: destination, dates: [dates], options })
    );

    // Navigate to the search results page
    navigate("/hotels", { state: { destination, dates: [dates], options } });
  };

  return (
    <div className="featuredContainer">
      <h2 className="featuredTitle">Khám phá Việt Nam</h2>
      <p className="featuredSubtitle">Các điểm đến phổ biến này có nhiều điều chờ đón bạn</p>
      
      <div className="featuredSlider">
        <button className="sliderButton left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
        
        <div className="featuredItems" ref={sliderRef}>
          {city.map((item, index) => (
            <div
              className="featuredItem"
              key={index}
              onClick={() => handleClick(item)} // Pass a function reference
            >
              <img src={img[index]} alt={item} className="featuredImg" />
              <div className="featuredTitles">
                <h1>{item}</h1>
                <h2>{counts[index]} chỗ nghỉ</h2>
              </div>
            </div>
          ))}
        </div>
        
        <button className="sliderButton right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Featured;