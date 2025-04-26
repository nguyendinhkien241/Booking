import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/sideBar/sideBar";
import Header from "../../components/header/Header.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Revenue.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dữ liệu giả định
const mockHotels = [
  { _id: "67f0ef2f8682f0bd3552cae4", name: "Hotel A" },
  { _id: "67f0ef2f8682f0bd3552cae5", name: "Hotel B" },
];

const mockRevenueData = {
  "67f0ef2f8682f0bd3552cae4": {
    2025: [
      { month: 1, revenue: 10, bookingCount: 5 },
      { month: 2, revenue: 15, bookingCount: 8 },
      { month: 3, revenue: 20, bookingCount: 12 },
      { month: 4, revenue: 12, bookingCount: 7 },
      { month: 5, revenue: 25, bookingCount: 15 },
      { month: 6, revenue: 30, bookingCount: 18 },
      { month: 7, revenue: 28, bookingCount: 16 },
      { month: 8, revenue: 22, bookingCount: 10 },
      { month: 9, revenue: 18, bookingCount: 9 },
      { month: 10, revenue: 14, bookingCount: 6 },
      { month: 11, revenue: 16, bookingCount: 8 },
      { month: 12, revenue: 19, bookingCount: 11 },
    ],
    2024: [
      { month: 1, revenue: 8, bookingCount: 4 },
      { month: 2, revenue: 12, bookingCount: 6 },
      { month: 3, revenue: 15, bookingCount: 9 },
      { month: 4, revenue: 10, bookingCount: 5 },
      { month: 5, revenue: 18, bookingCount: 10 },
      { month: 6, revenue: 20, bookingCount: 12 },
      { month: 7, revenue: 22, bookingCount: 13 },
      { month: 8, revenue: 17, bookingCount: 8 },
      { month: 9, revenue: 14, bookingCount: 7 },
      { month: 10, revenue: 11, bookingCount: 5 },
      { month: 11, revenue: 13, bookingCount: 6 },
      { month: 12, revenue: 16, bookingCount: 9 },
    ],
  },
  "67f0ef2f8682f0bd3552cae5": {
    2025: [
      { month: 1, revenue: 5, bookingCount: 3 },
      { month: 2, revenue: 8, bookingCount: 4 },
      { month: 3, revenue: 12, bookingCount: 6 },
      { month: 4, revenue: 7, bookingCount: 4 },
      { month: 5, revenue: 15, bookingCount: 8 },
      { month: 6, revenue: 18, bookingCount: 10 },
      { month: 7, revenue: 16, bookingCount: 9 },
      { month: 8, revenue: 13, bookingCount: 7 },
      { month: 9, revenue: 10, bookingCount: 5 },
      { month: 10, revenue: 9, bookingCount: 4 },
      { month: 11, revenue: 11, bookingCount: 6 },
      { month: 12, revenue: 14, bookingCount: 8 },
    ],
    2024: [
      { month: 1, revenue: 4, bookingCount: 2 },
      { month: 2, revenue: 6, bookingCount: 3 },
      { month: 3, revenue: 9, bookingCount: 5 },
      { month: 4, revenue: 5, bookingCount: 3 },
      { month: 5, revenue: 12, bookingCount: 6 },
      { month: 6, revenue: 14, bookingCount: 8 },
      { month: 7, revenue: 15, bookingCount: 9 },
      { month: 8, revenue: 11, bookingCount: 5 },
      { month: 9, revenue: 8, bookingCount: 4 },
      { month: 10, revenue: 7, bookingCount: 3 },
      { month: 11, revenue: 9, bookingCount: 5 },
      { month: 12, revenue: 12, bookingCount: 7 },
    ],
  },
};

const Revenue = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy thông tin người dùng từ localStorage
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData._id || "";
  const isHotelier = useMemo(() => userData.isHotelier || [], []); // Memoize để ổn định tham chiếu

  // Lấy danh sách khách sạn (chỉ gọi một lần khi mount)
  useEffect(() => {
    const fetchHotels = async () => {
      if (!userId || !isHotelier.length) {
        setError("Bạn không có quyền truy cập trang này!");
        return;
      }

      try {
        const hotelIds = isHotelier
          .filter((h) => h.authority && h.hotelId)
          .map((h) => h.hotelId);

        if (!hotelIds.length) {
          setError("Bạn chưa sở hữu khách sạn nào!");
          return;
        }

        setLoading(true);
        // Sử dụng dữ liệu giả định thay vì gọi API
        const hotelData = mockHotels.filter((hotel) =>
          hotelIds.includes(hotel._id)
        );

        if (!hotelData.length) {
          setError("Không tìm thấy thông tin khách sạn!");
        } else {
          setHotels(hotelData);
          // Chọn khách sạn đầu tiên nếu có
          setSelectedHotel(hotelData[0]._id);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setError("Không thể tải danh sách khách sạn!");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [userId, isHotelier]);

  // Lấy dữ liệu doanh thu khi selectedHotel hoặc selectedYear thay đổi
  useEffect(() => {
    const fetchRevenue = async () => {
      if (!selectedHotel) {
        setChartData({ labels: [], datasets: [] });
        return;
      }

      try {
        setLoading(true);
        // Sử dụng dữ liệu giả định thay vì gọi API
        const data =
          mockRevenueData[selectedHotel]?.[selectedYear] || Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            revenue: 0,
            bookingCount: 0,
          }));

        setChartData({
          labels: data.map((d) => `Tháng ${d.month}`),
          datasets: [
            {
              label: "Doanh thu (triệu VNĐ)",
              data: data.map((d) => d.revenue),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              yAxisID: "revenue",
            },
            {
              label: "Số đơn đặt phòng",
              data: data.map((d) => d.bookingCount),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              yAxisID: "bookings",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setError("Không thể tải dữ liệu doanh thu!");
        setChartData({ labels: [], datasets: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [userId, selectedHotel, selectedYear]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Doanh thu và đơn đặt phòng năm ${selectedYear}`,
      },
    },
    scales: {
      revenue: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Doanh thu (triệu VNĐ)",
        },
        beginAtZero: true,
      },
      bookings: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "Số đơn đặt phòng",
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Tạo danh sách năm (10 năm gần nhất)
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <>
      <Navbar />
      <Header type="list" />
      <div className="revenue">
        <Sidebar />
        <div className="revenue-main">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="revenue-controls">
                <div className="select-container">
                  <label>Chọn khách sạn:</label>
                  <select
                    value={selectedHotel}
                    onChange={(e) => setSelectedHotel(e.target.value)}
                    disabled={loading || !hotels.length}
                  >
                    <option value="">-- Chọn khách sạn --</option>
                    {hotels.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-container">
                  <label>Chọn năm:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={loading}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="loading">Đang tải...</div>
              ) : selectedHotel ? (
                <div className="chart-container">
                  <Bar data={chartData} options={options} />
                </div>
              ) : (
                <div className="no-selection">
                  Vui lòng chọn một khách sạn để xem doanh thu.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Revenue;