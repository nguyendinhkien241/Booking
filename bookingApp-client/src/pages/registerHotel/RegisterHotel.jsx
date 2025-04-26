import { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./rh.css"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axios from "axios";
import Loading from "../../components/loading/Loading";
import { toast } from "react-toastify";

const RegisterHotel = () => {
    const [countries, setCountries] = useState([]);
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    const [formData, setFormData] = useState({
        ownerName: "",
        email: "",
        phone: "",
        hotelName: "",
        type: "",
        city: "",
        country: "",
        address: "",
        distance: "",
        title: "",
        desc: "",
      });
    const [files, setFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [ load, setLoad] = useState(false);

    useEffect(() => {
        // Fetch data from REST Countries API
        fetch('https://restcountries.com/v3.1/all')
        .then((response) => response.json())
        .then((data) => {
            // Sort countries by name for better UX
            const sortedCountries = data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
            );
            setCountries(sortedCountries);
        })
        .catch((error) => console.error('Error fetching countries:', error));
    }, []); // Empty dependency array means this runs once on mount

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevImages) => [...prevImages, ...previews]);
    };

    const handleRemoveImage = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);
        try {
          const photoUrls = await Promise.all(
            files.map(async (file) => {
              const data = new FormData();
              data.append("file", file);
              data.append("upload_preset", "upload");
    
              const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dy1rrvnwh/image/upload",
                data
              );
              return uploadRes.data.url;
            })
          );
    
          const requestData = {
            ownerName: formData.ownerName,
            email: formData.email,
            phone: formData.phone,
            hotelName: formData.hotelName,
            type: formData.type,
            city: formData.city,
            country: formData.country,
            address: formData.address,
            distance: formData.distance,
            photos: photoUrls,
            title: formData.title,
            desc: formData.desc,
            status: "pending",
          };
    
          const response = await axios.post(
            `/hotelOwnerRequests/${userData._id}`,
            requestData, { withCredentials: true }
          );
          toast.success("Gửi yêu cầu thành công!");
    
          // Reset form
          setFormData({
            ownerName: "",
            email: "",
            phone: "",
            hotelName: "",
            type: "",
            city: "",
            country: "",
            address: "",
            distance: "",
            title: "",
            desc: "",
          });
          setFiles([]);
          setPreviewImages([]);
        } catch (error) {
          console.error("Error submitting request:", error);
        }
        setLoad(false);
      };

      return load ? <Loading /> : (
        <>
          <Navbar />
          <Header type="list" />
          <div className="register-hotel">
            <div className="rh-main">
              <form className="rh-form" onSubmit={handleSubmit}>
                <h1>Hãy đăng ký cơ sở lưu trú của bạn để trở thành đối tác của chúng tôi</h1>
                <div className="rh-form-control">
                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Họ tên chủ khách sạn"
                  />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                </div>
                <div className="rh-form-control">
                  <input
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    placeholder="Tên khách sạn"
                  />
                </div>
                <div className="rh-form-control">
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="rh-select"
                  >
                    <option value="">---- Chọn loại chỗ ở -----</option>
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Cabin">Cabin</option>
                  </select>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="rh-select"
                  >
                    <option>----- Quốc gia -----</option>
                    {countries.map((country) => (
                      <option key={country.cca3} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rh-form-control">
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Địa chỉ"
                  />
                  <input
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="Cách trung tâm"
                  />
                </div>
                <div className="rh-form-control">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Tiêu đề"
                  />
                </div>
                <div className="rh-form-control">
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    placeholder="Mô tả"
                    rows={4}
                  ></textarea>
                  <div className="rh-list-img">
                    <div className="rh-img-preview">
                      {previewImages.map((img, index) => (
                        <div key={index} className="image-container">
                          <img
                            src={img}
                            alt={`Preview ${index}`}
                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "3px" }}
                          />
                          <button type="button" onClick={() => handleRemoveImage(index)}>
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="rh-img-control">
                      <label htmlFor="file">
                        <DriveFolderUploadOutlinedIcon className="icon" />
                      </label>
                      <input
                        type="file"
                        id="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="rh-form-control">
                  <button type="submit">Gửi thông tin</button>
                </div>
              </form>
            </div>
          </div>
        </>
      );
}

export default RegisterHotel;