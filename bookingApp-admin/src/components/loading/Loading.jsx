import React from 'react';
import './Loading.css'; // Tùy chọn: thêm CSS để tùy chỉnh giao diện

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};
export default Loading;