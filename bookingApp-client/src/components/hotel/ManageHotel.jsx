import React, { useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import ManageTable from '../table/ManageTable';
import { Link } from 'react-router-dom';
import EditModal from '../editModal/EditModal';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const HotelManagement = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData._id;

  const { data: hotels, loading: hotelsLoading, error: hotelsError, reFetch } = useFetch(`/hotels/user/${userId}`);
  const [editHotel, setEditHotel] = useState(null);
  const handleEdit = (hotelId) => {
    const hotelToEdit = hotels?.find((hotel) => hotel._id === hotelId);
    if (hotelToEdit) {
      setEditHotel(hotelToEdit);
    }
  };

  const handleDelete = async (hotelId) => {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa không',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/hotels/${hotelId}`);
          toast.success("Xóa khách sạn thành công!");
          reFetch();
        } catch (error) {
          console.error("Lỗi khi xóa khách sạn:", error);
          toast.error("Có lỗi xảy ra khi xóa khách sạn!");
        }
      }
    })
  };

  const columns = useMemo(
    () => [
      { Header: 'Tên', accessor: 'name' },
      { Header: 'Loại', accessor: 'type' },
      { Header: 'Thành phố', accessor: 'city' },
      {
        Header: 'Số phòng',
        accessor: 'rooms',
        Cell: ({ value }) => <span>{value.length}</span>,
      },
      {
        Header: 'Hành động',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="actions">
            <button
              className="btn-room"
            >
              <Link style={{color: 'white', textDecoration: 'none'}} to={`/room-list/${row.original._id}`}>
                Quản lý phòng
              </Link>
            </button>
            <button
              className="btn-edit"
              onClick={() => handleEdit(row.original._id)}
            >
              Sửa
            </button>
            <button
              className="btn-delete"
              onClick={() => handleDelete(row.original._id)}
            >
              Xóa
            </button>
          </div>
        ),
      },
    ],
    [hotels]
  );

  if (hotelsLoading) return <div>Loading...</div>;
  if (hotelsError) return <div>Error: {hotelsError.message || 'Có lỗi xảy ra'}</div>;

  return (
    <div className="hotel-management">
      <div className='hotelHeader' style={{display: 'flex', justifyContent: 'space-between', paddingLeft: 18 + 'px', paddingRight: 18 + 'px'}}>
        <h2>Quản lý khách sạn</h2>
        <button className="btn-add" style={{border: '2px solid green', borderRadius: 4 + 'px'}}>
          <Link style={{color: 'green', textDecoration: 'none'}} to="/revenue">
            Doanh thu
          </Link>
        </button>
      </div>
      <ManageTable
        data={hotels}
        columns={columns}
      />
      {editHotel && (
        <EditModal
          type="hotel"
          data={editHotel}
          onClose={() => setEditHotel(null)}
          onUpdated={() => {
            setEditHotel(null);
            reFetch();
          }}
        />
      )}
    </div>
  );
};

export default HotelManagement;