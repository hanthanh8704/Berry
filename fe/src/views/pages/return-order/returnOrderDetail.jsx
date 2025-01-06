// //Ban làm lại

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Container,
//   Table,
//   Box,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   Checkbox
// } from '@mui/material';
// import { Carousel } from 'antd';
// import FormatCurrency from '../../utilities/FormatCurrency';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Col, Row, Button, Pagination, Modal, Form, Input } from 'antd';
// import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
// import {
//   MdOutlineConfirmationNumber,
//   MdPayment,
//   MdOutlineCancelPresentation,
//   MdOutlineChangeCircle,
//   MdCancel,
//   MdOutlineReplayCircleFilled
// } from 'react-icons/md'; // Material Design icons
// import { GiConfirmed } from 'react-icons/gi'; // Game Icons
// import axios from 'axios';
// import FormatDate from 'views/utilities/FormatDate';
// import { FaUndo } from 'react-icons/fa';
// import { FaTrash } from 'react-icons/fa';
// import TextArea from 'antd/es/input/TextArea';
// import { useReactToPrint } from 'react-to-print';
// import EmailTemplate from './formPdf';

// const listStatus = [
//   { id: 0, name: 'Tạo hóa đơn', status: 'TAO_HOA_DON', color: '#007BFF', title: 'Tạo hóa đơn', icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
//   { id: 1, name: 'Chờ xác nhận', status: 'CHO_XAC_NHAN', color: '#FFC107', title: 'Chờ xác nhận', icon: FaRegFileAlt }, // Vàng (cảnh báo)
//   { id: 2, name: 'Xác nhận', status: 'XAC_NHAN', color: '#17A2B8', title: 'Xác nhận', icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
//   { id: 3, name: 'Chờ vận chuyển', status: 'CHO_VAN_CHUYEN', color: '#FD7E14', title: 'Chờ vận chuyển', icon: MdPayment }, // Cam (tiến trình)
//   { id: 4, name: 'Vận chuyển', status: 'VAN_CHUYEN', color: '#28A745', title: 'Vận chuyển', icon: FaTruck }, // Xanh lá (thành công)
//   { id: 5, name: 'Thanh toán', status: 'DA_THANH_TOAN', color: '#20C997', title: 'Đã thanh toán', icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
//   { id: 6, name: 'Thành công', status: 'THANH_CONG', color: '#218838', title: 'Thành công', icon: GiConfirmed }, // Xanh lá đậm (hoàn tất)
//   { id: 7, name: 'Đã hủy', status: 'DA_HUY', color: '#DC3545', title: 'Đã hủy', icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
//   { id: 10, name: 'Trả hàng', status: 'TRA_HANG', color: '#138496', title: 'Trả hàng', icon: MdOutlineChangeCircle }, // Xanh dương đậm (xử lý)
//   { id: 8, name: 'Yêu cầu hủy', status: 'YEU_CAU_HUY', color: '#FF4500', title: 'Yêu cầu hủy', icon: MdCancel }, // Đỏ cam (yêu cầu)
//   { id: 9, name: 'Đặt lại', status: 'DAT_LAI', color: '#6A5ACD', title: 'Đặt lại', icon: MdOutlineReplayCircleFilled } // Tím xanh (đặt lại)
// ];

// const TraHangDetail = () => {
//   const navigate = useNavigate();
//   const [billReturn, setBillReturn] = useState([]);
//   const [billDetail, setBillDetail] = useState([]);

//   const [tenKH, setTenKH] = useState('');
//   const [diaChi, setDiaChi] = useState('');
//   const [tenNguoiNhan, setTenNguoiNhan] = useState('');
//   const [selectedSPCT, setSelectedSPCT] = useState([]);
//   const [allCheckedSPCT, setAllCheckedSPCT] = useState(false);
//   const [lyDo, setLyDo] = useState('');
//   const { id } = useParams();
//   const [form] = Form.useForm();
//   const [selectedBillDetail, setSelectedBillDetail] = useState(null);
//   const [billDetailReturn, setBillDetailReturn] = useState([]);

//   const [tongGiaGoc, setTongGiaGoc] = useState(0);
//   const [voucher, setVoucher] = useState(0);
//   const [moneyShip, setMoneyShip] = useState(0);
//   const [tongTienConLai, setTongTienConLai] = useState(0);
//   const [tongTienThanhToan, setTongTienThanhToan] = useState(0);
//   const [tongTienSauGiam, setTongTienSauGiam] = useState(0);
//   const [tongTienKhachNo, setTongTienKhachNo] = useState(0);
//   const [tongTienCuaHangNo, setTongTienCuaHangNo] = useState(0);
//   const [tongTienTraHang, setTongTienTraHang] = useState(0);
//   const [voucherNew, setVoucherNew] = useState(0);
//   const [tongTienTraKhach, setTongTienTraKhach] = useState(0);
//   const [billReturnDetail, setBillReturnDetail] = useState('');
//   const [phieuGiamGia, setPhieuGiamGia] = useState([]);

//   //Modal trả hàng nhập só lượng
//   const [isModalReturnBill, setIsModalReturnBill] = useState(false);

//   const showModalReturnBill = (row) => {
//     setSelectedBillDetail(row);
//     setIsModalReturnBill(true);
//   };

//   const handleCancelReturnBill = () => {
//     setIsModalReturnBill(false);
//   };

//   //Tra hang tat ca
//   // Hàm xử lý việc cập nhật billDetailReturn với tất cả dữ liệu từ billDetail
//   const updatedBillDetailReturn = [...billDetail];
//   console.log('updatedBillDetailReturn hhhhhhhhhhhhhhhhhh', updatedBillDetailReturn);
//   const handleAllReturnBill = () => {
//     try {
//       // Lấy tất cả dữ liệu từ billDetail
//       const updatedBillDetailReturn = getAllBillDetails().filter((detail) => detail.promotion == 0);

//       // Cập nhật billDetailReturn với các sản phẩm không có khuyến mãi
//       setBillDetailReturn(updatedBillDetailReturn);
//     } catch (error) {
//       console.error('Error while returning all bills:', error);
//     }
//   };

//   const getAllBillDetails = () => {
//     return [...billDetail]; // Giả sử billDetail là mảng chứa tất cả hóa đơn
//   };

//   const handleReturnSubmit = () => {
//     let quantity = form.getFieldValue('quantity');

//     // Chuyển đổi quantity sang kiểu số nguyên
//     quantity = parseInt(quantity, 10);

//     // Kiểm tra tính hợp lệ của số lượng nhập vào
//     if (quantity <= 0) {
//       toast.error('Số lượng trả phải là số nguyên dương ');
//       return;
//     }

//     if (!Number(quantity)) {
//       toast.error('Số lượng trả phải là số ');
//       return;
//     }

//     const updatedBillDetailReturn = [...billDetailReturn];

//     // Tìm kiếm sản phẩm đã tồn tại trong `billDetailReturn`
//     const existingItemIndex = updatedBillDetailReturn.findIndex((item) => item.idBillDetail === selectedBillDetail.idBillDetail);

//     console.log('updatedBillDetailReturn hhhhhhhhhhhhhhhhhh', updatedBillDetailReturn);

//     if (existingItemIndex > -1) {
//       // Nếu sản phẩm đã tồn tại, chỉ cộng dồn số lượng
//       const existingItem = updatedBillDetailReturn[existingItemIndex];
//       const updatedQuantity = existingItem.quantity + quantity;

//       // Kiểm tra giới hạn số lượng không vượt quá tồn kho của bản ghi gốc
//       if (updatedQuantity > selectedBillDetail.quantity) {
//         toast.error('Tổng số lượng trả không được vượt quá số lượng tồn của bản ghi gốc.');
//         return;
//       }

//       // Cập nhật số lượng cho bản ghi trong `billDetailReturn`
//       existingItem.quantity = updatedQuantity;
//       toast.success('Cập nhật số lượng trả hàng thành công');
//     } else {
//       // Nếu sản phẩm chưa có trong `billDetailReturn`, thêm sản phẩm mới
//       if (quantity > selectedBillDetail.quantity) {
//         toast.error('Số lượng trả không được vượt quá số lượng tồn của sản phẩm.');
//         return;
//       }

//       updatedBillDetailReturn.push({ ...selectedBillDetail, quantity });
//       toast.success('Thêm sản phẩm trả hàng thành công');
//     }
//     setBillDetailReturn(updatedBillDetailReturn);
//     form.resetFields();
//     handleCancelReturnBill();
//   };

//   const componentRef = useRef();
//   //In hóa đon
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current, // Nội dung để in
//     documentTitle: 'Hóa đơn trả hàng' // Tiêu đề file PDF
//   });

//   //Hamf trả hàng
//   const token = localStorage.getItem('token');
//   const idEmployee = localStorage.getItem('employeeId');
//   console.log("Employee id:", idEmployee);
//   const [note, setNote] = useState('');
//   const [pdfUrl, setPdfUrl] = useState('');

//   const handleNoteChange = (e) => {
//     setNote(e.target.value);
//   };

//   const handleAllBillDetailReturn = async () => {
//     console.log('Bill id:', billReturn.idBill);
//     console.log('Employee id:', idEmployee);
//     console.log('Note:', note);
//     console.log('Bill detail return:', billDetailReturn);
    
//     // Kiểm tra nếu note bị rỗng
//     if (!note || note.trim() === '') {
//       toast.error('Mô tả không được để trống!');
//       return; // Dừng lại nếu mô tả rỗng
//     }

//     if (!billDetailReturn || billDetailReturn.length === 0) {
//       toast.error('Vui lòng chọn sản phẩm cần trả');
//       return; // Dừng lại nếu không có sản phẩm nào được chọn
//     } else {
//       Modal.confirm({
//         title: 'Xác nhận xóa',
//         content: 'Bạn có chắc chắn muốn trả tất cả sản phẩm này không?',
//         okText: 'Có',
//         cancelText: 'Không',
//         onOk: async () => {
//           // Chuyển `onOk` thành hàm bất đồng bộ
//           try {
//             const updateBillGiveBack = {
//               idBill: billReturn.idBill,
//               idVoucher: phieuGiamGia.id,
//               note: note,
//               totalBillGiveBack: tongTienTraHang,
//               totalBillGiveBackCustomer: tongTienTraKhach
//             };

//             const response = await axios.post(`http://localhost:8080/api/return-order/give-back?idNhanVien=${idEmployee}`, null, {
//               params: {
//                 updateBill: JSON.stringify(updateBillGiveBack),
//                 data: JSON.stringify(billDetailReturn)
//               }
//             });

//             if (response.data.success) {
//               console.log('Trả hàng thành công', response.data);
//               toast.success('Trả hàng thành công');
//               // Thực hiện in PDF sau khi trả hàng thành công
//               handlePrint();
//               // Đảm bảo getAllBillDetail hoàn tất trước khi gọi calculateTotals
//               getAllBillReturn();
//               await getAllBillDetail();
//               setBillDetailReturn([]); // Reset billDetailReturn sau khi trả hàng
//               calculateTotals();
//               setTimeout(() => {
//                 navigate('/bill');
//               }, 2000); // Chuyển hướng sau khi thêm thành công sau 2s mới chuyển
//             } else {
//               console.error('Trả hàng thất bại:', response.data.message);
//             }
//           } catch (error) {
//             console.error('Lỗi khi trả hàng:', error);
//           }
//         }
//       });
//     }
//   };



//   // Hàm tính toán lại tổng tiền
//   const calculateTotals = () => {
//     setTongGiaGoc(billReturn.totalMoney); // Cập nhật tổng giá hàng gốc
//     setVoucher(billReturn.voucherValue); // Cập nhật voucher
//     setMoneyShip(billReturn.moneyShip); // Cập nhật tiền ship

//     // Tính tổng tiền thanh toán
//     setTongTienThanhToan(billReturn.totalMoney - billReturn.discountAmount + billReturn.moneyShip);
//     setTongTienSauGiam(billReturn.totalMoney - billReturn.discountAmount);

//     // Tính tổng giá hàng trả
//     const totalPriceReturn = billDetailReturn.reduce((total, bill) => total + bill.price * bill.quantity, 0);
//     setTongTienTraHang(totalPriceReturn); // Cập nhật tổng tiền trả hàng
    
//     setTongTienConLai(billReturn.totalMoney - totalPriceReturn);
//     console.log('Tổng tien tra ', totalPriceReturn); // Log dữ liệu từ API
//     console.log('Tổng tien chinh ddddd', billReturn.totalMoney); // Log dữ liệu từ API
//     console.log('Tổng teienf còn lại dddddd', tongTienConLai); // Log dữ liệu từ API

//     if (billDetailReturn.length === 0) {
//       setVoucherNew(0);
//       setTongTienKhachNo(0);
//       setTongTienCuaHangNo(0);
//       return;
//     }

//     if (billReturn.discountMethod === 'CO_DINH') {
//       if ((tongTienConLai > billReturn.minOrderValue && tongTienConLai < billReturn.maxDiscountValue) || tongTienConLai == 0) {
//         //Th 1 nếu số tiền còn lại mà vẫn phù hợp với voucher thì dùng nó
//         //Trường hợp thoả mãn
//         setTongTienKhachNo(0);
//         setTongTienCuaHangNo(0);

//         // Voucher cũ
//         const Voucher = (totalPriceReturn / tongGiaGoc) * voucher;
//         // Tính tổng tiền trả khách
//         setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
//       } else {
//         //Trường hợp không  thoả mãn voiứ voucher cũ
//         const newVoucher = phieuGiamGia.discountValue; //Đây là voucher mới phù hợp

//         const Voucher =
//           billReturn.discountMethod === 'PHAN_TRAM'
//             ? totalPriceReturn * (voucher / 100) // Tính voucher theo phần trăm
//             : (totalPriceReturn / tongGiaGoc) * voucher; // Tính voucher theo cố định

//         if (phieuGiamGia.discountMethod != null) {
//           // nếu có voucher mới
//           if (phieuGiamGia.discountMethod === 'PHAN_TRAM') {
//             setTongTienKhachNo((tongTienConLai / tongGiaGoc) * voucher);
//             setTongTienCuaHangNo(tongTienConLai * (newVoucher / 100));
//             // Cập nhật voucher mới
//             setVoucherNew(newVoucher);
//             // Tính tổng tiền trả khách
//             setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
//           } else {
//             //Nếu là CO_DINH

//             setTongTienKhachNo((tongTienConLai / tongGiaGoc) * voucher);
//             const tongTienCuaHangNo = (tongTienConLai / tongGiaGoc) * newVoucher;
//             setTongTienCuaHangNo(tongTienCuaHangNo);
//             // Cập nhật voucher mới
//             setVoucherNew(newVoucher);
//             // Tính tổng tiền trả khách
//             setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
//           }
//         } else {
//           //Trường hợp thoả mãn
//           setTongTienKhachNo(0);
//           setTongTienCuaHangNo(0);

//           // Da y laf voucher cu
//           const Voucher = totalPriceReturn * (voucher / 100);
//           // Tính tổng tiền trả khách
//           setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
//         }
//       }
//     } else if (billReturn.discountMethod === 'PHAN_TRAM') {
//       console.log('Tong tien con lai dddddddd', tongTienConLai);
//       if ((tongTienConLai > billReturn.minOrderValue && tongTienConLai < billReturn.maxDiscountValue) || tongTienConLai == 0) {
//         //Trường hợp thoả mãn
//         setTongTienKhachNo(0);
//         setTongTienCuaHangNo(0);

//         // Cập nhật voucher mới
//         const Voucher = totalPriceReturn * (voucher / 100);
//         // Tính tổng tiền trả khách
//         setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
//       } else {
//         //Trường hợp không  thoả mãn voiứ voucher cũ
//         const newVoucher = phieuGiamGia.discountValue; //Đây là voucher mới phù hợp

//         const Voucher =
//           billReturn.discountMethod === 'PHAN_TRAM'
//             ? totalPriceReturn * (voucher / 100) // Tính voucher theo phần trăm
//             : (totalPriceReturn / tongGiaGoc) * voucher; // Tính voucher theo cố định

//         if (phieuGiamGia.discountMethod != null) {
//           // nếu có voucher mới
//           if (phieuGiamGia.discountMethod === 'PHAN_TRAM') {
//             setTongTienKhachNo(tongTienConLai * (voucher / 100));
//             setTongTienCuaHangNo(tongTienConLai * (newVoucher / 100));
//             // Cập nhật voucher mới
//             setVoucherNew(newVoucher);
//             // Tính tổng tiền trả khách
//             setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
//           } else {
//             //Nếu là CO_DINH

//             setTongTienKhachNo(tongTienConLai * (voucher / 100));
//             const tongTienCuaHangNo = (tongTienConLai / tongGiaGoc) * newVoucher;
//             setTongTienCuaHangNo(tongTienCuaHangNo);
//             // Cập nhật voucher mới
//             setVoucherNew(newVoucher);
//             // Tính tổng tiền trả khách
//             setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
//           }
//         } else {
//           //Trường hợp thoả mãn
//           setTongTienKhachNo(0);
//           setTongTienCuaHangNo(0);

//           // Cập nhật voucher mới
//           const Voucher = totalPriceReturn * (voucher / 100);
//           // Tính tổng tiền trả khách
//           setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
//         }
//       }
//     } else if (billReturn.discountMethod === null) {
//       // Truongwf hợp đơn cũ  không có voucher nào phù hợp thì kiểm trả đơn mới có ko nếu không thì cho vô
//       const newVoucher = phieuGiamGia.discountValue; //Đây là voucher mới phù hợp

//       const Voucher =
//         billReturn.discountMethod === 'PHAN_TRAM' //Voucher cux
//           ? totalPriceReturn * (voucher / 100) // Tính voucher theo phần trăm
//           : (totalPriceReturn / tongGiaGoc) * voucher; // Tính voucher theo cố định

//       if (phieuGiamGia.discountMethod != null) {
//         // nếu có voucher mới
//         if (phieuGiamGia.discountMethod === 'PHAN_TRAM') {
//           setTongTienKhachNo(tongTienConLai * (voucher / 100));
//           setTongTienCuaHangNo(tongTienConLai * (newVoucher / 100));
//           // Cập nhật voucher mới
//           setVoucherNew(newVoucher);
//           // Tính tổng tiền trả khách
//           setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
//         } else {
//           //Nếu là CO_DINH
//           setTongTienKhachNo(tongTienConLai * (voucher / 100));
//           const tongTienCuaHangNo = (tongTienConLai / tongGiaGoc) * newVoucher;
//           setTongTienCuaHangNo(tongTienCuaHangNo);
//           // Cập nhật voucher mới
//           setVoucherNew(newVoucher);
//           // Tính tổng tiền trả khách
//           setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
//         }
//       } else {
//         setTongTienKhachNo(0);
//         setTongTienCuaHangNo(0);
//         setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
//       }
//     }
//   };

//   // Theo dõi các thay đổi
//   useEffect(() => {
//     calculateTotals(); // Tính toán lại khi có sự thay đổi
//   }, [billReturn, billDetailReturn, tongTienConLai, phieuGiamGia, voucherNew]);



//   useEffect(() => {
//     GetAllPhieuGiamGia(); // Gọi API nếu customerId tồn tại
//   }, [tongTienConLai]); // Theo dõi customerId để gọi lại nếu giá trị thay đổi

//   const GetAllPhieuGiamGia = () => {
//     console.log('tongTienConLai dddddddd mmmmmmmmmmmmmm', tongTienConLai); // Log dữ liệu từ API
//     axios
//         .get(`http://localhost:8080/api/gio-hang/auto/select/voucher`, {
//             params: {
//                 price: tongTienConLai, // Truyền idNhanVien nếu có, nếu không thì null
//                 idKH: billReturn.idCustomer,
//             },
//         })
//         .then((response) => {
//             setPhieuGiamGia(response.data); // Cập nhật state với dữ liệu từ API
//             console.log('Fetched Vouchers dddddddddddddzzzzzzzzzz:', response.data); // Log dữ liệu từ API
//         })
//         .catch((error) => {
//             console.error('Error fetching Phieu Giam Gia:', error.response?.data || error.message); // Log lỗi nếu có
//         });
// };
//   //Hàm xóa
//   // Hàm xử lý việc xóa bản ghi khỏi billDetailReturn
//   const handleDeleteRow = (rowId) => {
//     Modal.confirm({
//       title: 'Xác nhận xóa',
//       content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
//       okText: 'Có',
//       cancelText: 'Không',
//       onOk: () => {
//         setBillDetailReturn((prev) => prev.filter((row) => row.idBillDetail !== rowId));
//         calculateTotals();
//         setTongTienTraKhach(0);
//       }
//     });
//   };

//   console.log('BilldetailReutrn zzzzzzzzzzzzzzzzzzzzz', billDetailReturn);

//   // Phân trang cho billDetail
//   const [currentPageBillDetail, setCurrentPageBillDetail] = useState(1);
//   const [pageSizeBillDetail, setPageSizeBillDetail] = useState(3);

//   // Lấy các bản ghi hiện tại dựa vào trang
//   const currentRecords = billDetail.slice((currentPageBillDetail - 1) * pageSizeBillDetail, currentPageBillDetail * pageSizeBillDetail);

//   // Hàm xử lý khi thay đổi trang
//   const handleChangePageBillDetail = (newPage) => {
//     setCurrentPageBillDetail(newPage);
//   };

//   // Phân trang cho billDetailReturn
//   const [currentPageBillDetailReturn, setCurrentPageBillDetailReturn] = useState(1);
//   const [pageSizeBillDetailReturn, setPageSizeBillDetailReturn] = useState(3);

//   // Lấy các bản ghi hiện tại dựa vào trang
//   const currentRecordsReturn = billDetailReturn.slice(
//     (currentPageBillDetailReturn - 1) * pageSizeBillDetailReturn,
//     currentPageBillDetailReturn * pageSizeBillDetailReturn
//   );

//   // Hàm xử lý khi thay đổi trang
//   const handleChangePageBillDetailReturn = (newPage) => {
//     setCurrentPageBillDetailReturn(newPage);
//   };

//   //Detail của hóa đơn trả hàng
//   useEffect(() => {
//     if (id) {
//       // Kiểm tra nếu maHD có giá trị
//       getAllBillReturn();
//     }
//     if (billReturn.idBill) {
//       // Kiểm tra nếu id có giá trị
//       getAllBillReturn();
//     }
//   }, [id]); // Thêm maHD vào dependency array

//   useEffect(() => {
//     if (billReturn.idBill) {
//       // Kiểm tra nếu id có giá trị
//       getAllBillDetail();
//     }
//   }, [billReturn.idBill]);

//   function getAllBillReturn() {
//     axios
//       .get(`http://localhost:8080/api/return-order/information`, {
//         params: {
//           codeBill: id // Ma hoa don
//         }
//       })
//       .then((response) => {
//         const data = response.data.data || []; // Giả sử response.data có cấu trúc { data: [...] }
//         setBillReturn(data); // Đảm bảo dữ liệu trả về là mảng
//         console.log('Dữ liệu hóa đơn dddddddddddddddddddddddddd:', data); // Log dữ liệu hóa đơn
//       })
//       .catch((error) => {
//         console.error('Lỗi khi lấy dữ liệu hóa đơn:', error); // Thêm thông báo lỗi rõ ràng
//       });
//   }

//   function getAllBillDetail() {
//     axios
//       .get(`http://localhost:8080/api/return-order`, {
//         params: {
//           idBill: billReturn.idBill // Ma hoa don
//         }
//       })
//       .then((response) => {
//         const data = response.data.data || []; // Giả sử response.data có cấu trúc { data: [...] }
//         setBillDetail(data); // Đảm bảo dữ liệu trả về là mảng
//         console.log('Dữ liệu hóa đơn detail dddddddddddd zzzzzzzzz:', data); // Log dữ liệu hóa đơn
//       })
//       .catch((error) => {
//         console.error('Lỗi khi lấy dữ liệu hóa đơn:', error); // Thêm thông báo lỗi rõ ràng
//       });
//   }

//   const handleQuantityChange = (id, value) => {
//     // Kiểm tra nếu giá trị là số nguyên dương trước khi cập nhật
//     const updatedQuantity = Math.max(1, Number(value));
//     setBillDetailReturn((prevState) => prevState.map((row) => (row.idBillDetail === id ? { ...row, quantity: updatedQuantity } : row)));
//   };

//   const columns = [
//     { id: 'stt', label: 'STT' },
//     { id: 'image ', label: 'Ảnh' },
//     { id: 'product', label: 'Thông tin sản phẩm' },
//     { id: 'quantity', label: 'Số lượng' },
//     { id: 'price', label: 'Đơn giá' },
//     { id: 'toltalPrice', label: 'Thành tiền' },
//     { id: 'statusBill', label: 'Trạng thái' },
//     { id: 'active', label: 'Hành động' }
//   ];

//   const columns_Tra = [
//     { id: 'stt', label: 'STT' },
//     { id: 'image ', label: 'Ảnh' },
//     { id: 'product', label: 'Thông tin sản phẩm' },
//     { id: 'quantity', label: 'Số lượng' },
//     { id: 'price', label: 'Đơn giá' },
//     { id: 'toltalPrice', label: 'Thành tiền' },
//     { id: 'active', label: 'Hành động' }
//   ];

//   const totalTien = billDetailReturn.reduce((total, sp) => total + sp.quantity * sp.price, 0);

//   const status = listStatus.find((status) => status.id === billReturn.statusBill);
//   const backgroundColor = status ? status.color : '#fff';

//   return (
//     <Container>
//       <Typography level={1} strong style={{ fontSize: '30px' }} className=" my-4 text-dark text-uppercase">
//         Quản Lý Trả Hàng
//       </Typography>

//       <div className="mb-4 py-4" style={{ background: 'white', borderRadius: '10px' }}>
//         <div>
//           <Typography level={2} strong style={{ fontSize: '20px' }} className="custom-title text-dark text-uppercase mb-4 px-4">
//             Thông tin khách hàng
//           </Typography>
//         </div>

//         <ul className="list-unstyled fw-semibold mx-5">
//           <Row gutter={12}>
//             <Col xl={12}>
//               <li className="mb-4">
//                 Tên khách hàng: <span className="float-end text-danger">{billReturn.nameCustomer}</span>
//               </li>
//               <li className="mb-4">
//                 Số điện thoại:{' '}
//                 <span className="float-end text-danger">{billReturn.phoneNumber == null ? 'Không có' : billReturn.phoneNumber}</span>
//               </li>
//               <li className="mb-4">
//                 Địa chỉ:{' '}
//                 <span className="float-end text-danger text-end" style={{ width: '24rem' }}>
//                   {billReturn.address == null ? 'Không có' : billReturn.address}
//                 </span>
//               </li>
//               <li className="mb-4">
//                 Ghi chú:{' '}
//                 <span className="float-end text-danger text-end" style={{ width: '24rem' }}>
//                   {billReturn.note === '' ? 'Không có' : billReturn.note}
//                 </span>
//               </li>
//             </Col>
//             <Col xl={12}>
//               <li className="mb-4">
//                 Ngày giao hàng:
//                 <span className="float-end text-danger">
//                   {billReturn.deliveryDate === null ? 'Không có' : <FormatDate date={billReturn.deliveryDate} />}
//                 </span>
//               </li>
//               <li className="mb-4">
//                 Ngày nhận hàng:
//                 <span className="float-end text-danger">
//                   {billReturn.receivedDate === null ? 'Không có' : <FormatDate date={billReturn.receivedDate} />}
//                 </span>
//               </li>
//               <li className="mb-4">
//                 Trạng thái:{' '}
//                 <span
//                   style={{ width: '120px', backgroundColor, padding: '10px', borderRadius: '5px' }}
//                   className=" text-center float-end text-danger"
//                 >
//                   {listStatus.find((status) => status.id === billReturn.statusBill)?.name || 'Không có'}
//                 </span>
//               </li>
//               <li className="mb-4 ">
//                 {' '}
//                 Loại:{' '}
//                 <span
//                   style={{
//                     width: '120px',
//                     backgroundColor: billReturn.typeBill === 'TRUC_TUYEN' ? '#7925C7' : '#FFBC05',
//                     padding: '10px',
//                     borderRadius: '5px'
//                   }}
//                   className="float-end text-center text-danger"
//                 >
//                   {billReturn.typeBill === 'TRUC_TUYEN' ? 'Trực tuyến' : 'Tại quầy'}
//                 </span>
//               </li>
//             </Col>
//           </Row>
//         </ul>
//       </div>

//       <TableContainer component={Paper} style={{ marginTop: '20px' }} className="px-2">
//         <div className="d-flex align-items-center justify-content-between  my-3">
//           <Typography level={2} strong style={{ fontSize: '20px' }} className="custom-title text-dark text-uppercase mb-3 px-4">
//             Thông tin đơn hàng
//           </Typography>
//           <Button type="primary" className="mx-5" style={{ backgroundColor: '#1890ff', color: 'white' }} onClick={handleAllReturnBill}>
//             <FaTrash style={{ marginRight: '5px' }} /> Trả hàng tất cả
//           </Button>
//         </div>

//         <Table>
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell key={column.id}>{column.label}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {billDetail.map((row, index) => (
//               <TableRow key={row.idBill}>
//                 <TableCell>{row.stt}</TableCell>
//                 <TableCell className="d-flex align-items-center">
//                   <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px', height: '150px' }}>
//                     {
//                       <div className="image-container">
//                         <img src={row.image} alt="images" style={{ width: '100%', height: '100px', borderRadius: '10px' }} />
//                       </div>
//                     }
//                   </Carousel>
//                 </TableCell>
//                 <TableCell> {row.nameProduct}</TableCell>
//                 <TableCell>{row.quantity}</TableCell>
//                 <TableCell>
//                   {row.promotion !== 0 ? (
//                     <>
//                       <span
//                         style={{
//                           color: 'red',
//                           fontWeight: 'bold',
//                           fontSize: '16px',
//                           display: 'inline-block',
//                           verticalAlign: 'top' // Căn chỉnh lên trên
//                         }}
//                       >
//                         <FormatCurrency value={row.price * (1 - row.promotion / 100)} />
//                       </span>
//                       <span
//                         style={{
//                           color: 'black',
//                           textDecoration: 'line-through',
//                           fontSize: '12px',
//                           marginLeft: '5px', // Khoảng cách với giá mới
//                           verticalAlign: 'top' // Căn chỉnh lên trên
//                         }}
//                       >
//                         <FormatCurrency value={row.price} />
//                       </span>
//                     </>
//                   ) : (
//                     <FormatCurrency value={row.price} />
//                   )}
//                 </TableCell>

//                 <TableCell>
//                   {row.promotion !== 0 ? (
//                     <>{<FormatCurrency value={row.price * (1 - row.promotion / 100) * row.quantity} />}</>
//                   ) : (
//                     <FormatCurrency value={row.price * row.quantity} />
//                   )}
//                 </TableCell>

//                 <TableCell>
//                   <div
//                     style={{
//                       backgroundColor: listStatus.find((status) => status.id === row.statusBillDetail)?.color,
//                       padding: '10px',
//                       borderRadius: '20px'
//                     }}
//                     className="text-center"
//                   >
//                     {listStatus.find((status) => status.id === row.statusBillDetail)?.name}{' '}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div
//                     onClick={row.promotion === 0 ? () => showModalReturnBill(row) : null} // Chỉ gọi hàm nếu không có khuyến mãi
//                     className="mx-4 text-center py-1"
//                     style={{
//                       height: '30px',
//                       backgroundColor: row.promotion === 0 ? '#90ee90' : '#d3d3d3', // Màu nền mờ nếu có khuyến mãi
//                       borderRadius: '10px',
//                       cursor: row.promotion === 0 ? 'pointer' : 'not-allowed', // Chỉnh con trỏ chuột
//                       opacity: row.promotion === 0 ? 1 : 0.5 // Độ mờ
//                     }}
//                   >
//                     <FaUndo />
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         {/* Pagination for billDetail */}
//         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }} className="mb-4">
//           <Pagination
//             className="custom-pagination"
//             total={billDetail.length} // Tổng số bản ghi
//             current={currentPageBillDetail} // Trang hiện tại
//             pageSize={pageSizeBillDetail} // Kích thước trang
//             onChange={handleChangePageBillDetail} // Hàm xử lý thay đổi trang
//             showSizeChanger={false} // Không cho phép thay đổi số lượng bản ghi mỗi trang
//           />
//         </Grid>
//       </TableContainer>
//       {/* Modal cua nhap so luong tra hang */}
//       <Modal
//         title="Số lượng trả hàng"
//         open={isModalReturnBill}
//         onCancel={handleCancelReturnBill}
//         footer={[
//           <Button key="cancel" onClick={handleCancelReturnBill}>
//             Hủy
//           </Button>,
//           <Button key="submit" type="primary" onClick={handleReturnSubmit}>
//             Trả hàng
//           </Button>
//         ]}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Số lượng không được để trống!' }]}>
//             <Input placeholder="Nhập số lượng" />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Box className="d-flex justify-content-between" style={{ width: '100%' }}>
//         {/* Bảng sản phẩm trả */}
//         <Card style={{ marginTop: '20px', flex: 2, marginRight: '10px' }}>
//           {billDetailReturn.length > 0 && (
//             <TableContainer component={Paper} style={{ marginTop: '20px' }} className="px-2">
//               <Typography level={2} strong style={{ fontSize: '20px' }} className="my-4 custom-title text-dark text-uppercase mb-3 px-4">
//                 Danh sách sản phẩm trả
//               </Typography>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     {columns_Tra.map((column) => (
//                       <TableCell key={column.id}>{column.label}</TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {billDetailReturn.map((row, index) => {
//                     // Tìm row tương ứng trong billDetail để lấy số lượng tối đa
//                     const originalRow = billDetail.find((item) => item.idBillDetail === row.idBillDetail);
//                     const maxQuantity = originalRow ? originalRow.quantity : 1; // Giới hạn tối đa

//                     return (
//                       <TableRow key={row.id}>
//                         <TableCell>{row.stt}</TableCell>
//                         <TableCell>
//                           <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px', height: '130px' }}>
//                             <div key={index} className="image-container">
//                               <img src={row.image} alt="images" style={{ width: '100%', height: '100px', borderRadius: '10px' }} />
//                             </div>
//                           </Carousel>
//                         </TableCell>
//                         <TableCell>{row.nameProduct}</TableCell>
//                         <TableCell>
//                           <Input
//                             type="number"
//                             min={1}
//                             max={maxQuantity} // Đặt max là số lượng từ billDetail
//                             value={row.quantity}
//                             onChange={(e) => handleQuantityChange(row.idBillDetail, e.target.value)}
//                             style={{ width: '60px' }}
//                           />
//                         </TableCell>
//                         <TableCell>{<FormatCurrency value={row.price} />}</TableCell>
//                         <TableCell>
//                           {row.promotion != 0 ? (
//                             <>{<FormatCurrency value={row.price * (1 - row.discountPercentage / 100) * row.quantity} />}</>
//                           ) : (
//                             <FormatCurrency value={row.price * row.quantity} />
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <div
//                             className="mx-4 text-center py-1"
//                             style={{ color: 'white', height: '30px', backgroundColor: 'red', borderRadius: '10px', cursor: 'pointer' }}
//                             onClick={() => handleDeleteRow(row.idBillDetail)} // Gọi hàm xóa bản ghi khi nhấn
//                           >
//                             <FaTrash />
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//               {/* Pagination for billDetailReturn */}
//               <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }} className="mb-4">
//                 <Pagination
//                   className="custom-pagination"
//                   total={billDetailReturn.length} // Tổng số bản ghi
//                   current={currentPageBillDetailReturn} // Trang hiện tại
//                   pageSize={pageSizeBillDetailReturn} // Kích thước trang
//                   onChange={handleChangePageBillDetailReturn} // Hàm xử lý thay đổi trang
//                   showSizeChanger={false} // Không cho phép thay đổi số lượng bản ghi mỗi trang
//                 />
//               </Grid>
//             </TableContainer>
//           )}
//         </Card>

//         {/* Thông tin hoàn trả */}
//         <Card style={{ marginTop: '20px', flex: 1, marginLeft: '10px' }}>
//           <CardContent>
//             <Box spacing={2} className="list-unstyled fw-semibold mx-2">
//               <Typography variant="h3" className="mb-5 text-center" style={{ color: '#6A0DAD' }}>
//                 Thông tin thanh toán
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <li className="mb-4">
//                     Tổng giá hàng gốc:{' '}
//                     <span className="float-end text-danger">
//                       {' '}
//                       <FormatCurrency value={tongGiaGoc} />
//                     </span>
//                   </li>
//                   <li className="mb-4">
//                     Voucher đã sử dụng:
//                     <span className="float-end text-danger">
//                       {billReturn.discountMethod === 'PHAN_TRAM' ? `${voucher}%` : <FormatCurrency value={voucher} />}
//                     </span>
//                   </li>
//                   <li className="mb-4">
//                     Tiền ship:{' '}
//                     <span className="float-end text-danger">
//                       <FormatCurrency value={moneyShip} />
//                     </span>
//                   </li>
//                   <li className="mb-4">
//                     Tổng tiền sau khi giảm giá:{' '}
//                     <span className="float-end text-danger">
//                       <FormatCurrency value={tongTienSauGiam} />
//                     </span>
//                   </li>
//                   <li className="mb-4">
//                     Tổng tiền thanh toán:{' '}
//                     <span className="float-end text-danger">
//                       <FormatCurrency value={tongTienThanhToan} />
//                     </span>
//                   </li>
//                   <li className="mb-4">
//                     Tổng giá hàng trả:{' '}
//                     <span className="float-end text-danger">
//                       <FormatCurrency value={tongTienTraHang} />
//                     </span>
//                   </li>
//                   {/* <li className="mb-4">Tổng tiền giảm của từng sản phẩm: <span className="float-end text-danger"><FormatCurrency value={voucherNew} /></span></li> */}
//                 </Grid>
//               </Grid>
//               <hr />
//               <Grid container spacing={2} className="my-4">
//                 <Grid item xs={12}>
//                   <li className="mb-4">
//                     Voucher mới:
//                     <span className="float-end text-danger">
//                       {phieuGiamGia.discountMethod === null ? (
//                         <FormatCurrency value={0} />
//                       ) : phieuGiamGia.discountMethod === 'PHAN_TRAM' ? (
//                         `${voucherNew}%`
//                       ) : (
//                         <FormatCurrency value={voucherNew} />
//                       )}
//                     </span>
//                   </li>
//                   <li className="mb-4 ">
//                     Số tiền khách nợ{' '}
//                     <span className="text-danger float-end">
//                       <FormatCurrency value={tongTienKhachNo} />
//                     </span>
//                   </li>
//                   <li className="mb-4 ">
//                     Số tiền nợ khách{' '}
//                     <span className="text-danger float-end">
//                       <FormatCurrency value={tongTienCuaHangNo} />
//                     </span>
//                   </li>
//                   <li className="mb-4">
//                     Tổng tiền trả khách:{' '}
//                     <span className="text-danger float-end">
//                       <FormatCurrency value={tongTienTraKhach} />
//                     </span>
//                   </li>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Form.Item name="note" label="Mô tả" rules={[{ required: true, message: 'Mô tả không được để trống!' }]}>
//                     <TextArea placeholder="Nhập lí do..." rows={4} value={note} onChange={handleNoteChange} />
//                   </Form.Item>
//                 </Grid>
//                 <Button
//                   key="submit"
//                   style={{ marginLeft: '18px', width: '500px', backgroundColor: '#6A0DAD', color: 'white' }}
//                   onClick={handleAllBillDetailReturn} // Không cần truyền tham số vì đã sử dụng hook
//                 >
//                   Trả hàng
//                 </Button>
//                 {/* Nội dung hóa đơn cần in */}

//                 {/* Sử dụng EmailTemplate và truyền các props */}
//                 <div id="emailTemplate" style={{ display: 'none' }}>
//                   <EmailTemplate
//                     billReturn={billReturn}
//                     billDetailReturn={billDetailReturn}
//                     tongTienTraKhach={tongTienTraKhach}
//                     ref={componentRef}
//                   />
//                 </div>
//               </Grid>
//             </Box>
//           </CardContent>
//         </Card>
//       </Box>
//       <ToastContainer />
//     </Container>
//   );
// };

// export default TraHangDetail;

//Ban làm lại

import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Checkbox
} from '@mui/material';
import { Carousel, Select } from 'antd';
import FormatCurrency from '../../utilities/FormatCurrency';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Col, Row, Button, Pagination, Modal, Form, Input } from 'antd';
import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
import {
  MdOutlineConfirmationNumber,
  MdPayment,
  MdOutlineCancelPresentation,
  MdOutlineChangeCircle,
  MdCancel,
  MdOutlineReplayCircleFilled
} from 'react-icons/md'; // Material Design icons
import { GiConfirmed } from 'react-icons/gi'; // Game Icons
import axios from 'axios';
import FormatDate from 'views/utilities/FormatDate';
import { FaUndo } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import TextArea from 'antd/es/input/TextArea';
import { useReactToPrint } from 'react-to-print';
import EmailTemplate from './formPdf';

const listStatus = [
  { id: 0, name: 'Tạo hóa đơn', status: 'TAO_HOA_DON', color: '#007BFF', title: 'Tạo hóa đơn', icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
  { id: 1, name: 'Chờ xác nhận', status: 'CHO_XAC_NHAN', color: '#FFC107', title: 'Chờ xác nhận', icon: FaRegFileAlt }, // Vàng (cảnh báo)
  { id: 2, name: 'Xác nhận', status: 'XAC_NHAN', color: '#17A2B8', title: 'Xác nhận', icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
  { id: 3, name: 'Chờ vận chuyển', status: 'CHO_VAN_CHUYEN', color: '#FD7E14', title: 'Chờ vận chuyển', icon: MdPayment }, // Cam (tiến trình)
  { id: 4, name: 'Vận chuyển', status: 'VAN_CHUYEN', color: '#28A745', title: 'Vận chuyển', icon: FaTruck }, // Xanh lá (thành công)
  { id: 5, name: 'Thanh toán', status: 'DA_THANH_TOAN', color: '#20C997', title: 'Đã thanh toán', icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
  { id: 6, name: 'Thành công', status: 'THANH_CONG', color: '#218838', title: 'Thành công', icon: GiConfirmed }, // Xanh lá đậm (hoàn tất)
  { id: 7, name: 'Đã hủy', status: 'DA_HUY', color: '#DC3545', title: 'Đã hủy', icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
  { id: 10, name: 'Trả hàng', status: 'TRA_HANG', color: '#138496', title: 'Trả hàng', icon: MdOutlineChangeCircle }, // Xanh dương đậm (xử lý)
  { id: 8, name: 'Yêu cầu hủy', status: 'YEU_CAU_HUY', color: '#FF4500', title: 'Yêu cầu hủy', icon: MdCancel }, // Đỏ cam (yêu cầu)
  { id: 9, name: 'Đặt lại', status: 'DAT_LAI', color: '#6A5ACD', title: 'Đặt lại', icon: MdOutlineReplayCircleFilled } // Tím xanh (đặt lại)
];

const TraHangDetail = () => {
  const navigate = useNavigate();
  const [billReturn, setBillReturn] = useState([]);
  const [billDetail, setBillDetail] = useState([]);

  const [tenKH, setTenKH] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [tenNguoiNhan, setTenNguoiNhan] = useState('');
  const [selectedSPCT, setSelectedSPCT] = useState([]);
  const [allCheckedSPCT, setAllCheckedSPCT] = useState(false);
  const [lyDo, setLyDo] = useState('');
  const { id } = useParams();
  const [form] = Form.useForm();
  const [selectedBillDetail, setSelectedBillDetail] = useState(null);
  const [billDetailReturn, setBillDetailReturn] = useState([]);

  const [tongGiaGoc, setTongGiaGoc] = useState(0);
  const [voucher, setVoucher] = useState(0);
  const [moneyShip, setMoneyShip] = useState(0);
  const [tongTienConLai, setTongTienConLai] = useState(0);
  const [tongTienThanhToan, setTongTienThanhToan] = useState(0);
  const [tongTienSauGiam, setTongTienSauGiam] = useState(0);
  const [tongTienKhachNo, setTongTienKhachNo] = useState(0);
  const [tongTienCuaHangNo, setTongTienCuaHangNo] = useState(0);
  const [tongTienTraHang, setTongTienTraHang] = useState(0);
  const [voucherNew, setVoucherNew] = useState(0);
  const [tongTienTraKhach, setTongTienTraKhach] = useState(0);
  const [billReturnDetail, setBillReturnDetail] = useState('');
  const [phieuGiamGia, setPhieuGiamGia] = useState([]);

  const [quantityLoi, setQuantityLoi] = useState(0);
  const [quantityNham, setQuantityNham] = useState(0);
  const [selectedValues, setSelectedValues] = useState({});
  //Modal trả hàng nhập só lượng
  const [isModalReturnBill, setIsModalReturnBill] = useState(false);

  const showModalReturnBill = (row) => {
    setSelectedBillDetail(row);
    setIsModalReturnBill(true);
  };

  const handleCancelReturnBill = () => {
    setIsModalReturnBill(false);
  };

  //Tra hang tat ca
  // Hàm xử lý việc cập nhật billDetailReturn với tất cả dữ liệu từ billDetail
  const updatedBillDetailReturn = [...billDetail];
  console.log('billDetaildddddddddddddddd', billDetail);
  console.log('updatedBillDetailReturn hhhhhhhhhhhhhhhhhh', updatedBillDetailReturn);

  const handleAllReturnBill = () => {
    try {
      // Lấy tất cả dữ liệu từ billDetail
      const updatedBillDetailReturn = getAllBillDetails().filter((detail) => detail.promotion == 0);

      // Cập nhật billDetailReturn với các sản phẩm không có khuyến mãi

      setBillDetailReturn(updatedBillDetailReturn);
    } catch (error) {
      console.error('Error while returning all bills:', error);
    }
  };

  const getAllBillDetails = () => {
    return [...billDetail]; // Giả sử billDetail là mảng chứa tất cả hóa đơn
  };

  const handleReturnSubmit = () => {
    let quantity = form.getFieldValue('quantity');

    // Chuyển đổi quantity sang kiểu số nguyên
    quantity = parseInt(quantity, 10);

    // Kiểm tra tính hợp lệ của số lượng nhập vào
    if (quantity <= 0) {
      toast.error('Số lượng trả phải là số nguyên dương ');
      return;
    }

    if (!Number(quantity)) {
      toast.error('Số lượng trả phải là số ');
      return;
    }

    const updatedBillDetailReturn = [...billDetailReturn];

    // Tìm kiếm sản phẩm đã tồn tại trong `billDetailReturn`
    const existingItemIndex = updatedBillDetailReturn.findIndex((item) => item.idBillDetail === selectedBillDetail.idBillDetail);

    console.log('updatedBillDetailReturn hhhhhhhhhhhhhhhhhh', updatedBillDetailReturn);

    if (existingItemIndex > -1) {
      // Nếu sản phẩm đã tồn tại, chỉ cộng dồn số lượng
      const existingItem = updatedBillDetailReturn[existingItemIndex];
      const updatedQuantity = existingItem.quantity + quantity;

      // Kiểm tra giới hạn số lượng không vượt quá tồn kho của bản ghi gốc
      if (updatedQuantity > selectedBillDetail.quantity) {
        toast.error('Tổng số lượng trả không được vượt quá số lượng tồn của bản ghi gốc.');
        return;
      }

      // Cập nhật số lượng cho bản ghi trong `billDetailReturn`
      existingItem.quantity = updatedQuantity;
      toast.success('Cập nhật số lượng trả hàng thành công');
    } else {
      // Nếu sản phẩm chưa có trong `billDetailReturn`, thêm sản phẩm mới
      if (quantity > selectedBillDetail.quantity) {
        toast.error('Số lượng trả không được vượt quá số lượng tồn của sản phẩm.');
        return;
      }

      updatedBillDetailReturn.push({ ...selectedBillDetail, quantity });
      toast.success('Thêm sản phẩm trả hàng thành công');
    }
    setBillDetailReturn(updatedBillDetailReturn);
    form.resetFields();
    handleCancelReturnBill();
  };

  const componentRef = useRef();
  //In hóa đon
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // Nội dung để in
    documentTitle: 'Hóa đơn trả hàng' // Tiêu đề file PDF
  });

  //Hamf trả hàng
  const token = localStorage.getItem('token');
  const idEmployee = localStorage.getItem('employeeId');
  console.log("Employee id:", idEmployee);
  const [note, setNote] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };



  const handleAllBillDetailReturn = async () => {
    console.log('Bill id:', billReturn.idBill);
    console.log('Employee id:', idEmployee);
    console.log('Note:', note);
    console.log('Bill detail return:', billDetailReturn);

    // Kiểm tra nếu note bị rỗng
    if (!note || note.trim() === '') {
      toast.error('Mô tả không được để trống!');
      return; // Dừng lại nếu mô tả rỗng
    }

    console.log("Tổng tiền trả hàng:", tongTienTraHang);
    console.log("Tổng giá gốc:", tongGiaGoc);

    const tongTienTraHangNum = Number(tongTienTraHang);
    const tongGiaGocNum = Number(tongGiaGoc);

    if (tongTienTraHangNum > tongGiaGocNum) {
      toast.error('Tổng số tiền hoàn lại vượt quá tổng số tiền hóa đơn!.Vui lòng giảm số lượng');
      return;
    }

    // Duyệt qua từng bản ghi trong billDetailReturn
    for (let i = 0; i < billDetailReturn.length; i++) {
      const item = billDetailReturn[i];

      // Kiểm tra nếu không có trường 'status'
      if (!item.status) {
        toast.error(`Sản phẩm tại vị trí ${i + 1} thiếu trường 'status'`);
        return; // Dừng lại nếu có bản ghi thiếu 'status'
      }

      // Kiểm tra nếu status là 'CA_HAI' nhưng thiếu 'quantityLoi' hoặc 'quantityNham'
      if (item.status === 'CA_HAI') {
        if (item.quantityLoi === undefined || item.quantityNham === undefined) {
          toast.error(`Sản phẩm tại vị trí ${i + 1} với trạng thái 'CA_HAI' thiếu thông tin số lượng lỗi hoặc số lượng nhầm`);
          return; // Dừng lại nếu có bản ghi thiếu 'quantityLoi' hoặc 'quantityNham' khi trạng thái là 'CA_HAI'
        }
      }
    }
    
    if (!billDetailReturn || billDetailReturn.length === 0) {
      toast.error('Vui lòng chọn sản phẩm cần trả');
      return; // Dừng lại nếu không có sản phẩm nào được chọn
    } else {
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn trả tất cả sản phẩm này không?',
        okText: 'Có',
        cancelText: 'Không',
        onOk: async () => {
          // Chuyển `onOk` thành hàm bất đồng bộ
          try {
            const updateBillGiveBack = {
              idBill: billReturn.idBill,
              idVoucher: phieuGiamGia.id,
              note: note,
              totalBillGiveBack: tongTienTraHang,
              totalBillGiveBackCustomer: tongTienTraKhach

            };



            const response = await axios.post(`http://localhost:8080/api/return-order/give-back?idNhanVien=${idEmployee}`, null, {
              params: {
                updateBill: JSON.stringify(updateBillGiveBack),
                data: JSON.stringify(billDetailReturn)
              }
            });

            if (response.data.success) {
              console.log('Trả hàng thành công', response.data);
              toast.success('Trả hàng thành công');
              // Thực hiện in PDF sau khi trả hàng thành công
              handlePrint();
              // Đảm bảo getAllBillDetail hoàn tất trước khi gọi calculateTotals
              getAllBillReturn();
              await getAllBillDetail();
              setBillDetailReturn([]); // Reset billDetailReturn sau khi trả hàng
              calculateTotals();
              setTimeout(() => {
                navigate('/bill');
              }, 2000); // Chuyển hướng sau khi thêm thành công sau 2s mới chuyển
            } else {
              console.error('Trả hàng thất bại:', response.data.message);
            }
          } catch (error) {
            console.error('Lỗi khi trả hàng:', error);
          }
        }
      });
    }

  };



  // Hàm tính toán lại tổng tiền
  const calculateTotals = () => {
    setTongGiaGoc(billReturn.totalMoney); // Cập nhật tổng giá hàng gốc
    setVoucher(billReturn.voucherValue); // Cập nhật voucher
    setMoneyShip(billReturn.moneyShip); // Cập nhật tiền ship

    // Tính tổng tiền thanh toán
    setTongTienThanhToan(billReturn.totalMoney - billReturn.discountAmount + billReturn.moneyShip);
    setTongTienSauGiam(billReturn.totalMoney - billReturn.discountAmount);

    // Tính tổng giá hàng trả
    const totalPriceReturn = billDetailReturn.reduce((total, bill) => total + bill.price * bill.quantity, 0);
    setTongTienTraHang(totalPriceReturn); // Cập nhật tổng tiền trả hàng

    setTongTienConLai(billReturn.totalMoney - totalPriceReturn);
    console.log('Tổng tien tra ', totalPriceReturn); // Log dữ liệu từ API
    console.log('Tổng tien chinh ddddd', billReturn.totalMoney); // Log dữ liệu từ API
    console.log('Tổng teienf còn lại dddddd', tongTienConLai); // Log dữ liệu từ API

    if (billDetailReturn.length === 0) {
      setVoucherNew(0);
      setTongTienKhachNo(0);
      setTongTienCuaHangNo(0);
      return;
    }

    if (billReturn.discountMethod === 'CO_DINH') {
      if ((tongTienConLai > billReturn.minOrderValue && tongTienConLai < billReturn.maxDiscountValue) || tongTienConLai == 0) {
        //Th 1 nếu số tiền còn lại mà vẫn phù hợp với voucher thì dùng nó
        //Trường hợp thoả mãn
        setTongTienKhachNo(0);
        setTongTienCuaHangNo(0);

        // Voucher cũ
        const Voucher = (totalPriceReturn / tongGiaGoc) * voucher;
        // Tính tổng tiền trả khách
        setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
      } else {
        //Trường hợp không  thoả mãn voiứ voucher cũ
        const newVoucher = phieuGiamGia.discountValue; //Đây là voucher mới phù hợp

        const Voucher =
          billReturn.discountMethod === 'PHAN_TRAM'
            ? totalPriceReturn * (voucher / 100) // Tính voucher theo phần trăm
            : (totalPriceReturn / tongGiaGoc) * voucher; // Tính voucher theo cố định

        if (phieuGiamGia.discountMethod != null) {
          // nếu có voucher mới
          if (phieuGiamGia.discountMethod === 'PHAN_TRAM') {
            setTongTienKhachNo((tongTienConLai / tongGiaGoc) * voucher);
            setTongTienCuaHangNo(tongTienConLai * (newVoucher / 100));
            // Cập nhật voucher mới
            setVoucherNew(newVoucher);
            // Tính tổng tiền trả khách
            setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
          } else {
            //Nếu là CO_DINH

            setTongTienKhachNo((tongTienConLai / tongGiaGoc) * voucher);
            const tongTienCuaHangNo = (tongTienConLai / tongGiaGoc) * newVoucher;
            setTongTienCuaHangNo(tongTienCuaHangNo);
            // Cập nhật voucher mới
            setVoucherNew(newVoucher);
            // Tính tổng tiền trả khách
            setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
          }
        } else {
          //Trường hợp thoả mãn
          setTongTienKhachNo(0);
          setTongTienCuaHangNo(0);

          // Da y laf voucher cu
          const Voucher = totalPriceReturn * (voucher / 100);
          // Tính tổng tiền trả khách
          setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
        }
      }
    } else if (billReturn.discountMethod === 'PHAN_TRAM') {
      console.log('Tong tien con lai dddddddd', tongTienConLai);
      if ((tongTienConLai > billReturn.minOrderValue && tongTienConLai < billReturn.maxDiscountValue) || tongTienConLai == 0) {
        //Trường hợp thoả mãn
        setTongTienKhachNo(0);
        setTongTienCuaHangNo(0);

        // Cập nhật voucher mới
        const Voucher = totalPriceReturn * (voucher / 100);
        // Tính tổng tiền trả khách
        setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
      } else {
        //Trường hợp không  thoả mãn voiứ voucher cũ
        const newVoucher = phieuGiamGia.discountValue; //Đây là voucher mới phù hợp

        const Voucher =
          billReturn.discountMethod === 'PHAN_TRAM'
            ? totalPriceReturn * (voucher / 100) // Tính voucher theo phần trăm
            : (totalPriceReturn / tongGiaGoc) * voucher; // Tính voucher theo cố định

        if (phieuGiamGia.discountMethod != null) {
          // nếu có voucher mới
          if (phieuGiamGia.discountMethod === 'PHAN_TRAM') {
            setTongTienKhachNo(tongTienConLai * (voucher / 100));
            setTongTienCuaHangNo(tongTienConLai * (newVoucher / 100));
            // Cập nhật voucher mới
            setVoucherNew(newVoucher);
            // Tính tổng tiền trả khách
            setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
          } else {
            //Nếu là CO_DINH

            setTongTienKhachNo(tongTienConLai * (voucher / 100));
            const tongTienCuaHangNo = (tongTienConLai / tongGiaGoc) * newVoucher;
            setTongTienCuaHangNo(tongTienCuaHangNo);
            // Cập nhật voucher mới
            setVoucherNew(newVoucher);
            // Tính tổng tiền trả khách
            setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
          }
        } else {
          //Trường hợp thoả mãn
          setTongTienKhachNo(0);
          setTongTienCuaHangNo(0);

          // Cập nhật voucher mới
          const Voucher = totalPriceReturn * (voucher / 100);
          // Tính tổng tiền trả khách
          setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
        }
      }
    } else if (billReturn.discountMethod === null) {
      // Truongwf hợp đơn cũ  không có voucher nào phù hợp thì kiểm trả đơn mới có ko nếu không thì cho vô
      const newVoucher = phieuGiamGia.discountValue; //Đây là voucher mới phù hợp

      const Voucher =
        billReturn.discountMethod === 'PHAN_TRAM' //Voucher cux
          ? totalPriceReturn * (voucher / 100) // Tính voucher theo phần trăm
          : (totalPriceReturn / tongGiaGoc) * voucher; // Tính voucher theo cố định

      if (phieuGiamGia.discountMethod != null) {
        // nếu có voucher mới
        if (phieuGiamGia.discountMethod === 'PHAN_TRAM') {
          setTongTienKhachNo(tongTienConLai * (voucher / 100));
          setTongTienCuaHangNo(tongTienConLai * (newVoucher / 100));
          // Cập nhật voucher mới
          setVoucherNew(newVoucher);
          // Tính tổng tiền trả khách
          setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
        } else {
          //Nếu là CO_DINH
          setTongTienKhachNo(tongTienConLai * (voucher / 100));
          const tongTienCuaHangNo = (tongTienConLai / tongGiaGoc) * newVoucher;
          setTongTienCuaHangNo(tongTienCuaHangNo);
          // Cập nhật voucher mới
          setVoucherNew(newVoucher);
          // Tính tổng tiền trả khách
          setTongTienTraKhach(totalPriceReturn - Voucher - tongTienKhachNo + tongTienCuaHangNo); // Cập nhật tổng tiền trả khách
        }
      } else {
        setTongTienKhachNo(0);
        setTongTienCuaHangNo(0);
        setTongTienTraKhach(totalPriceReturn - Voucher); // Cập nhật tổng tiền trả khách
      }
    }
  };

  // Theo dõi các thay đổi
  useEffect(() => {
    calculateTotals(); // Tính toán lại khi có sự thay đổi
  }, [billReturn, billDetailReturn, tongTienConLai, phieuGiamGia, voucherNew]);



  useEffect(() => {
    GetAllPhieuGiamGia(); // Gọi API nếu customerId tồn tại
  }, [tongTienConLai]); // Theo dõi customerId để gọi lại nếu giá trị thay đổi

  const GetAllPhieuGiamGia = () => {
    console.log('tongTienConLai dddddddd mmmmmmmmmmmmmm', tongTienConLai); // Log dữ liệu từ API
    axios
      .get(`http://localhost:8080/api/gio-hang/auto/select/voucher`, {
        params: {
          price: tongTienConLai, // Truyền idNhanVien nếu có, nếu không thì null
          idKH: billReturn.idCustomer,
        },
      })
      .then((response) => {
        setPhieuGiamGia(response.data); // Cập nhật state với dữ liệu từ API
        console.log('Fetched Vouchers dddddddddddddzzzzzzzzzz:', response.data); // Log dữ liệu từ API
      })
      .catch((error) => {
        console.error('Error fetching Phieu Giam Gia:', error.response?.data || error.message); // Log lỗi nếu có
      });
  };
  //Hàm xóa
  // Hàm xử lý việc xóa bản ghi khỏi billDetailReturn
  const handleDeleteRow = (rowId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Có',
      cancelText: 'Không',
      onOk: () => {
        setBillDetailReturn((prev) => prev.filter((row) => row.idBillDetail !== rowId));
        calculateTotals();
        setTongTienTraKhach(0);
      }
    });
  };

  console.log('BilldetailReutrn zzzzzzzzzzzzzzzzzzzzz', billDetailReturn);

  // Phân trang cho billDetail
  const [currentPageBillDetail, setCurrentPageBillDetail] = useState(1);
  const [pageSizeBillDetail, setPageSizeBillDetail] = useState(3);

  // Lấy các bản ghi hiện tại dựa vào trang
  const currentRecords = billDetail.slice((currentPageBillDetail - 1) * pageSizeBillDetail, currentPageBillDetail * pageSizeBillDetail);

  // Hàm xử lý khi thay đổi trang
  const handleChangePageBillDetail = (newPage) => {
    setCurrentPageBillDetail(newPage);
  };

  // Phân trang cho billDetailReturn
  const [currentPageBillDetailReturn, setCurrentPageBillDetailReturn] = useState(1);
  const [pageSizeBillDetailReturn, setPageSizeBillDetailReturn] = useState(3);

  // Lấy các bản ghi hiện tại dựa vào trang
  const currentRecordsReturn = billDetailReturn.slice(
    (currentPageBillDetailReturn - 1) * pageSizeBillDetailReturn,
    currentPageBillDetailReturn * pageSizeBillDetailReturn
  );

  // Hàm xử lý khi thay đổi trang
  const handleChangePageBillDetailReturn = (newPage) => {
    setCurrentPageBillDetailReturn(newPage);
  };

  //Detail của hóa đơn trả hàng
  useEffect(() => {
    if (id) {
      // Kiểm tra nếu maHD có giá trị
      getAllBillReturn();
    }
    if (billReturn.idBill) {
      // Kiểm tra nếu id có giá trị
      getAllBillReturn();
    }
  }, [id]); // Thêm maHD vào dependency array

  useEffect(() => {
    if (billReturn.idBill) {
      // Kiểm tra nếu id có giá trị
      getAllBillDetail();
    }
  }, [billReturn.idBill]);

  function getAllBillReturn() {
    axios
      .get(`http://localhost:8080/api/return-order/information`, {
        params: {
          codeBill: id // Ma hoa don
        }
      })
      .then((response) => {
        const data = response.data.data || []; // Giả sử response.data có cấu trúc { data: [...] }
        setBillReturn(data); // Đảm bảo dữ liệu trả về là mảng
        console.log('Dữ liệu hóa đơn dddddddddddddddddddddddddd:', data); // Log dữ liệu hóa đơn
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu hóa đơn:', error); // Thêm thông báo lỗi rõ ràng
      });
  }

  function getAllBillDetail() {
    axios
      .get(`http://localhost:8080/api/return-order`, {
        params: {
          idBill: billReturn.idBill // Ma hoa don
        }
      })
      .then((response) => {
        const data = response.data.data || []; // Giả sử response.data có cấu trúc { data: [...] }
        setBillDetail(data); // Đảm bảo dữ liệu trả về là mảng
        console.log('Dữ liệu hóa đơn detail dddddddddddd zzzzzzzzz:', data); // Log dữ liệu hóa đơn
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu hóa đơn:', error); // Thêm thông báo lỗi rõ ràng
      });
  }

  const handleQuantityChange = (id, value) => {
    // Kiểm tra nếu giá trị là số nguyên dương trước khi cập nhật
    const updatedQuantity = Math.max(1, Number(value));
    setBillDetailReturn((prevState) => prevState.map((row) => (row.idBillDetail === id ? { ...row, quantity: updatedQuantity } : row)));
  };

  const handleStatusChange = (id, value) => {
    // Kiểm tra và cập nhật trạng thái dựa trên 'value' từ Select
    const updatedBillDetails = billDetailReturn.map((item) =>
      item.idBillDetail === id ? {
        ...item,
        status: value
      } : item // Giữ nguyên bản ghi nếu không phải bản ghi được chọn
    );

    setBillDetailReturn(updatedBillDetails); // Lưu lại thay đổi

    setSelectedValues(prev => ({
      ...prev,
      [id]: value, // Cập nhật trạng thái cho bản ghi tương ứng
    }));

    // Nếu trạng thái là "CA_HAI", mở modal
    if (value === 'CA_HAI') {
      handleOpenModal(id); // Truyền id của bản ghi
    }
  };




  //Modal của  ca hai 
  const [isModal, setIsModal] = useState(false);
  const [currentIdBillDetail, setCurrentIdBillDetail] = useState(null); // Thêm state để lưu idBillDetail hiện tại

  const [selectedMaxQuantity, setSelectedMaxQuantity] = useState(1);

  // Hiển thị modal khi chọn "Cả hai"
  const handleOpenModal = (id) => {
    const originalRow = billDetailReturn.find((item) => item.idBillDetail === id);

    if (originalRow) {
      const { quantityLoi, quantityNham } = originalRow;

      setSelectedMaxQuantity(originalRow.quantity);
      setQuantityLoi(quantityLoi || 0);
      setQuantityNham(quantityNham || 0);
      setCurrentIdBillDetail(id); // Lưu idBillDetail vào state

      setIsModal(true);
    }
  };



  const showModal = (isCancel) => {
    setIsModal(true);
  };

  const handleCancel = () => {
    setIsModal(false);
  };

  const handleSubmit = (values) => {
    const quantityNham = values.quantityNham;
    const quantityLoi = values.quantityLoi;

    if (quantityNham <= 0 || quantityLoi <= 0) {
      toast.error('Số lượng nhầm và lỗi phải lớn hơn 0!');
      return;
    }

    const updatedBillDetails = billDetailReturn.map((item) =>
      item.idBillDetail === currentIdBillDetail ? {
        ...item,
        quantityLoi: item.status === 'CA_HAI' ? quantityLoi : 0,
        quantityNham: item.status === 'CA_HAI' ? parseInt(quantityNham, 10) : 0,
      } : item
    );

    setBillDetailReturn(updatedBillDetails);
    toast.success('Xác nhận thành công');

    setIsModal(false);
    form.resetFields();
  };






  const columns = [
    { id: 'stt', label: 'STT' },
    { id: 'image ', label: 'Ảnh' },
    { id: 'product', label: 'Thông tin sản phẩm' },
    { id: 'quantity', label: 'Số lượng' },
    { id: 'price', label: 'Đơn giá' },
    { id: 'toltalPrice', label: 'Thành tiền' },
    { id: 'statusBill', label: 'Trạng thái' },
    { id: 'active', label: 'Hành động' }
  ];

  const columns_Tra = [
    { id: 'stt', label: 'STT' },
    { id: 'image ', label: 'Ảnh' },
    { id: 'product', label: 'Thông tin sản phẩm' },
    { id: 'quantity', label: 'Số lượng' },
    { id: 'price', label: 'Đơn giá' },
    { id: 'toltalPrice', label: 'Thành tiền' },
    { id: 'status', label: 'Trạng thái' },
    { id: 'active', label: 'Hành động' }
  ];

  const totalTien = billDetailReturn.reduce((total, sp) => total + sp.quantity * sp.price, 0);

  const status = listStatus.find((status) => status.id === billReturn.statusBill);
  const backgroundColor = status ? status.color : '#fff';

  return (
    <Container>
      <Typography level={1} strong style={{ fontSize: '30px' }} className=" my-4 text-dark text-uppercase">
        Quản Lý Trả Hàng
      </Typography>

      <div className="mb-4 py-4" style={{ background: 'white', borderRadius: '10px' }}>
        <div>
          <Typography level={2} strong style={{ fontSize: '20px' }} className="custom-title text-dark text-uppercase mb-4 px-4">
            Thông tin khách hàng
          </Typography>
        </div>

        <ul className="list-unstyled fw-semibold mx-5">
          <Row gutter={12}>
            <Col xl={12}>
              <li className="mb-4">
                Tên khách hàng: <span className="float-end text-danger">{billReturn.nameCustomer}</span>
              </li>
              <li className="mb-4">
                Số điện thoại:{' '}
                <span className="float-end text-danger">{billReturn.phoneNumber == null ? 'Không có' : billReturn.phoneNumber}</span>
              </li>
              <li className="mb-4">
                Địa chỉ:{' '}
                <span className="float-end text-danger text-end" style={{ width: '24rem' }}>
                  {billReturn.address == null ? 'Không có' : billReturn.address}
                </span>
              </li>
              <li className="mb-4">
                Ghi chú:{' '}
                <span className="float-end text-danger text-end" style={{ width: '24rem' }}>
                  {billReturn.note === '' ? 'Không có' : billReturn.note}
                </span>
              </li>
            </Col>
            <Col xl={12}>
              <li className="mb-4">
                Ngày giao hàng:
                <span className="float-end text-danger">
                  {billReturn.deliveryDate === null ? 'Không có' : <FormatDate date={billReturn.deliveryDate} />}
                </span>
              </li>
              <li className="mb-4">
                Ngày nhận hàng:
                <span className="float-end text-danger">
                  {billReturn.receivedDate === null ? 'Không có' : <FormatDate date={billReturn.receivedDate} />}
                </span>
              </li>
              <li className="mb-4">
                Trạng thái:{' '}
                <span
                  style={{ width: '120px', backgroundColor, padding: '10px', borderRadius: '5px' }}
                  className=" text-center float-end text-danger"
                >
                  {listStatus.find((status) => status.id === billReturn.statusBill)?.name || 'Không có'}
                </span>
              </li>
              <li className="mb-4 ">
                {' '}
                Loại:{' '}
                <span
                  style={{
                    width: '120px',
                    backgroundColor: billReturn.typeBill === 'TRUC_TUYEN' ? '#7925C7' : '#FFBC05',
                    padding: '10px',
                    borderRadius: '5px'
                  }}
                  className="float-end text-center text-danger"
                >
                  {billReturn.typeBill === 'TRUC_TUYEN' ? 'Trực tuyến' : 'Tại quầy'}
                </span>
              </li>
            </Col>
          </Row>
        </ul>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '20px' }} className="px-2">
        <div className="d-flex align-items-center justify-content-between  my-3">
          <Typography level={2} strong style={{ fontSize: '20px' }} className="custom-title text-dark text-uppercase mb-3 px-4">
            Thông tin đơn hàng
          </Typography>
          <Button type="primary" className="mx-5" style={{ backgroundColor: '#1890ff', color: 'white' }} onClick={handleAllReturnBill}>
            <FaTrash style={{ marginRight: '5px' }} /> Trả hàng tất cả
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {billDetail.map((row, index) => (
              <TableRow key={row.idBill}>
                <TableCell>{row.stt}</TableCell>
                <TableCell className="d-flex align-items-center">
                  <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px', height: '150px' }}>
                    {
                      <div className="image-container">
                        <img src={row.image} alt="images" style={{ width: '100%', height: '100px', borderRadius: '10px' }} />
                      </div>
                    }
                  </Carousel>
                </TableCell>
                <TableCell> {row.nameProduct}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  {row.promotion !== 0 ? (
                    <>
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          display: 'inline-block',
                          verticalAlign: 'top' // Căn chỉnh lên trên
                        }}
                      >
                        <FormatCurrency value={row.price * (1 - row.promotion / 100)} />
                      </span>
                      <span
                        style={{
                          color: 'black',
                          textDecoration: 'line-through',
                          fontSize: '12px',
                          marginLeft: '5px', // Khoảng cách với giá mới
                          verticalAlign: 'top' // Căn chỉnh lên trên
                        }}
                      >
                        <FormatCurrency value={row.price} />
                      </span>
                    </>
                  ) : (
                    <FormatCurrency value={row.price} />
                  )}
                </TableCell>

                <TableCell>
                  {row.promotion !== 0 ? (
                    <>{<FormatCurrency value={row.price * (1 - row.promotion / 100) * row.quantity} />}</>
                  ) : (
                    <FormatCurrency value={row.price * row.quantity} />
                  )}
                </TableCell>

                <TableCell>
                  <div
                    style={{
                      backgroundColor: listStatus.find((status) => status.id === row.statusBillDetail)?.color,
                      padding: '10px',
                      borderRadius: '20px'
                    }}
                    className="text-center"
                  >
                    {listStatus.find((status) => status.id === row.statusBillDetail)?.name}{' '}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    onClick={row.promotion === 0 ? () => showModalReturnBill(row) : null} // Chỉ gọi hàm nếu không có khuyến mãi
                    className="mx-4 text-center py-1"
                    style={{
                      height: '30px',
                      backgroundColor: row.promotion === 0 ? '#90ee90' : '#d3d3d3', // Màu nền mờ nếu có khuyến mãi
                      borderRadius: '10px',
                      cursor: row.promotion === 0 ? 'pointer' : 'not-allowed', // Chỉnh con trỏ chuột
                      opacity: row.promotion === 0 ? 1 : 0.5 // Độ mờ
                    }}
                  >
                    <FaUndo />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination for billDetail */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }} className="mb-4">
          <Pagination
            className="custom-pagination"
            total={billDetail.length} // Tổng số bản ghi
            current={currentPageBillDetail} // Trang hiện tại
            pageSize={pageSizeBillDetail} // Kích thước trang
            onChange={handleChangePageBillDetail} // Hàm xử lý thay đổi trang
            showSizeChanger={false} // Không cho phép thay đổi số lượng bản ghi mỗi trang
          />
        </Grid>
      </TableContainer>
      {/* Modal cua nhap so luong tra hang */}
      <Modal
        title="Số lượng trả hàng"
        open={isModalReturnBill}
        onCancel={handleCancelReturnBill}
        footer={[
          <Button key="cancel" onClick={handleCancelReturnBill}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleReturnSubmit}>
            Trả hàng
          </Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Số lượng không được để trống!' }]}>
            <Input placeholder="Nhập số lượng" />
          </Form.Item>
        </Form>
      </Modal>

      <Box className="d-flex justify-content-between" style={{ width: '100%' }}>
        {/* Bảng sản phẩm trả */}
        <Card style={{ marginTop: '20px', flex: 2, marginRight: '10px' }}>
          {billDetailReturn.length > 0 && (
            <TableContainer component={Paper} style={{ marginTop: '20px' }} className="px-2">
              <Typography level={2} strong style={{ fontSize: '20px' }} className="my-4 custom-title text-dark text-uppercase mb-3 px-4">
                Danh sách sản phẩm trả
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns_Tra.map((column) => (
                      <TableCell key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billDetailReturn.map((row, index) => {
                    // Tìm row tương ứng trong billDetail để lấy số lượng tối đa
                    const originalRow = billDetail.find((item) => item.idBillDetail === row.idBillDetail);
                    const maxQuantity = originalRow ? originalRow.quantity : 1; // Giới hạn tối đa

                    return (
                      <TableRow key={row.id}>
                        <TableCell>{row.stt}</TableCell>
                        <TableCell>
                          <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: '100px', height: '130px' }}>
                            <div key={index} className="image-container">
                              <img src={row.image} alt="images" style={{ width: '100%', height: '100px', borderRadius: '10px' }} />
                            </div>
                          </Carousel>
                        </TableCell>
                        <TableCell>{row.nameProduct}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            max={maxQuantity} // Đặt max là số lượng từ billDetail
                            value={row.quantity}
                            onChange={(e) => handleQuantityChange(row.idBillDetail, e.target.value)}
                            style={{ width: '60px' }}
                          />
                        </TableCell>
                        <TableCell>{<FormatCurrency value={row.price} />}</TableCell>
                        <TableCell>
                          {row.promotion != 0 ? (
                            <>{<FormatCurrency value={row.price * (1 - row.discountPercentage / 100) * row.quantity} />}</>
                          ) : (
                            <FormatCurrency value={row.price * row.quantity} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={selectedValues[row.idBillDetail] || ''}
                            onChange={(value) => {
                              handleStatusChange(row.idBillDetail, value); // Cập nhật trạng thái cho bản ghi

                            }}
                            size="small" // Thiết lập kích thước nhỏ
                            style={{ width: '80px' }} // Điều chỉnh chiều rộng của combobox
                          >
                            <Select.Option value="LOI">Lỗi</Select.Option>
                            <Select.Option value="NHAM">Nhầm</Select.Option>
                            <Select.Option value="CA_HAI">Cả hai</Select.Option>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div
                            className="mx-4 text-center py-1"
                            style={{ color: 'white', height: '30px', backgroundColor: 'red', borderRadius: '10px', cursor: 'pointer' }}
                            onClick={() => handleDeleteRow(row.idBillDetail)} // Gọi hàm xóa bản ghi khi nhấn
                          >
                            <FaTrash />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                  {/* Modal của ca _hai   */}
                  <Modal
                    title={"Xác nhận số lượng"}
                    open={isModal}
                    onCancel={handleCancel}
                    footer={[
                      <Button form="form" key="cancel" onClick={handleCancel}>Hủy</Button>,
                      <Button form="form" key="submit" type="primary" htmlType="submit">
                        Xác nhận
                      </Button>
                    ]}
                  >
                    <Form
                      id="form"
                      onFinish={handleSubmit}
                      form={form}
                      layout="vertical"
                    >
                      <Form.Item
                        label="Số lượng nhầm"
                        name="quantityNham"

                        rules={[{ required: true, message: 'Số lượng nhầm không được để trống!' }]}
                      >
                        <Input
                          placeholder="Nhập số lượng nhầm"
                          type="number"
                          min={0}
                          max={selectedMaxQuantity} // Sử dụng maxQuantity từ state
                          onChange={(e) => {
                            const quantityNham = parseInt(e.target.value, 10) || 0;
                            const quantityLoi = selectedMaxQuantity - quantityNham;
                            form.setFieldsValue({ quantityLoi }); // Cập nhật số lượng lỗi
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Số lượng lỗi"
                        name="quantityLoi"
                        rules={[{ required: true, message: 'Số lượng lỗi không được để trống!' }]}
                      >
                        <Input
                          placeholder="Nhập số lượng lỗi"
                          type="number"
                          min={0}
                          max={selectedMaxQuantity} // Sử dụng maxQuantity từ state
                          disabled // Không cho phép người dùng sửa số lượng lỗi
                        />
                      </Form.Item>
                    </Form>
                  </Modal>

                </TableBody>
              </Table>
              {/* Pagination for billDetailReturn */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }} className="mb-4">
                <Pagination
                  className="custom-pagination"
                  total={billDetailReturn.length} // Tổng số bản ghi
                  current={currentPageBillDetailReturn} // Trang hiện tại
                  pageSize={pageSizeBillDetailReturn} // Kích thước trang
                  onChange={handleChangePageBillDetailReturn} // Hàm xử lý thay đổi trang
                  showSizeChanger={false} // Không cho phép thay đổi số lượng bản ghi mỗi trang
                />
              </Grid>
            </TableContainer>
          )}
        </Card>



        {/* Thông tin hoàn trả */}
        <Card style={{ marginTop: '20px', flex: 1, marginLeft: '10px' }}>
          <CardContent>
            <Box spacing={2} className="list-unstyled fw-semibold mx-2">
              <Typography variant="h3" className="mb-5 text-center" style={{ color: '#6A0DAD' }}>
                Thông tin thanh toán
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <li className="mb-4">
                    Tổng giá hàng gốc:{' '}
                    <span className="float-end text-danger">
                      {' '}
                      <FormatCurrency value={tongGiaGoc} />
                    </span>
                  </li>
                  <li className="mb-4">
                    Voucher đã sử dụng:
                    <span className="float-end text-danger">
                      {billReturn.discountMethod === 'PHAN_TRAM' ? `${voucher}%` : <FormatCurrency value={voucher} />}
                    </span>
                  </li>
                  <li className="mb-4">
                    Tiền ship:{' '}
                    <span className="float-end text-danger">
                      <FormatCurrency value={moneyShip} />
                    </span>
                  </li>
                  <li className="mb-4">
                    Tổng tiền sau khi giảm giá:{' '}
                    <span className="float-end text-danger">
                      <FormatCurrency value={tongTienSauGiam} />
                    </span>
                  </li>
                  <li className="mb-4">
                    Tổng tiền thanh toán:{' '}
                    <span className="float-end text-danger">
                      <FormatCurrency value={tongTienThanhToan} />
                    </span>
                  </li>
                  <li className="mb-4">
                    Tổng giá hàng trả:{' '}
                    <span className="float-end text-danger">
                      <FormatCurrency value={tongTienTraHang} />
                    </span>
                  </li>
                  {/* <li className="mb-4">Tổng tiền giảm của từng sản phẩm: <span className="float-end text-danger"><FormatCurrency value={voucherNew} /></span></li> */}
                </Grid>
              </Grid>
              <hr />
              <Grid container spacing={2} className="my-4">
                <Grid item xs={12}>
                  <li className="mb-4">
                    Voucher mới:
                    <span className="float-end text-danger">
                      {phieuGiamGia.discountMethod === null ? (
                        <FormatCurrency value={0} />
                      ) : phieuGiamGia.discountMethod === 'PHAN_TRAM' ? (
                        `${voucherNew}%`
                      ) : (
                        <FormatCurrency value={voucherNew} />
                      )}
                    </span>
                  </li>
                  <li className="mb-4 ">
                    Số tiền khách nợ{' '}
                    <span className="text-danger float-end">
                      <FormatCurrency value={tongTienKhachNo} />
                    </span>
                  </li>
                  <li className="mb-4 ">
                    Số tiền nợ khách{' '}
                    <span className="text-danger float-end">
                      <FormatCurrency value={tongTienCuaHangNo} />
                    </span>
                  </li>
                  <li className="mb-4">
                    Tổng tiền trả khách:{' '}
                    <span className="text-danger float-end">
                      <FormatCurrency value={tongTienTraKhach} />
                    </span>
                  </li>
                </Grid>
                <Grid item xs={12}>
                  <Form.Item name="note" label="Mô tả" rules={[{ required: true, message: 'Mô tả không được để trống!' }]}>
                    <TextArea placeholder="Nhập lí do..." rows={4} value={note} onChange={handleNoteChange} />
                  </Form.Item>
                </Grid>
                <Button
                  key="submit"
                  style={{ marginLeft: '18px', width: '500px', backgroundColor: '#6A0DAD', color: 'white' }}
                  onClick={handleAllBillDetailReturn} // Không cần truyền tham số vì đã sử dụng hook
                >
                  Trả hàng
                </Button>
                {/* Nội dung hóa đơn cần in */}

                {/* Sử dụng EmailTemplate và truyền các props */}
                <div id="emailTemplate" style={{ display: 'none' }}>
                  <EmailTemplate
                    billReturn={billReturn}
                    billDetailReturn={billDetailReturn}
                    tongTienTraKhach={tongTienTraKhach}
                    ref={componentRef}
                  />
                </div>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default TraHangDetail;
