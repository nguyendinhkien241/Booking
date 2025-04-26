import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import  useFetch  from "../../hooks/useFetch.js";
import axios from "axios";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InvoiceDetailModal from "../invoiceDetail/InvoiceDetailModal.jsx";

const Datatable = ({columns}) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const { data, loading, error } = useFetch(`/${path}`)
  const { data: hotels, loading: hotelsLoading } = useFetch("/hotels");
  const [list, setList] = useState([]);

  const handleDelete = async (id, hotelId) => {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa không',
      text: "Bạn sẽ không thể khôi phục lại",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Chắc chắn xóa',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (hotelId) {
            await axios.delete(`/${path}/${id}/${hotelId}`);
          } else {
            await axios.delete(`/${path}/${id}`);
          }
          setList(list.filter((item) => item._id !== id));
          toast.success("User deleted successfully!");
        } catch (err) {
          console.log(err);
          toast.error("Failed to delete user: " + err.message);
        }
      }
    });
  };
  useEffect(() => {
    if (data && hotels) {
      if(path === 'rooms') {
        // Tạo map { hotelId: hotelName }
        const hotelMap = hotels.reduce((acc, hotel) => {
          acc[hotel._id] = hotel.name;
          return acc;
        }, {});

        // Cập nhật list rooms với hotel name thay vì hotelId
        const updatedRooms = data.map((room) => ({
          ...room,
          hotelName: hotelMap[room.hotelId] || "Unknown Hotel", // Nếu không tìm thấy, hiển thị "Unknown Hotel"
        }));
        setList(updatedRooms);
      } else if(path === 'hotelOwnerRequests') {
        const updatedRooms = data.map((room) => ({
          ...room,
          submittedAt: new Date(room.submittedAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }));
        setList(updatedRooms);
      } else if(path === 'invoices') {
        const statusMap = {
          0: "Đang chờ xử lý",
          1: "Thanh toán sau",
          2: "Đã thanh toán",
          3: "Đã hoàn thành",
          4: "Đã hủy"
        };
        const updatedInvoices = data.map((invoice) => ({
          ...invoice,
          status: statusMap[invoice.status] || "Không xác định",
          createdAt: new Date(invoice.createdAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }));
        setList(updatedInvoices);
      } 
      else if(path === "discounts") {
        const updatedDiscount = data.map((discount) => ({
          ...discount,
          startDate: new Date(discount.startDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          endDate: new Date(discount.endDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          createdAt: new Date(discount.createdAt).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }));
        setList(updatedDiscount);
      }
      else {
        setList(data);
      }
    }
  }, [data, hotels]);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {
              (path === 'hotelOwnerRequest' || path === 'users') &&
              <Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton">View</div>
              </Link> 
            }
            {
              path === 'invoices' && 
              <InvoiceDetailModal invoiceId={params.row._id} />
            }
            {
              path !== "hotelOwnerRequests" && path !== 'invoices' && 
              <Link to={`/${path}/update/${params.row._id}`} style={{ textDecoration: "none" }}>
                <div className="updateButton">Update</div>
              </Link>
            }
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id, params.row.hotelId)}
            >
              Delete
            </div>
          </div> 


        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        List of {path.charAt(0).toUpperCase() + path.slice(1)}
        {path !== 'hotelOwnerRequests' && path !== 'invoices' &&
          <Link to= {`/${path}/new`} className="link">
            Add New
          </Link>}
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;
