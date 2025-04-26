import React, { useState } from "react";
import "./InvoiceDetailModal.css";
import useFetch from "../../hooks/useFetch";

const InvoiceDetailModal = ({ invoiceId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Hàm mở modal và lấy dữ liệu từ API
  const { data } = useFetch(`/invoices/detail/${invoiceId}`)
  const handleOpenModal = async () => {
    setInvoiceData(data);
    setIsOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsOpen(false);
    setInvoiceData(null);
  };

  return (
    <div>
      {/* Nút để mở modal */}
      <button className="detail-button" onClick={handleOpenModal}>
        Chi tiết
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Chi tiết hóa đơn</h2>

            {invoiceData ? (
              <div className="invoice-details">
                <div className="invoice-row">
                  <span className="label">Mã hóa đơn:</span>
                  <span className="value">{invoiceData.id}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Khách sạn:</span>
                  <span className="value">{invoiceData.hotel}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Hình ảnh khách sạn:</span>
                  <div className="value">
                    <img
                      src={invoiceData.hotelImg}
                      alt={invoiceData.hotel}
                      className="hotel-image"
                    />
                  </div>
                </div>
                <div className="invoice-row">
                  <span className="label">Khách hàng:</span>
                  <span className="value">{invoiceData.customer}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Địa chỉ:</span>
                  <span className="value">{invoiceData.address}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Số điện thoại:</span>
                  <span className="value">{invoiceData.phone}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Email:</span>
                  <span className="value">{invoiceData.email}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Loại phòng:</span>
                  <span className="value">{invoiceData.roomType}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Số người lớn:</span>
                  <span className="value">{invoiceData.adults}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Số trẻ em:</span>
                  <span className="value">{invoiceData.children}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Ghi chú:</span>
                  <span className="value">
                    {invoiceData.note || "Không có ghi chú"}
                  </span>
                </div>
                <div className="invoice-row">
                  <span className="label">Ngày đặt phòng:</span>
                  <span className="value">{invoiceData.dateRange}</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Giảm giá:</span>
                  <span className="value">{invoiceData.discount} VNĐ</span>
                </div>
                <div className="invoice-row">
                  <span className="label">Tổng tiền:</span>
                  <span className="value">
                    {invoiceData.amount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="invoice-row">
                  <span className="label">Trạng thái:</span>
                  <span className={`value status-${invoiceData.status}`}>
                    {invoiceData.status}
                  </span>
                </div>
                <div className="invoice-row">
                  <span className="label">Ngày tạo:</span>
                  <span className="value">
                    {new Date(invoiceData.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            ) : (
              <p>Đang tải dữ liệu...</p>
            )}

            {/* Nút đóng modal */}
            <button className="close-button" onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailModal;