import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/loading/Loading";
const Update = ({ inputs, title }) => {
  const location = useLocation();
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const id = location.pathname.split("/")[3];
  const [ load, setLoad ] = useState(false);

  const { data, loading, error } = useFetch(`/users/${id}`)
 
  useEffect(() => {
    if (data) {
      setInfo({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        country: data.country || "",
        city: data.city || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setInfo((prev) => ({...prev, [e.target.id]: e.target.value}));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      let updatedUser = { ...info };

      // Nếu có file ảnh mới được upload
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dy1rrvnwh/image/upload",
          data
        );
        const { url } = uploadRes.data;
        updatedUser.img = url;
      }

      // Gửi request PUT để update user
      await axios.put(`/users/${id}`, updatedUser);
      toast.success("Cập nhật tài khoản thành công");
    } catch (err) {
      console.log(err);
      alert("Error updating user: " + err.message);
    }
    setLoad(false);
  };

  const updateInputs = inputs.filter(input => 
    !["username", "email", "password"].includes(input.id)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (loading) return <Loading/>;
  if (error) return <div>Error: {error}</div>;

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
                  :  data.img || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
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

              {updateInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    value={info[input.id] || ""}
                  />
                </div>
              ))}
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
