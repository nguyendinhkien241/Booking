import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reserve.css"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
    const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
    const context = useContext(SearchContext);
    const { dates: contextDates, options: contextOptions } = context || {};
    const storedData = JSON.parse(localStorage.getItem("searchData")) || {};
    const [options, setOptions] = useState(
      contextOptions || storedData.options || { adult: 1, children: 0, room: 1 }
    );
    const navigate = useNavigate();
  
    // Hàm lấy danh sách ngày từ khoảng ngày
    const getDatesInRange = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dates = [];
      let currentDate = new Date(start);
  
      while (currentDate <= end) {
        dates.push(new Date(currentDate).getTime());
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return dates;
    };
  
    // Hàm kiểm tra phòng khả dụng
    const isRoomAvailable = (room, selectedDates) => {
      return !room.unavailableDates.some((date) =>
        selectedDates.includes(new Date(date).getTime())
      );
    };
  
    // Lấy danh sách ngày đã chọn
    const dates =
      contextDates?.length > 0 ? contextDates : storedData.dates || [];
    const selectedDates = dates[0]
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : [];
  
    const getListUtilities = (desc) => {
      return desc.split(",").map((item) => (
        <li key={item}>{item.trim()}</li>
      ));
    };

    const formatCurrency = (number) => {
      return new Intl.NumberFormat('vi-VN').format(number);
    };
  
  
    return (
      <div className="reserve">
        <div className="rContainer">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="rClose"
            onClick={() => setOpen(false)}
          />
          {loading ? (
            "loading"
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            data &&
            data.map((item) => {
              // Đếm số phòng khả dụng cho các ngày đã chọn
              const availableRooms = item.roomNumber.filter((room) =>
                isRoomAvailable(room, selectedDates)
              );
              // Chỉ hiển thị nếu có đủ số phòng yêu cầu
              if (availableRooms.length >= options.room) {
                return (
                  <div className="rItem" key={item._id}>
                    <h3 className="rTitle">
                      {item.title}
                      <span>{options.room}</span>
                    </h3>
                    <div className="rBottom">
                      <div className="rImg">
                        <img src={item.img} alt={item.title} />
                      </div>
                      <div className="rDesc">
                        <ul>{getListUtilities(item.desc)}</ul>
                      </div>
                      <div className="rPrice">
                        <p>{formatCurrency(item.price)} <u>đ</u></p>
                      </div>
                      <div className="rNumber">
                        <p>Ở tối đa {item.maxPeople} người</p>
                      </div>
                      <div className="rAction">
                        <button
                          type="button"
                          onClick={() => navigate(`/book/${item._id}`)}
                          className="rButton"
                        >
                          Đặt ngay
                        </button>
                        <p>Còn lại {availableRooms.length} phòng</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    );
  };

export default Reserve;