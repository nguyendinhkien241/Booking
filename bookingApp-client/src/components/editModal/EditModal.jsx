import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditModal.css';
import Loading from '../loading/Loading';

const EditModal = ({ type, data, onClose, onUpdated }) => {
  const isHotel = type === 'hotel';
  const [formData, setFormData] = useState({
    ...(isHotel
      ? {
          name: data.name || '',
          type: data.type || '',
          city: data.city || '',
          address: data.address || '',
          distance: data.distance || '',
          title: data.title || '',
          desc: data.desc || '',
          cheapestPrice: data.cheapestPrice || 0,
          featured: data.featured || false,
        }
      : {
          title: data.title || '',
          desc: data.desc || '',
          price: data.price || 0,
          maxPeople: data.maxPeople || 0,
          roomNumbers: data.roomNumber?.map((room) => room.number).join(', ') || '',
        }),
  });
  const [files, setFiles] = useState([]); // For new images to upload
  const [previewUrls, setPreviewUrls] = useState(isHotel ? data.photos || [] : [data.img] || []); // For image previews
  const [loading, setLoading] = useState(false);

  // Clean up preview URLs when the component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Clean up previous blob URLs
    previewUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    if (isHotel) {
      // For hotels, allow multiple images
      const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls.filter((url) => !url.startsWith('blob:')), ...newPreviewUrls]);
      setFiles([...files, ...selectedFiles]);
    } else {
      // For rooms, allow only one image
      const newPreviewUrl = URL.createObjectURL(selectedFiles[0]);
      setPreviewUrls([newPreviewUrl]);
      setFiles([selectedFiles[0]]);
    }
  };

  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedData = { ...formData };

      // Handle image uploads if new files are selected
      if (files.length > 0) {
        const uploadedUrls = [];
        for (const file of files) {
          const dataForm = new FormData();
          dataForm.append("file", file);
          dataForm.append("upload_preset", "upload");

          const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dy1rrvnwh/image/upload", dataForm);
          uploadedUrls.push(uploadRes.data.url);
        }

        if (isHotel) {
          updatedData.photos = [...(data.photos || []).filter((url) => previewUrls.includes(url)), ...uploadedUrls];
        } else {
          updatedData.img = uploadedUrls[0];
        }
      } else {
        // If no new images are selected, retain the existing images
        if (isHotel) {
          updatedData.photos = data.photos || [];
        } else {
          updatedData.img = data.img || '';
        }
      }

      // Process room numbers for rooms
      if (!isHotel) {
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

        updatedData.roomNumber = roomNumbersArray;
        updatedData.price = Number(formData.price);
        updatedData.maxPeople = Number(formData.maxPeople);
      } else {
        updatedData.cheapestPrice = Number(formData.cheapestPrice);
      }

      // Update the entity in the backend
      const endpoint = isHotel ? `/hotels/${data._id}` : `/rooms/${data._id}`;
      await axios.put(`${endpoint}`, updatedData, {
        withCredentials: true, // Include cookies
      });

      toast.success(`Cập nhật ${isHotel ? 'khách sạn' : 'phòng'} thành công!`);
      onUpdated();
    } catch (err) {
      console.error(`Lỗi khi cập nhật ${isHotel ? 'khách sạn' : 'phòng'}:`, err);
      toast.error(`Cập nhật ${isHotel ? 'khách sạn' : 'phòng'} thất bại!`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    previewUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setPreviewUrls(isHotel ? data.photos || [] : [data.img] || []);
    setFiles([]);
    onClose();
  };

  return loading ? <Loading /> :  (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Chỉnh sửa {isHotel ? 'Khách sạn' : 'Phòng'}</h2>
        <form onSubmit={handleSubmit}>
          {isHotel ? (
            <>
              <div className="form-group">
                <label>Tên khách sạn</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Loại</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">---- Chọn loại chỗ ở -----</option>
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Cabin">Cabin</option>
                  </select>
              </div>
              <div className="form-group">
                <label>Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Khoảng cách (mét)</label>
                <input
                  type="text"
                  name="distance"
                  value={formData.distance}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tiêu đề</label>
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
            </>
          ) : (
            <>
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
                <label>Số người tối đa</label>
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
            </>
          )}
          <div className="form-group">
            <label>{isHotel ? 'Ảnh khách sạn' : 'Ảnh phòng'}</label>
            <input
              type="file"
              accept="image/*"
              multiple={isHotel}
              onChange={handleFileChange}
            />
            <div className="image-preview">
              {previewUrls.slice(0, 5).map((url, index) => (
                <div key={index} className="image-preview-item">
                  <img src={url} alt={`Preview ${index}`} />
                </div>
              ))}
              {isHotel && previewUrls.length > 5 && (
                <div className="image-preview-more">
                  +{previewUrls.length - 5}
                </div>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;