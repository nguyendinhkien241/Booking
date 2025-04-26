import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import {useLocation} from "react-router-dom"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/loading/Loading";
import { toast } from "react-toastify";

const UpdateRoom = ({ inputs, title }) => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [ load, setLoad ] = useState(false)

  const { data: roomData, loading: roomLoading, error: roomError } = useFetch(`/rooms/${id}`);
  const { data: hotelsData, loading: hotelsLoading } = useFetch("/hotels");

  useEffect(() => {
    if (roomData) {
      setInfo({
        title: roomData.title || "",
        desc: roomData.desc || "",
        price: roomData.price || "",
        maxPeople: roomData.maxPeople || "",
      });
      setHotelId(roomData.hotelId || undefined);
      const initialRoomNumbers = roomData.roomNumber?.map(r => String(r.number)) || [];
      setRoomNumbers(initialRoomNumbers);
    }
  }, [roomData]);

  const handleChange = (e) => {
    setInfo((prev) => ({...prev, [e.target.id]: e.target.value}));
  }

  const handleRoomNumbersChange = (e) => {
    const value = e.target.value;
    // Chuyển đổi input thành mảng, loại bỏ khoảng trắng và giá trị rỗng
    const numbers = value
      .split(",")
      .map(num => num.trim())
      .filter(num => num !== "");
    setRoomNumbers(numbers);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoad(true)
    try {
      const numbersToUse = roomNumbers.length > 0 
        ? roomNumbers 
        : (roomData.roomNumber?.map(r => String(r.number)) || []);

      let updatedRoom = {
        ...info,
        roomNumber: numbersToUse.map(number => {
          const num = parseInt(number); // Chuyển thành số
          const existingRoom = roomData.roomNumber?.find(r => r.number === num);
          return {
            number: num,
            unavailableDates: existingRoom ? existingRoom.unavailableDates : []
          };
        }),
        hotelId: hotelId,
      };

      // Nếu có ảnh mới được upload
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dy1rrvnwh/image/upload",
          data
        );
        updatedRoom.img = uploadRes.data.url;
      } else {
        updatedRoom.img = roomData.img; // Giữ nguyên ảnh cũ nếu không upload ảnh mới
      }

      // Gửi request PUT để update room
      await axios.put(`/rooms/${id}`, updatedRoom);
      toast.success("Cập nhật phòng thành công!");
    } catch (err) {
      console.log(err);
      toast.error("Cập nhật phòng thất bại: " + err.message);
    }
    setLoad(false)
  }

  if (roomLoading) return <div>Loading...</div>;
  if (roomError) return <div>Error: {roomError}</div>;

  return load ? <Loading /> : (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : roomData?.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    value={info[input.id] || ""}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Room Numbers</label>
                <textarea
                  onChange={handleRoomNumbersChange}
                  placeholder="Give comma between room numbers (e.g., 101, 102, 103)"
                  value={roomNumbers.join(", ")}
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                  value={hotelId || ""}
                >
                  <option value="">Select a hotel</option>
                  {hotelsLoading
                    ? <option>Loading...</option>
                    : hotelsData?.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
