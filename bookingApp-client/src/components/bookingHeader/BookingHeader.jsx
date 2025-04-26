import React, { useState } from 'react';
import './BookingHeader.css';

const BookingHeader = () => {
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  return (
    <div className="booking-header">
      <div className="header-content">
        <div>
          <h6>Chỗ ở</h6>
          <p>Số lượng đơn đã đặt: 1</p>
        </div>
        <div className="header-actions">
          <div className="date-range">
            <i className="isax isax-calendar-edit"></i>
            <input type="text" value="03/12/2025 - 03/18/2025" readOnly />
          </div>
          <div className="export-dropdown">
            <button className="export-btn" onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}>
              <i className="ti ti-file-export"></i> Xuất danh sách
            </button>
            {isExportDropdownOpen && (
              <div className="dropdown-content">
                <a href="#">Export as PDF</a>
                <a href="#">Export as Excel</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;