import React, { useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ManageTable from '../table/ManageTable';
import AddRoomModal from './AddRoomModal';
import EditModal from '../editModal/EditModal';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const location = useLocation();
  const hotelId = location.pathname.split("/")[2];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  // Fetch rooms for hotels owned by the user
  const { data: rooms, loading: roomsLoading, error: roomsError, reFetch } = useFetch(`/hotels/room/${hotelId}`);

  const handleEdit = (roomId) => {
    const roomToEdit = rooms?.find((room) => room._id === roomId);
    if (roomToEdit) {
      setEditRoom(roomToEdit);
    }
  };

  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const handleDelete = async (roomId) => {
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
              await axios.delete(`/rooms/${roomId}`);
              toast.success("Xóa phòng thành công!");
              reFetch();
            } catch (error) {
              console.error("Lỗi khi xóa phòng:", error);
              toast.error("Có lỗi xảy ra khi xóa phòng!");
            }
          }
        })
  };

  const columns = useMemo(
    () => [
      { Header: 'Tên phòng', accessor: 'title' },
      { Header: 'Giá', accessor: 'price', Cell: ({ value }) => <span>${value}</span> },
      { Header: 'Tối đa', accessor: 'maxPeople', Cell: ({ value }) => <span>{value} người</span> },
      {
        Header: 'Số phòng',
        accessor: 'roomNumber',
        Cell: ({ value }) => {
          // Calculate total rooms (length of roomNumber array)
          const totalRooms = value.length;
          // Calculate available rooms (rooms with empty or no unavailableDates)
          const availableRooms = value.filter((room) => {
            // Check if unavailableDates exists and includes today's date
            return !room.unavailableDates || !room.unavailableDates.includes(todayFormatted);
          }).length;
          return (
            <span>
              Tổng: {totalRooms} - Còn trống: {availableRooms}
              {availableRooms < totalRooms && (
                <span style={{ color: 'red', marginLeft: '5px' }}>(Có phòng đã được thuê)</span>
              )}
            </span>
          );
        },
      },
      {
        Header: 'Hành động',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="actions">
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
    [rooms]
  );

  if (roomsLoading) return <div>Loading...</div>;
  if (roomsError) return <div>Error: {roomsError.message || 'Có lỗi xảy ra'}</div>;

  return (
    <div className="room-management">
      <div style={{display: 'flex', justifyContent: 'space-between', paddingLeft: 18 + 'px', paddingRight: 18 + 'px'}}>
        <h2>Quản lý phòng của bạn</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-add" style={{color: 'green', border: '2px solid green', borderRadius: 4 + 'px'}}>
            Thêm phòng
        </button>
    </div>
      <ManageTable
        data={rooms}
        columns={columns}
      />

      {editRoom && (
        <EditModal
          type="room"
          data={editRoom}
          onClose={() => setEditRoom(null)}
          onUpdated={() => {
            setEditRoom(null);
            reFetch();
          }}
        />
      )}

      {/* Render the modal when isModalOpen is true */}
      {isModalOpen && (
        <AddRoomModal
          onClose={() => setIsModalOpen(false)} // Close the modal
          onRoomAdded={() => {
            setIsModalOpen(false); // Close the modal after adding
            reFetch(); // Refresh the room list
          }}
          hotelId={hotelId} // Pass userId to fetch hotels
        />
      )}
    </div>
  );
};

export default RoomManagement;