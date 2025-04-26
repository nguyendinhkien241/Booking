import { useContext, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import Loading from "../../components/loading/Loading";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2"; // Import SweetAlert2

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const [info, setInfo] = useState({
    username: undefined,
    email: undefined,
    password: undefined,
  });

  const [load, setLoad] = useState(false);

  const handleChangeRegistration = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();
  const { loading, error, dispatch } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoad(true);
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      // Hiển thị thông báo thành công
      await Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        text: "Chào mừng bạn đến với trang chủ.",
        timer: 2000, // Tự động đóng sau 2 giây
        showConfirmButton: false,
      });
      navigate("/"); // Chuyển hướng sang trang chủ
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại!",
        text: err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        showConfirmButton: true,
      });
    }
    setLoad(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('credentialResponse:', credentialResponse);
    setLoad(true);
    dispatch({ type: "LOGIN_START" });
    try {
      const { credential } = credentialResponse;
      if (!credential) {
        throw new Error("ID token (credential) không tồn tại trong credentialResponse");
      }
      console.log('ID Token:', credential);
      const res = await axios.post("/auth/google", { token: credential });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      // Hiển thị thông báo thành công
      await Swal.fire({
        icon: "success",
        title: "Đăng nhập bằng Google thành công!",
        text: "Chào mừng bạn đến với trang chủ.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response?.data || { message: "Đăng nhập bằng Google thất bại" } });
      console.log('Lỗi khi đăng nhập bằng Google:', err.response?.data || err);
      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: "error",
        title: "Đăng nhập bằng Google thất bại!",
        text: err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        showConfirmButton: true,
      });
    }
    setLoad(false);
  };

  const handleGoogleLoginError = () => {
    console.log('Đăng nhập bằng Google thất bại');
    dispatch({ type: "LOGIN_FAILURE", payload: { message: "Đăng nhập bằng Google thất bại" } });
    // Hiển thị thông báo thất bại
    Swal.fire({
      icon: "error",
      title: "Đăng nhập bằng Google thất bại!",
      text: "Có lỗi xảy ra, vui lòng thử lại.",
      showConfirmButton: true,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", info);
      // Hiển thị thông báo thành công
      await Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: res.data.message || "Tài khoản của bạn đã được tạo.",
        showConfirmButton: true,
      });
      setMessage(res.data.message);
      // Tùy chọn: Chuyển hướng về form đăng nhập sau khi đăng ký thành công
      setIsActive(false);
    } catch (error) {
      console.error(error);
      // Hiển thị thông báo thất bại
      await Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại!",
        text: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
        showConfirmButton: true,
      });
      setMessage("Đăng ký thất bại");
    }
  };

  return load ? (
    <Loading />
  ) : (
    <div className="login">
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Tạo tài khoản</h1>
            <div className="social-icons">
              <Link to={"/"} className="icon">
                <FontAwesomeIcon icon={faGooglePlusG} />
              </Link>
              <Link to={"/"} className="icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </Link>
              <Link to={"/"} className="icon">
                <FontAwesomeIcon icon={faGithub} />
              </Link>
              <Link to={"/"} className="icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Link>
            </div>
            <span>hoặc sử dụng email của bạn để đăng ký</span>
            <input name="username" type="text" onChange={handleChangeRegistration} placeholder="Tên tài khoản" />
            <input name="email" type="email" onChange={handleChangeRegistration} placeholder="Email" />
            <input name="password" type="password" onChange={handleChangeRegistration} placeholder="Mật khẩu" />
            <span className="success">{message}</span>
            <button onClick={handleRegister}>Đăng ký</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form>
            <h1>Đăng nhập</h1>
            <div className="social-icons">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                useOneTap
                shape="circle"
                theme="outline"
                size="large"
              />
            </div>
            <span>hoặc sử dụng tài khoản hệ thống của bạn</span>
            <input id="username" onChange={handleChange} type="text" placeholder="Tên tài khoản" />
            <input id="password" onChange={handleChange} type="password" placeholder="Mật khẩu" />
            {error && <span className="error">{error.message}</span>}
            <Link to={"/"}>Quên mật khẩu?</Link>
            <button disabled={loading} onClick={handleClick}>Đăng nhập</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Chào mừng quay lại</h1>
              <p>Đăng nhập với tài khoản của bạn để sử dụng dịch vụ ngay bây giờ</p>
              <button className="hidden" id="login" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Xin chào</h1>
              <p>Hãy đăng ký tài khoản để nhận ngay ưu đãi hấp dẫn cho chuyến du lịch của bạn</p>
              <button className="hidden" id="register" onClick={handleRegisterClick}>
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;