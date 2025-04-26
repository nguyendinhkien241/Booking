import "./searchItem.css";
import {Link} from 'react-router-dom'

const SearchItem = ({item}) => {
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };
  return (
    <div className="searchItem">
      <img
        src={item.photos[0]}
        alt=""
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">Các trung tâm{item.distance}m</span>
        <span className="siTaxiOp">Miễn phí taxi</span>
        <span className="siSubtitle">
          {item.desc}
        </span>
        <span className="siFeatures">
          {item.desc}
        </span>
        <span className="siCancelOp">Miễn phí hủy </span>
        <span className="siCancelOpSubtitle">
          Bạn có thể hủy đặt phòng sau, vì vậy hãy chốt với giá tuyệt vời ngày hôm nay
        </span>
      </div>
      <div className="siDetails">
        {item.rating && <div className="siRating">
          <span>Tuyệt vời</span>
          <button>{item.rating}</button>
        </div>}
        <div className="siDetailTexts">
          <span className="siPrice">{formatCurrency(item.cheapestPrice)} <small>VNĐ</small></span>
          <span className="siTaxOp">Đã bao gồm thuế</span>
          <Link to={`/hotels/${item._id}`}>
          <button className="siCheckButton">Xem chi tiết</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
