import "./mailList.css"

const MailList = () => {
  return (
    <div className="mail">
      <h1 className="mailTitle">Tiết kiệm thời gian và tiền bạc</h1>
      <span className="mailDesc">Đăng nhập và nhận hàng ngàn ưu đãi hấp dẫn</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Email của bạn" />
        <button>Xác nhận</button>
      </div>
    </div>
  )
}

export default MailList