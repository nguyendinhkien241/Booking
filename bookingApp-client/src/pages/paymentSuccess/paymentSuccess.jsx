import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import "./paymentSuccess.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import axios from "axios";

const PaymentSuccess = () => {
    const { id } = useParams();
    const { data, loading, error } = useFetch(`/invoices/find/${id}`);
    const navigate = useNavigate();
    const checkPaymentAndFetchInvoice = async () => {
        try {
          // Gọi API checkPaymentVnp với invoiceId
          const checkResponse = await axios.get(`/invoices/checkvnp/${id}`, {
            params: new URLSearchParams(window.location.search), // Gửi toàn bộ query params từ VNPay
          });
        } catch (err) {
          console.error("Lỗi khi kiểm tra thanh toán:", err);
          navigate('/')
        } 
    }

    useEffect(() => {
          checkPaymentAndFetchInvoice();
    },[id])
    
    return (
        <div className="paymentSuccess">
            <Navbar />
            <Header type="list" />
            {loading ? "loading" : (
                data && <div className="payment-container">
                    <div className="payment-box">
                        <div className="payment-icon">
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </div>
                        <h3>Cảm ơn bạn đã sử dụng dịch vụ của Iambooking</h3>
                        <p>Thanh toán thành công, hệ thống gửi xác nhận và biên lai ngay lập tức. Quá trình nhanh gọn khách hàng hoàn toàn yên tâm</p>
                        <div className="payment-info">
                            <div className="payment-row">
                                <span>Họ tên</span>
                                <span className="payment-content">{data.name}</span>
                            </div>
                            <div className="payment-row">
                                <span>Địa chỉ</span>
                                <span className="payment-content">{data.address}</span>
                            </div>
                            <div className="payment-row">
                                <span>Số điện thoại</span>
                                <span className="payment-content">{data.phone}</span>
                            </div>
                            <div className="payment-row">
                                <span>Email</span>
                                <span className="payment-content">{data.email}</span>
                            </div>
                            <div className="payment-row">
                                <span>
                                    Thành tiền
                                </span>
                                <span className="payment-content">
                                    {data.totalPrice}
                                </span>
                            </div>
                        </div>
                        <Link to={"/"} className="payment-button">Quay về trang chủ</Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PaymentSuccess;

