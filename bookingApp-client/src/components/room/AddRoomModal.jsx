import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddRoomModal.css';

const AddRoomModal = ({ onClose, onRoomAdded, hotelId }) => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    price: '',
    maxPeople: '',
    roomNumbers: '', // Comma-separated string input
  });
  const [file, setFile] = useState(null);
//   const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up the object URL to avoid memory leaks
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Clean up the previous preview URL if it exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      // Create a new preview URL for the selected file
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(newPreviewUrl);
      setFile(selectedFile);
    } else {
      // If no file is selected, clear the preview
      setPreviewUrl(null);
      setFile(null);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.desc || !formData.price || !formData.maxPeople || !formData.roomNumbers || !file) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        setLoading(false);
        return;
      }

      // Process room numbers: split the comma-separated string into an array
      const roomNumbersArray = formData.roomNumbers
        .split(',')
        .map((num) => num.trim())
        .filter((num) => num !== '')
        .map((num) => ({ number: Number(num), unavailableDates: [] }));

      if (roomNumbersArray.length === 0) {
        toast.error("Vui lòng nhập ít nhất một số phòng hợp lệ!");
        setLoading(false);
        return;
      }

      // Upload image to Cloudinary
      const dataRoom = new FormData();
      dataRoom.append("file", file);
      dataRoom.append("upload_preset", "upload");

      const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dy1rrvnwh/image/upload", dataRoom);
      const { url } = uploadRes.data;

      // Prepare the new room data
      const newRoom = {
        title: formData.title,
        desc: formData.desc,
        price: Number(formData.price),
        maxPeople: Number(formData.maxPeople),
        roomNumber: roomNumbersArray,
        img: url,
      };

      // Save the new room to the backend
      await axios.post(`/rooms/${hotelId}`, newRoom);

      toast.success("Tạo phòng thành công!");
      onRoomAdded(); // Notify the parent component to close the modal and refresh the list
    } catch (err) {
      console.error("Lỗi khi tạo phòng:", err);
      toast.error("Tạo phòng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room-modal-overlay">
      <div className="add-room-modal">
        <h2>Thêm phòng mới</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Ảnh phòng</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            
          </div>
          {/* Display the image preview if a file is selected */}
          {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          <div className="form-group">
            <label>Tên phòng</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Giá ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>Tối đa</label>
            <input
              type="number"
              name="maxPeople"
              value={formData.maxPeople}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Số phòng</label>
            <input
              type="text"
              name="roomNumbers"
              value={formData.roomNumbers}
              onChange={handleInputChange}
              placeholder="101, 102, 103"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;