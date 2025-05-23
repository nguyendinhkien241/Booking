import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="invoice" />
          <Widget type="hotel" />
          <Widget type="room" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="6 Tháng gần nhất (Lượt truy cập)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Giao dịch gần nhất</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
