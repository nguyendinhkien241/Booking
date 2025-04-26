import useFetch from "../../hooks/useFetch.js";
import "./featuredProperties.css";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FeaturedProperties = () => {
  const sliderRef = useRef(null);
  const { data, loading, error} = useFetch("/hotels?featured=true&limit=4")

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

  const appreciation = [
    76, 80, 45, 90, 77, 51, 57, 23, 26, 56
  ]

  return (
    <div className="fpContainer">
      <h2 className="fpTitle">Ưu đãi cho cuối tuần</h2>
      <p className="fpSubtitle">Tiết kiệm cho chỗ nghỉ trong 2 ngày cuối tuần</p>
      
      <div className="fpSlider">
        <button className="sliderButton left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
        
        <div className="fpItems" ref={sliderRef}>
          {(loading ? Array(4).fill(0) : (data)).map((item, index) => (
            <div className="fpItem" key={item._id || index}>
              {loading ? (
                <div className="fpImg loading"></div>
              ) : (
                <img src={item.photos[0]} alt={item.name} className="fpImg" />
              )}
              
              <div className="fpDetails">
                <h3 className="fpName">{loading ? "Đang tải..." : item.name}</h3>
                <p className="fpCity">{loading ? "Đang tải..." : item.city}</p>
                
                {!loading && (
                  <>
                    <div className="fpRating">
                      <span className="fpTag">{item.rating}</span> •
                      <span className="fpReviews">{appreciation[index]} đánh giá</span>
                    </div>
                    
                    {item.discountTag && (
                      <div className="fpDiscountTag">{item.discountTag}</div>
                    )}
                    
                    <p className="fpDuration">{item.duration}</p>
                    
                    <div className="fpPriceContainer">
                      <span className="fpOriginalPrice">Giá chỉ từ</span>
                      <span className="fpCheapestPrice">{item.cheapestPrice?.toLocaleString()} VNĐ</span>
                    </div>
                  </>
                )}
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

export default FeaturedProperties;
