import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './BookingList.css';
import { usePagination, useTable } from 'react-table';
import useFetch from '../../hooks/useFetch';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Loading from '../loading/Loading';


const BookingList = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData._id;
  const [ load, setLoad ] = useState(false);


  // Khai báo các state cho dropdown
  const [isRoomTypeOpen, setIsRoomTypeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const calculateDays = (dates) => {
    if (!dates || dates.length < 2) return { duration: 'N/A', range: 'N/A', startDate: null, endDate: null };
  
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
    const duration = `${diffDays} Ngày, ${diffDays - 1} Đêm`;
    const range = `From ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`;
  
    return { duration, range, startDate, endDate };
  };

  const mapStatus = (status) => {
    switch (status) {
      case 0: return 'Đang chờ xử lý';
      case 1: return 'Thanh toán sau';
      case 2: return 'Đã thanh toán';
      case 3: return 'Đã hoàn thành';
      case 4: return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const { data: invoices, loading: invoicesLoading, error: invoicesError } = useFetch(`/invoices/${userId}`);
  const [roomDetails, setRoomDetails] = useState({});
  const [hotelDetails, setHotelDetails] = useState({});

  useEffect(() => {
    setLoad(true)
    if (invoices && invoices.length > 0) {
      const fetchRoomAndHotelDetails = async () => {
        const roomIds = new Set();
        invoices.forEach((invoice) => {
          invoice.rooms.forEach((room) => roomIds.add(room.roomId));
        });

        const roomPromises = Array.from(roomIds).map(async (roomId) => {
          const response = await fetch(`http://localhost:8800/api/rooms/${roomId}`);
          const roomData = await response.json();
          return { roomId, roomData };
        });

        const rooms = await Promise.all(roomPromises);
        const roomMap = rooms.reduce((acc, { roomId, roomData }) => {
          acc[roomId] = roomData;
          return acc;
        }, {});
        setRoomDetails(roomMap);

        const hotelIds = new Set(Object.values(roomMap).map((room) => room.hotelId));
        const hotelPromises = Array.from(hotelIds).map(async (hotelId) => {
          const response = await fetch(`http://localhost:8800/api/hotels/find/${hotelId}`);
          const hotelData = await response.json();
          return { hotelId, hotelData };
        });

        const hotels = await Promise.all(hotelPromises);
        const hotelMap = hotels.reduce((acc, { hotelId, hotelData }) => {
          acc[hotelId] = hotelData;
          return acc;
        }, {});
        setHotelDetails(hotelMap);
      };

      fetchRoomAndHotelDetails();
    }
    setLoad(false);
  }, [invoices]);

  const handlePayNow = useCallback(async (invoiceId, totalPrice) => {
    try {
      const response = await axios.post('http://localhost:8800/api/invoices/payment/vnpay', {
        amount: totalPrice,
        userId: userId,
        InvoiceId: invoiceId
      });
      if (response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán!");
    }
  }, [userId]);

  const handleCancelBooking = useCallback(async (invoiceId) => {
    Swal.fire({
      title: 'Bạn có chắc muốn hủy đặt phòng không',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoad(true);
        try {
          // Lấy thông tin hóa đơn
          const invoiceResponse = await axios.get(`/invoices/find/${invoiceId}`);
          const invoiceInfo = invoiceResponse.data;
  
          if (invoiceInfo) {
            // Cập nhật trạng thái phòng: xóa các ngày tương ứng
            await Promise.all(
              invoiceInfo.rooms.map(async (room) => {
                await axios.put(`/rooms/state/${room.roomId}/${room.roomNumber}`, {
                  dates: invoiceInfo.date, // Gửi danh sách các ngày cần xóa
                });
              })
            );
          }
  
          // Cập nhật trạng thái hóa đơn thành "Đã hủy"
          await axios.put(`/invoices/cancel/${invoiceId}`);
  
          toast.success("Hủy đặt phòng thành công", {
            onClose: () => {
              window.location.reload();
            },
          });
        } catch (error) {
          console.error("Lỗi khi hủy đặt phòng:", error);
          toast.error("Có lỗi xảy ra");
        }
        setLoad(false);
      }
    });
  }, []);

  const isTodayWithinRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    return today >= startDate && today <= endDate;
  };

  const handleDelBooking = useCallback(async (invoiceId) => {
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
          await axios.delete(`/invoices/${invoiceId}`);
            toast.success("Xóa hóa đơn thành công!", {
              onClose: () => {
                window.location.reload();
              },
            });
        } catch (error) {
          toast.error("Có lỗi xảy ra!");
        }
      }
    })
  }, [])

  const handleCompleteBooking = useCallback(async (invoiceId) => {
    Swal.fire({
      title: 'Bạn có chắc muốn đánh dấu đặt phòng này là đã hoàn thành không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoad(true);
        try {
          // Lấy thông tin hóa đơn
          const invoiceResponse = await axios.get(`/invoices/find/${invoiceId}`);
          const invoiceInfo = invoiceResponse.data;
  
          if (invoiceInfo) {
            // Cập nhật trạng thái phòng: xóa các ngày tương ứng
            await Promise.all(
              invoiceInfo.rooms.map(async (room) => {
                await axios.put(`/rooms/state/${room.roomId}/${room.roomNumber}`, {
                  dates: invoiceInfo.date, // Gửi danh sách các ngày cần xóa
                });
              })
            );
          }
  
          // Cập nhật trạng thái hóa đơn thành "Đã hoàn thành"
          await axios.put(`/invoices/complete/${invoiceId}`, {}, { withCredentials: true });
  
          toast.success("Đặt phòng đã được đánh dấu là hoàn thành!", {
            onClose: () => {
              window.location.reload();
            },
          });
        } catch (error) {
          console.error("Lỗi khi hoàn thành đặt phòng:", error);
          toast.error("Có lỗi xảy ra!");
        }
        setLoad(false);
      }
    });
  }, []);

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const data = useMemo(() => {
    if (!invoices || !Object.keys(roomDetails).length || !Object.keys(hotelDetails).length) {
      return [];
    }
  
    return invoices.map((invoice) => {
      const firstRoom = invoice.rooms[0];
      const room = roomDetails[firstRoom.roomId];
      const hotel = room ? hotelDetails[room.hotelId] : null;
  
      return {
        id: invoice._id,
        hotel: hotel ? hotel.name : 'N/A',
        hotelImg: hotel ? hotel.photos[0] : '',
        location: hotel ? hotel.city : 'N/A',
        room: room ? room.title : 'N/A',
        guests: `${invoice.adults} Người lớn, ${invoice.children} Trẻ nhỏ`,
        days: calculateDays(invoice.date), // Updated to use the new return value
        pricing: `${formatCurrency(invoice.totalPrice)} đ`,
        bookedOn: new Date(invoice.createdAt).toLocaleDateString(),
        status: mapStatus(invoice.status),
        totalPrice: invoice.totalPrice,
        dates: invoice.date, // Store the raw dates for cancellation logic
      };
    });
  }, [invoices, roomDetails, hotelDetails]);

  const columns = useMemo(
    () => [
      {
        Header: 'Khách sạn',
        accessor: 'hotel',
        Cell: ({ row }) => (
          <div className="hotel-info">
            <img src={row.original.hotelImg} alt="hotel" className="hotel-img" />
            <div>
              <p>{row.original.hotel}</p>
              <span>{row.original.location}</span>
            </div>
          </div>
        ),
      },
      {
        Header: 'Phòng & Khách',
        accessor: 'room',
        Cell: ({ row }) => (
          <div>
            <h5>{row.original.room}</h5>
            <span>{row.original.guests}</span>
          </div>
        ),
      },
      {
        Header: 'Ngày ở',
        accessor: 'days',
        Cell: ({ row }) => {
          const { duration, range } = row.original.days;
          return (
            <div>
              <div>{duration}</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>{range}</div>
            </div>
          );
        },
      },
      { Header: 'Giá', accessor: 'pricing' },
      { Header: 'Đặt ngày', accessor: 'bookedOn' },
      {
        Header: 'Trạng thái',
        accessor: 'status',
        Cell: ({ value }) => (
          <span
            className={`status-badge ${
              value === 'Đang chờ xử lý' ? 'status-pending' :
              value === 'Thanh toán sau' ? 'status-upcoming' :
              value === 'Đã thanh toán' ? 'status-paid' :
              value === 'Đã hoàn thành' ? 'status-completed' :
              'status-cancelled'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: 'Tùy chọn',
        accessor: 'actions',
        Cell: ({ row }) => {
          const status = row.original.status;
          const { startDate, endDate } = row.original.days;
          const isWithinRange = isTodayWithinRange(startDate, endDate);
      
          return (
            <div className="actions">
              {status === 'Đang chờ xử lý' && (
                <>
                  <button
                    className="btn-pay-now"
                    onClick={() => handlePayNow(row.original.id, row.original.totalPrice)}
                  >
                    Thanh toán ngay
                  </button>
                  {!isWithinRange ? (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(row.original.id)}
                    >
                      Hủy đặt phòng
                    </button>
                  ) : (
                    <button
                      className="btn-complete"
                      onClick={() => handleCompleteBooking(row.original.id)}
                    >
                      Hoàn thành
                    </button>
                  )}
                </>
              )}
              {(status === 'Thanh toán sau' || status === 'Đã thanh toán') && (
                <>
                  {!isWithinRange ? (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(row.original.id)}
                    >
                      Hủy đặt phòng
                    </button>
                  ) : (
                    <button
                      className="btn-complete"
                      onClick={() => handleCompleteBooking(row.original.id)}
                    >
                      Hoàn thành
                    </button>
                  )}
                </>
              )}
              {status === 'Đã hủy' && (
                <button
                  className="btn-cancel"
                  onClick={() => handleDelBooking(row.original.id)}
                >
                  Xóa
                </button>
              )}
              {status === 'Đã hoàn thành' && (
                <button
                  className="btn-cancel"
                  onClick={() => handleDelBooking(row.original.id)}
                >
                  Xóa
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [handlePayNow, handleCancelBooking]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    usePagination
  );

  if (invoicesLoading) return <div>Loading...</div>;
if (invoicesError) return <div>Error: {invoicesError.message || 'Có lỗi xảy ra'}</div>;

  return load ? <Loading /> : (
    <div className="booking-list">
      <div className="list-header">
        <h6>Danh sách đặt phòng</h6>
        <div className="list-actions">
          <div className="search-bar">
            <i className="isax isax-search-normal-1"></i>
            <input type="text" placeholder="Tìm kiếm" />
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setIsRoomTypeOpen(!isRoomTypeOpen)}>Loại phòng</button>
            {isRoomTypeOpen && (
              <div className="dropdown-content">
                <Link to={"/"}>Single Room</Link>
                <Link to={"/"}>Double Room</Link>
                <Link to={"/"}>Twin Room</Link>
              </div>
            )}
          </div>
          <div className="filter-dropdown">
            <button onClick={() => setIsStatusOpen(!isStatusOpen)}>Trạng thái</button>
            {isStatusOpen && (
              <div className="dropdown-content">
                <Link to={"/"}>Đang chờ xử lý</Link>
                <Link to={"/"}>Thanh toán sau</Link>
                <Link to={"/"}>Đã thanh toán</Link>
                <Link to={"/"}>Đã hoàn thành</Link>
                <Link to={"/"}>Đã hủy</Link>
              </div>
            )}
          </div>
          <div className="sort-by">
            <span>Sắp xếp theo:</span>
            <div className="filter-dropdown">
              <button onClick={() => setIsSortOpen(!isSortOpen)}>Mặc định</button>
              {isSortOpen && (
                <div className="dropdown-content">
                  <Link to={"/"}>Recently Added</Link>
                  <Link to={"/"}>Ascending</Link>
                  <Link to={"/"}>Descending</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <div className="entries">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span>bản ghi</span>
        </div>
        <div className="page-nav">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <i className="isax isax-arrow-left-2"></i>
          </button>
          <ul>
            {pageOptions.map((pageNum) => (
              <li key={pageNum} className={pageIndex === pageNum ? 'active' : ''}>
                <button onClick={() => gotoPage(pageNum)}>{pageNum + 1}</button>
              </li>
            ))}
          </ul>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <i className="isax isax-arrow-right-3"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default BookingList;