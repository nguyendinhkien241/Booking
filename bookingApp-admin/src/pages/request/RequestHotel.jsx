import "./requestHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react"; // Added useEffect
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import { toast } from "react-toastify";

const RequestHotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(`/hotelOwnerRequests/${id}`);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  // Add a flag to track if the component is mounted
  useEffect(() => {
    let isMounted = true; // Flag to track mounted state

    return () => {
      isMounted = false; // Cleanup: set to false when component unmounts
    };
  }, []); // Empty dependency array: runs once on mount, cleanup on unmount

  const handleApprove = async () => {
    setLoad(true);
    try {
      // Step 1: Create the new hotel
      await axios.post(
        "/hotels",
        {
          name: data.hotelName,
          type: data.type,
          city: data.city,
          address: data.address,
          distance: data.distance,
          photos: data.photos,
          title: data.title,
          desc: data.desc,
          cheapestPrice: data.cheapestPrice,
          userId: data.userId,
          featured: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Step 2: Update the request status to "approved"
      await axios.put(`/hotelOwnerRequests/${id}/status`, { status: "approved" });

      // Step 3: Fetch the latest hotelId for the user
      const hotelResponse = await axios.get(`/hotels/latest/${data.userId}`);
      const hotelId = hotelResponse.data.hotelId;

      // Step 4: Update the user's isHotelier field
      await axios.put(`/users/hotelier/${data.userId}`, { hotelId });

      toast.success("Đã chấp nhận yêu cầu!");
      navigate("/hotelOwnerRequests");
    } catch (err) {
      if (document.getElementById("root")) {
        toast.error("Có lỗi xảy ra khi xác nhận!");
        setLoad(false);
      }
    }
  };

  const handleReject = async () => {
    setLoad(true);
    try {
      // Cập nhật trạng thái yêu cầu thành "rejected"
      await axios.put(
        `/hotelOwnerRequests/${id}/status`,
        { status: "rejected" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.info("Đã từ chối yêu cầu!");
      navigate("/hotelOwnerRequests");
    } catch (err) {
      if (document.getElementById("root")) {
        toast.error("Có lỗi xảy ra!");
        setLoad(false);
      }
    }
  };

  return load ? (
    <Loading />
  ) : (
    <div className="requestHotel">
      <Sidebar />
      <div className="request-container">
        <Navbar />
        <div className="top">
          <h1>Thông tin đăng ký</h1>
        </div>
        {loading ? (
          "loading"
        ) : (
          data && (
            <div className="bottom">
              <div className="left">
                <div className="image-preview">
                  {data.photos && data.photos.length !== 0 ? (
                    data.photos.slice(0, 10).map((file, index) => (
                      <img key={index} src={file} alt={`preview-${index}`} />
                    ))
                  ) : (
                    <img
                      src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      alt=""
                    />
                  )}
                  {data && data.photos && data.photos.length > 10 && (
                    <div className="more-images">
                      +{data.photos.length - 10} ảnh khác
                    </div>
                  )}
                </div>
              </div>
              <div className="right">
                <div className="form">
                  <div className="row">
                    <div className="column">
                      <label>Chủ nơi lưu trú: </label>
                      <p>{data.ownerName}</p>
                    </div>
                    <div className="column">
                      <label>Email: </label>
                      <p>{data.email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <label>Điện thoại: </label>
                      <p>{data.phone}</p>
                    </div>
                    <div className="column">
                      <label>Tên nơi lưu trú: </label>
                      <p>{data.hotelName}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <label>Loại hình lưu trú: </label>
                      <p>{data.type}</p>
                    </div>
                    <div className="column">
                      <label>Thành phố: </label>
                      <p>{data.city}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <label>Quốc gia: </label>
                      <p>{data.country}</p>
                    </div>
                    <div className="column">
                      <label>Địa chỉ: </label>
                      <p>{data.address}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <label>Cách trung tâm: </label>
                      <p>{data.distance}</p>
                    </div>
                    <div className="column">
                      <label>Tiêu đề: </label>
                      <p>{data.title}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column">
                      <label>Mô tả: </label>
                      <p>{data.desc}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="column">
                      <button onClick={handleApprove} className="submit-btn">
                        Xác nhận
                      </button>
                    </div>
                    <div className="column">
                      <button onClick={handleReject} className="cancel-btn">
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RequestHotel;