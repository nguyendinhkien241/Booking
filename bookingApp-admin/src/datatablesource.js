export const userColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "Người dùng",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={
            params.row.img || "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"
          } alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "country",
    headerName: "Quốc gia",
    width: 100,
  },
  {
    field: "city",
    headerName: "Tỉnh/Thành phố",
    width: 100,
  },
  {
    field: "phone",
    headerName: "SĐT",
    width: 150,
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Tên",
    width: 150,
  },
  {
    field: "type",
    headerName: "Loại",
    width: 100,
  },
  {
    field: "title",
    headerName: "Tiêu đề",
    width: 230,
  },
  {
    field: "city",
    headerName: "Thành phố",
    width: 100,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "title",
    headerName: "Loại phòng",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Mô tả",
    width: 200,
  },
  {
    field: "price",
    headerName: "Giá thuê",
    width: 100,
  },
  {
    field: "hotelName",
    headerName: "Khách sạn",
    width: 150,
  },
  {
    field: "maxPeople",
    headerName: "Tối đa",
    width: 100,
  },
];

export const requestColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "ownerName",
    headerName: "Chủ sở hữu",
    width: 180,
  },
  {
    field: "phone",
    headerName: "Số điện thoại",
    width: 120,
  },
  {
    field: "hotelName",
    headerName: "Tên nơi lưu trú",
    width: 200,
  },
  {
    field: "city",
    headerName: "Tỉnh/Thành phố",
    width: 120,
  },
  {
    field: "submittedAt",
    headerName: "Thời điểm gửi",
    width: 180,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
  }
];
export const invoiceColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Khách hàng",
    width: 180,
  },
  {
    field: "phone",
    headerName: "Số điện thoại",
    width: 120,
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    width: 200,
  },
  {
    field: "country",
    headerName: "Quốc gia",
    width: 120,
  },
  {
    field: "totalPrice",
    headerName: "Thành tiền",
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Thời điểm tạo",
    width: 180,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
  }
]

export const discountColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "code",
    headerName: "Mã",
    width: 180,
  },
  {
    field: "value",
    headerName: "Giá trị",
    width: 120,
  },
  {
    field: "startDate",
    headerName: "Ngày bắt đầu",
    width: 200,
  },
  {
    field: "endDate",
    headerName: "Ngày hết hạn",
    width: 120,
  },
  {
    field: "timesUsed",
    headerName: "Số lần dùng",
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Thời điểm tạo",
    width: 180,
  },
]