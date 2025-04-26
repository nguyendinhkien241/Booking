import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const Single = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const id = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(`/${path}/${id}`)

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        {loading ? "loading" : data && (
          <>
            <div className="top">
              <div className="left">
                <div className="editButton">Sửa</div>
                <h1 className="title">Thông tin</h1>
                <div className="item">
                  <img
                    src= {data.img ? data.img : "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"} 
                    alt=""
                    className="itemImg"
                  />
                  <div className="details">
                    <h1 className="itemTitle">{data.username}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Email:</span>
                      <span className="itemValue">{data.email}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Điện thoại:</span>
                      <span className="itemValue">{data.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Thành phố:</span>
                      <span className="itemValue">
                        {data.city}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Quốc gia:</span>
                      <span className="itemValue">{data.country}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right">
                <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
              </div>
            </div>
            <div className="bottom">
              <h1 className="title">Giao dịch gần nhất</h1>
              <List/>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Single;
