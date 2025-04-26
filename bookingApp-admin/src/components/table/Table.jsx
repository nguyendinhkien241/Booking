import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import axios from "axios";

const List = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy dữ liệu hóa đơn từ API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/invoices/show");
        const invoices = response.data.map((item) => ({
          id: item.id,
          hotel: item.hotel,
          img: item.hotelImg,
          customer: item.customer,
          roomType: item.roomType,
          dateRange: item.dateRange,
          amount: item.amount,
          status: item.status,
        }));
        setRows(invoices);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Không thể tải danh sách hóa đơn!");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={50} className="tableCell">Mã hóa đơn</TableCell>
            <TableCell className="tableCell">Khách sạn</TableCell>
            <TableCell className="tableCell">Khách hàng</TableCell>
            <TableCell className="tableCell">Loại phòng</TableCell>
            <TableCell className="tableCell">Ngày ở</TableCell>
            <TableCell className="tableCell">Giá tiền</TableCell>
            <TableCell className="tableCell">Tình trạng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell width={50} className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                  {row.hotel}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.customer}</TableCell>
              <TableCell className="tableCell">{row.roomType}</TableCell>
              <TableCell className="tableCell">{row.dateRange}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status.replace(/\s/g, "")}`}>
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;