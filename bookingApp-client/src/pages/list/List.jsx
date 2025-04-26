import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import Loading from "../../components/loading/Loading";

const List = () => {
  const location = useLocation();
  const { dispatch } = useContext(SearchContext); // Lấy dispatch từ SearchContext
  const [destination, setDestination] = useState(location.state?.destination || "");
  const [dates, setDates] = useState(
    location.state?.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state?.options || {
    adult: 1,
    children: 0,
    room: 1,
  });
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const {data, loading, error, reFetch} = useFetch(`/hotels?city=${destination}&min=${min || 0}&max=${max || 999999999}`)

  const handleOptionChange = (name, value) => {
    setOptions((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleClick = () => {
    // Cập nhật dữ liệu vào SearchContext
    dispatch({
      type: "NEW_SEARCH",
      payload: {
        city: destination,
        dates,
        options,
      },
    });

    // Gọi lại API để lấy dữ liệu mới
    reFetch();

    // (Tùy chọn) Lưu vào LocalStorage
    localStorage.setItem(
      "searchData",
      JSON.stringify({ city: destination, dates, options })
    );
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Tìm kiếm</h1>
            <div className="lsItem">
              <label>Địa điểm</label>
              <input 
                value={destination}
                type="text"
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label>Thời gian</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {dates[0]?.startDate && dates[0]?.endDate
                  ? `${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                      dates[0].endDate,
                      "MM/dd/yyyy"
                    )}`
                  : "Select dates"}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Lựa chọn</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Giá thấp nhất <small>1 đểm</small>
                  </span>
                  <input 
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                    value={min} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Giá cao nhất <small>1 đêm</small>
                  </span>
                  <input 
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput" 
                    value={max}
                    />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Người lớn</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.adult}
                    onChange={(e) => handleOptionChange("adult", e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Trẻ em</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={options.children}
                    onChange={(e) =>
                      handleOptionChange("children", e.target.value)
                    }
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Phòng</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.room}
                    onChange={(e) => handleOptionChange("room", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
              {loading ? "Loading" : (
                data?.map(item => {
                  return <SearchItem item={item} key={item._id}/>
                })
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
