// ///Của Duc

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Modal, Divider, Radio, Space, Button, Table, Tooltip, Form, Input, Carousel, message } from 'antd';
// import { IconPrinter, IconTrashX } from '@tabler/icons-react';
// import FormatDate from 'views/utilities/FormatDate';
// import Title from "antd/es/typography/Title";
// import FormatCurrency from 'views/utilities/FormatCurrency';
// import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
// import { toast } from 'react-toastify';
// import BillHistory from './billHistory';
// import PaymentMethod from './paymentMethod';
// import TextArea from 'antd/es/input/TextArea';
// import InfoBill from './changeCustomer';
// import * as request from 'views/utilities/httpRequest';
// import ProductModal from './modalProduct';
// // import Gi from '../order/modalProductOrder';
// import './bill.css';
// import { color, margin, style } from '@mui/system';
// import axios from "axios"
// import { IconPhotoStar, IconTrashFilled, IconX } from '@tabler/icons-react';
// import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
// import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle, MdCancel, MdOutlineReplayCircleFilled } from 'react-icons/md'; // Material Design icons
// import { GiConfirmed } from 'react-icons/gi'; // Game Icons
// import { useReactToPrint } from 'react-to-print';
// import { detailHoaDon } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { name } from 'ntc';

// const listStatus = [
//     { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON", color: "#007BFF", title: "Tạo hóa đơn", icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
//     { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN", color: "#FFC107", title: "Chờ xác nhận", icon: FaRegFileAlt }, // Vàng (cảnh báo)
//     { id: 2, name: "Xác nhận", status: "XAC_NHAN", color: "#17A2B8", title: "Xác nhận", icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
//     { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN", color: "#FD7E14", title: "Chờ vận chuyển", icon: MdPayment }, // Cam (tiến trình)
//     { id: 4, name: "Vận chuyển", status: "VAN_CHUYEN", color: "#28A745", title: "Vận chuyển", icon: FaTruck }, // Xanh lá (thành công)
//     { id: 5, name: "Đã thanh toán", status: "DA_THANH_TOAN", color: "#20C997", title: "Đã thanh toán", icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
//     { id: 6, name: "Thành công", status: "THANH_CONG", color: "#218838", title: "Thành công", icon: GiConfirmed }, // Xanh lá đậm (hoàn tất)
//     { id: 7, name: "Đã hủy", status: "DA_HUY", color: "#DC3545", title: "Đã hủy", icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
//     { id: 10, name: "Trả hàng", status: "TRA_HANG", color: "#138496", title: "Trả hàng", icon: MdOutlineChangeCircle }, // Xanh dương đậm (xử lý)
//     { id: 8, name: "Yêu cầu hủy", status: "YEU_CAU_HUY", color: "#FF4500", title: "Yêu cầu hủy", icon: MdCancel }, // Đỏ cam (yêu cầu)
//     { id: 9, name: "Thay đổi", status: "THAY_DOI", color: "#6A5ACD", title: "Thay đổi", icon: MdOutlineReplayCircleFilled } // Tím xanh (đặt lại)
// ];

// const BillDetail = () => {
//     const [bill, setBill] = useState([]);
//     const [billHistory, setBillHistory] = useState([]);
//     const [listBillDetail, setListBillDetail] = useState([]);
//     const [billDetail, setBillDetail] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const [pageSize, setPageSize] = useState(3);
//     const { id } = useParams();
//     const [form] = Form.useForm();
//     const [formGiveback] = Form.useForm();
//     const [tongTienHoanTraKhiHuy, setTongTienHoanTraKhiHuy] = useState(0);
//     const [cancelBill, setCancelBill] = useState(false);

//     const [sanPhamMoi, setSanPhamMoi] = useState([]);

//     const token = localStorage.getItem('token');
//     // Lấy dữ liệu từ localStorage
//     const idNhanVien = localStorage.getItem('employeeId');

//     console.log("Employee id dddddddddddddddddddddddddddd:", idNhanVien);

//     const loadBill = async () => {
//         await request
//             .get(`/bill/${id}`)
//             .then((response) => {
//                 setBill(response);
//                 setTongTienHoanTraKhiHuy(response.totalMoney + response.shippingFee - response.discountAmount)
//                 console.log("Bill ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq", response)
//                 console.log("Bill ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq", id)
//             })
//             .catch((error) => {
//                 console.error(error);
//             });
//     };

//     const loadBillDetail = async () => {
//         await request
//             .get(`/bill-detail`, {
//                 params: {
//                     idBill: id,
//                     page: currentPage,
//                     sizePage: pageSize,
//                 },
//             })
//             .then((response) => {
//                 setListBillDetail(response.data);
//                 console.log("Bill detail  ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq", response.data)
//                 setTotalPages(response.totalPages);
//             })
//             .catch((e) => {
//                 console.log(e);
//             });
//     };

//     const loadBillHistory = () => {
//         request
//             .get(`/bill-history/${id}`)
//             .then((response) => {
//                 setBillHistory(response);
//                 console.log("Bill History:", response.data);
//             })
//             .catch((error) => {
//                 console.error(error);
//             });
//     };

//     // Hàm load danh sách hóa đơn chi tiết
//     //   const loadBillHistory = () => {
//     //     request
//     //       .get(`/bill-history/${id}`)
//     //       .then((response) => {
//     //         setBillHistory(response);
//     //       })
//     //       .catch((error) => {
//     //         console.error(error);
//     //       });
//     //   };

//     useEffect(() => {
//         loadBill();
//         loadBillDetail();
//         loadBillHistory();
//     }, [id]);

//     useEffect(() => {
//         loadBillDetail();
//     }, [currentPage, pageSize]);

//     const [billPayment, setBillPayment] = useState([]);

//     const loadBillHistory1 = () => {
//         axios.get(`http://localhost:8080/api/payment/${bill.id}`)
//             .then((response) => {
//                 console.log("Data received from API1:", response);
//                 console.log("Data received from API2dddddddddddddddd:", response.data);
//                 console.log("Data received from API3:", response.data.data);
//                 console.log("Data received from API4:", response.data.totalMoney);
//                 console.log("Data received from API4:", response.data.totalMoney);
//                 console.log("ID passed to API call:", bill.id);
//                 setBillPayment(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error fetching data:", error);
//             });
//     };
//     const paymentsToUpdate = billPayment.filter(
//         (payment) => payment.status === 'TRA_SAU'
//     );
//     const paymentsToUpdate1 = billPayment.filter(
//         (payment) => payment.status === 'HOAN_TIEN'
//     );

//     console.log(`Cập nhật thành công cho ID ddddddddddddddddddddwwwwwwwwwwwwwww:`, paymentsToUpdate);

//     const updateRefundBill = (transactionCode) => {
//         // Lọc ra các payment có trạng thái HOAN_TIEN hoặc TRA_SAU
//         const paymentsToUpdate = billPayment.filter(
//             (payment) => payment.status === 'HOAN_TIEN' || payment.status === 'TRA_SAU'

//         );

//         console.log(`Cập nhật thành công cho ID ddddddddddddddddddddwwwwwwwwwwwwwww:`, idNhanVien);

//         // Duyệt qua từng payment và gọi API cập nhật
//         paymentsToUpdate.forEach((payment) => {
//             const requestData = {
//                 employee: idNhanVien, // ID nhân viên từ localStorage
//                 transactionNo: transactionCode || "", // Mã giao dịch
//             };

//             console.log("Dữ liệu gửi đi:", requestData);

//             axios.put(`http://localhost:8080/api/payment/${payment.id}`, requestData)
//                 .then((response) => {
//                     loadBillHistory1();
//                     console.log(`Cập nhật thành công cho ID ${payment.id}:`, response.data);
//                 })
//                 .catch((error) => {
//                     console.error(`Lỗi khi cập nhật ID ${payment.id}:`, error);
//                 });
//         });

//         if (paymentsToUpdate.length === 0) {
//             console.warn("Không tìm thấy payment nào có trạng thái HOAN_TIEN hoặc TRA_SAU.");
//         }
//     };

//     const totalBillAmount = billPayment
//     .filter((payment) => payment.status === 'THANH_TOAN')
//     .reduce((sum, payment) => sum + payment.totalMoney, 0);

//     useEffect(() => {
//         loadBillHistory1();

//     }, []);

//     console.log('PDF đã được in xong', totalBillAmount);

//     const createPayment = (product) => {
//         const newPayment = {
//             bill: id,
//             employee: idNhanVien,
//             method: 'CHUYEN_KHOAN',
//             totalMoney: product.quantity * (product.discountPrice || product.price),
//             status: "HOAN_TRA",
//             transactionNo: null,

//         };
//         request
//             .post(`/payment`, newPayment
//             )
//             .then((response) => {
//             })
//             .catch((e) => {
//                 console.log(e);
//                 message.error(e.response.data);
//             });
//     };

//     const createPayment1 = (product) => {
//         const newPayment = {
//             bill: id,
//             employee: idNhanVien,
//             method: 'CHUYEN_KHOAN',
//             totalMoney: product.quantity * (product.discountPrice || product.price),
//             status: "TRA_SAU",
//             transactionNo: null,

//         };
//         request
//             .post(`/payment`, newPayment
//             )
//             .then((response) => {
//             })
//             .catch((e) => {
//                 console.log(e);
//                 message.error(e.response.data);
//             });
//     };

//     // const handleDeleteBillDetail = (id) => {
//     //     Modal.confirm({
//     //         title: "Xác nhận",
//     //         maskClosable: true,
//     //         content: "Xác nhận xóa khỏi giỏ hàng ?",
//     //         okText: "Xác nhận",
//     //         cancelText: "Hủy",
//     //         onOk: () => {
//     //             request
//     //                 .remove(`/bill-detail/${id.id}`)
//     //                 .then((response) => {
//     //                     message.success("Xóa thành công!");
//     //                     loadBillDetail();
//     //                     loadBill();
//     //                     loadBillHistory();
//     //                     createPayment(id);
//     //                 })
//     //                 .catch((e) => {
//     //                     console.log(e);
//     //                     message.error("Bug nè huhu : " + e.response.data);
//     //                 });
//     //         },
//     //     });
//     // };

//     //Hàm xóa
//     const handleDeleteBillDetail = (id) => {
//         console.log("idNhanVienmnnnnnnnnnnnnnnnnnnnnnnnnn", idNhanVien)

//         Modal.confirm({
//             title: "Xác nhận",
//             maskClosable: true,
//             content: "Xác nhận xóa khỏi đơn hàng?",
//             okText: "Xác nhận",
//             cancelText: "Hủy",
//             onOk: () => {
//                 request
//                     .remove(`/bill-detail/delete/${id}?idNhanVien=${idNhanVien}`)
//                     .then((response) => {
//                         message.success("Xóa thành công!");
//                         // Load lại dữ liệu liên quan
//                         loadBillDetail();
//                         loadBill();
//                         loadBillHistory();
//                         createPayment(id); // Nếu cần xử lý thanh toán
//                     })
//                     .catch((e) => {
//                         console.error(e);
//                         const errorMsg = e.response?.data?.message || "Xóa thất bại, vui lòng thử lại!";
//                         message.error(`Lỗi: ${errorMsg}`);
//                     });
//             },
//         });
//     };

//     const handleChangeQuantity = (record, quantity) => {
//         console.log("Số lượng hhhhhhhhhhhhhhhhhhhhhh", quantity);

//         request
//             .put(
//                 `/bill-detail/update-quantity-bill-detail/${record.id}?newQuantity=${quantity}&idNhanVien=${idNhanVien}`
//             )
//             .then((response) => {
//                 loadBillDetail();
//                 loadBill();
//                 loadBillHistory();
//                 message.success("Cập nhật thành công!");
//             })
//             .catch((e) => {
//                 // message.error(e.response?.data?.message || "Lỗi không xác định");
//                 console.log(e);
//             });
//     };

//     // const handleChangeQuantity = (record, quantity) => {
//     //     request
//     //         .get(`/bill-detail/update-quantity/${record.id}`, {
//     //             params: {
//     //                 newQuantity: quantity,
//     //                 donGia:
//     //                     record.status !== 'TAO_HOA_DON' || record.status !== 'CHO_XAC_NHAN' || record.status !== 'XAC_NHAN' || record.status !== 'CHO_VAN_CHUYEN'
//     //                         ? record.price
//     //                         : record.discountValue === null
//     //                             ? record.shoePrice
//     //                             : record.discountValue,
//     //             },
//     //         })
//     //         .then((response) => {
//     //             loadBillDetail();
//     //             loadBill();
//     //             loadBillHistory();
//     //             message.success("Cập nhật thành công!");
//     //             if (newQuantity < record.quantity) createPayment(record);
//     //             if (newQuantity > record.quantity) createPayment1(record);
//     //         })
//     //         .catch((e) => {
//     //             message.error(e.response.data.message);
//     //             console.log(e);
//     //         });
//     // };

//     const handleGiveBack = (id) => {
//         Modal.confirm({
//             title: "Xác nhận",
//             maskClosable: true,
//             content: (
//                 <>
//                     <Form
//                         layout="vertical"
//                         form={formGiveback}
//                         onFinish={async (data) => {
//                             data.billDetail = id;
//                             await request
//                                 .post(`/bill/give-back`, data)
//                                 .then((response) => {
//                                     loadBillDetail();
//                                     loadBill();
//                                     loadBillHistory();
//                                     message.success("Trả hàng thành công!");
//                                 })
//                                 .catch((e) => {
//                                     console.log(e);
//                                     message.error(e.response.data);
//                                 });
//                         }}
//                     >
//                         <Form.Item
//                             label="Số lượng"
//                             name={"quantity"}
//                             rules={[
//                                 { required: true, message: "Số lượng không được để trống!" },
//                             ]}
//                         >
//                             <InputNumber
//                                 placeholder="Nhập số lượng muốn trả hàng..."
//                                 className="w-100"
//                             />
//                         </Form.Item>
//                         <Form.Item
//                             label="Lý do trả hàng"
//                             name={"note"}
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: "Lý do trả hàng không được để trống!",
//                                 },
//                             ]}
//                         >
//                             <TextArea placeholder="Nhập lý do trả hàng..." />
//                         </Form.Item>
//                     </Form>
//                 </>
//             ),
//             okText: "Xác nhận",
//             cancelText: "Hủy",
//             onOk: async () => {
//                 formGiveback.submit();
//             },
//         });
//     };

//     //Modal của Xác nhận đơn hàng
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const showModal = (isCancel) => {
//         setCancelBill(isCancel);
//         loadBillHistory1();
//         setIsModalOpen(true);
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//         setCancelBill(false);
//     };

//     //Modal của quay lại trạng thái
//     const [isModalQuayLai, setIsModalQuayLai] = useState(false);

//     const showModalQuayLai = (isCancel) => {
//         setCancelBill(isCancel);
//         setIsModalQuayLai(true);
//     };

//     const handleCancelQuayLai = () => {
//         setIsModalQuayLai(false);
//         setCancelBill(false);
//     };
//     //Modal của huỷ hóa đơn
//     const [isModalCancelBill, setIsModalCanCelBill] = useState(false);

//     const showModalCancelBill = (isCancel) => {
//         setCancelBill(isCancel);
//         setIsModalCanCelBill(true);
//     };

//     const handleCancelBill = () => {
//         setIsModalCanCelBill(false);
//         setCancelBill(false);
//     };

//     const handleSubmitXacNhan = (data) => {

//         let updatedStatus;
//         if (bill.invoiceStatus === 'CHO_XAC_NHAN') {
//             updatedStatus = 'XAC_NHAN';
//         } else if (bill.invoiceStatus === 'XAC_NHAN') {
//             updatedStatus = 'CHO_VAN_CHUYEN';
//         } else if (bill.invoiceStatus === 'CHO_VAN_CHUYEN') {
//             updatedStatus = 'VAN_CHUYEN';
//         } else if (bill.invoiceStatus === 'VAN_CHUYEN') {
//             updatedStatus = 'DA_THANH_TOAN';
//         } else if (bill.invoiceStatus === 'DA_THANH_TOAN') {
//             updatedStatus = 'THANH_CONG';
//         } else if (bill.invoiceStatus === 'TAO_HOA_DON') {
//             updatedStatus = 'CHO_XAC_NHAN';
//         } else if (bill.invoiceStatus === 'TAO_HOA_DON') {
//             updatedStatus = 'CHO_XAC_NHAN';
//         }

//         const requestData = {
//             idHD: id,  // ID hóa đơn phải có giá trị hợp lệ
//             status: updatedStatus,
//             note: data.note,
//         };

//         console.log("idNhanVien  124:", idNhanVien);
//         // updateRefundBill(data.transactionNo);

//         handleSubmitQuantity();

//         // Gửi request PUT tới server
//         axios.put(`http://localhost:8080/api/bill/change-status`, requestData, {
//             params: {
//                 idNhanVien: idNhanVien, // Truyền idNhanVien nếu có, nếu không thì null
//             },
//         })
//             .then((response) => {
//                 loadBill(); // Tải lại danh sách hóa đơn
//                 loadBillDetail(); // Tải lại chi tiết hóa đơn
//                 loadBillHistory(); // Tải lại lịch sử hóa đơn
//                 form.resetFields(); // Reset lại form sau khi gửi
//                 message.success("Thay đổi trạng thái đơn hàng thành công!");
//                 // if (billPayment?.status === 'HOAN_TIEN' || billPayment?.status === 'TRA_SAU') {
//                 // }
//             })
//             .catch((e) => {
//                 console.error("Lỗi khi thay đổi trạng thái:", e);
//                 message.error("Không thể thay đổi trạng thái. Chi tiết lỗi: " + (e.response?.data?.message || e.message)); // Hiển thị lỗi chi tiết
//             });

//         setIsModalOpen(false); // Đóng modal sau khi gửi
//     };

//     const handleSubmitQuayLai = (data) => {
//         const requestData = {
//             actionDescription: data.note, // Note từ form
//         };
//         // Gửi request PUT tới server
//         request.put(`/bill/roll-back-bill/${id}`, requestData, {
//             // params: {
//             //     idNV: idNhanVien,
//             // },
//         })
//             .then((response) => {
//                 loadBill(); // Tải lại danh sách hóa đơn
//                 loadBillDetail(); // Tải lại chi tiết hóa đơn
//                 loadBillHistory(); // Tải lại lịch sử hóa đơn
//                 form.resetFields(); // Reset lại form sau khi gửi
//                 message.success("Thay đổi trạng thái đơn hàng thành công!"); // Thông báo thành công
//             })
//             .catch((e) => {
//                 console.error("Lỗi khi thay đổi trạng thái:", e);
//                 message.error("Không thể thay đổi trạng thái. Chi tiết lỗi: " + e.response?.data?.message || e.message); // Hiển thị lỗi chi tiết
//             });

//         setIsModalQuayLai(false); // Đóng modal sau khi gửi
//     };

//     const handleSubmitQuantity = () => {

//         console.log('Hoa Don Detailp XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', listBillDetail);
//         console.log(idNhanVien);

//     };

//     const handleCancelBillStatus = (data) => {

//         const requestData = {
//             description: data.note,
//             transactionNo: data.maGiaoDich,
//             totalMoney: parseInt(tongTienHoanTraKhiHuy),
//         };

//         // Gửi request PUT tới server
//         axios.put(`http://localhost:8080/api/bill/cancel-status/${id}`, requestData, {
//             params: {
//                 idNhanVien: idNhanVien, // ID nhân viên hiện tại
//             },
//         })
//             .then((response) => {
//                 loadBill(); // Tải lại danh sách hóa đơn
//                 loadBillDetail(); // Tải lại chi tiết hóa đơn
//                 loadBillHistory(); // Tải lại lịch sử hóa đơn
//                 form.resetFields(); // Reset lại form sau khi gửi
//                 toast.success("Hủy đơn hàng thành công!"); // Thông báo thành công

//             })
//             .catch((e) => {
//                 console.error("Chỉ có admin mới có thể hủy hóa đơn:", e);
//                 toast.error("Chỉ có admin mới có thể hủy hóa đơn: "); // Hiển thị lỗi chi tiết\
//                 //Cái này giúp lấy ra lỗi của be lên
//                 // const errorMessage = e.response?.data?.message || 'Chỉ có admin mới có thể hủy hóa đơn';
//                 // toast.error(errorMessage);
//             });
//         setIsModalCanCelBill(false);
//     };
//     console.log("Nameeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee :" , name);

//     const columns = [
//         {
//             title: '#',
//             dataIndex: 'index',
//             key: 'index'
//         },
//         {
//             title: <IconPhotoStar />,
//             dataIndex: 'image',
//             key: 'image',
//             render: (item, record) => (
//                 <>
//                     <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} style={{ width: '150px' }}>
//                         {item !== undefined &&
//                             item.split(',').map((images, index) => (
//                                 <div className="position-relative" style={{ height: '150px' }}>
//                                     <img src={images} alt="image" style={{ width: '150px', height: '150px' }} className="object-fit-contain" />
//                                 </div>
//                             ))}
//                     </Carousel>
//                 </>
//             )
//         },
//         {
//             title: 'Sản phẩm',
//             dataIndex: 'name',
//             key: 'name',
//             render: (name, record) => (
//                 <div className="d-flex flex-column justify-content-between">
//                     <div className="fw-semibold">{record.name}</div>
//                     <div>
//                         <small>Mã SP: {record.detailCode}</small>
//                     </div>
//                     <div>
//                         <span className="text-secondary"> </span>
//                         {record.discountPrecentage !== null && record.discountPrecentage !== 0 ? (
//                             <>
//                                 Đơn giá :
//                                 <span className="text-decoration-line-through text-muted ms-2">
//                                     <FormatCurrency value={record.price} />
//                                 </span>
//                                 <br />
//                                 Giảm giá :
//                                 <span className="ms-2 text-danger fw-bold">
//                                     <FormatCurrency value={record.discountPrice} />
//                                 </span>
//                             </>
//                         ) : (
//                             <span className="text-danger fw-bold">
//                                 Đơn giá <FormatCurrency value={record.price} />
//                             </span>
//                         )}
//                     </div>
//                 </div>
//             )
//         },
//         {
//             title: 'Số lượng',
//             dataIndex: 'quantity',
//             key: 'quantity',
//             render: (quantity, record) => (
//                 <Form
//                     key={record.id}
//                     initialValues={{ quantity }} // Thiết lập giá trị ban đầu
//                     onFinish={(values) => handleChangeQuantity(record, values.quantity)} // Xử lý khi submit
//                 >
//                     <Form.Item
//                         name="quantity"
//                         className="m-0 p-0"
//                         rules={[
//                             {
//                                 required: true,
//                                 message: 'Vui lòng nhập số lượng!',
//                             },
//                             {
//                                 type: 'number',
//                                 min: 1,
//                                 message: 'Số lượng phải lớn hơn hoặc bằng 1!',
//                             },
//                         ]}
//                         normalize={(value) => Number(value) || 0} // Đảm bảo giá trị là số
//                     >
//                         <Input
//                             className="text-center"
//                             type="number"
//                             style={{ width: '64px' }}
//                             disabled={bill.invoiceStatus === 'DA_THANH_TOAN' || bill.invoiceStatus === 'THANH_CONG' || bill.invoiceStatus === 'VAN_CHUYEN' || bill.invoiceStatus === 'CHO_VAN_CHUYEN' || bill.invoiceStatus === 'XAC_NHAN'}
//                             onChange={(e) => handleChangeQuantity(record, Number(e.target.value))} // Chuyển đổi thành số và cập nhật khi thay đổi
//                         />
//                     </Form.Item>
//                 </Form>
//             ),
//         }
//         ,
//         {
//             title: 'Tổng tiền',
//             dataIndex: 'quantity',
//             key: 'total',
//             render: (quantity, record) => (
//                 <div className="text-danger fw-bold">
//                     <FormatCurrency value={(record.discountPrice || record.price) * quantity} />
//                 </div>
//             )
//         },
//         {
//             title: "Hành động",
//             dataIndex: "id",
//             key: "action",
//             render: (id, record) => (
//                 <>
//                     {bill.invoiceStatus === 'TAO_HOA_DON' ||
//                         bill.invoiceStatus === 'CHO_XAC_NHAN' ||
//                         bill.invoiceStatus === 'XAC_NHAN' ||
//                         bill.invoiceStatus === 'CHO_VAN_CHUYEN' ? (
//                         <Space size="middle">
//                             <Button onClick={() => handleDeleteBillDetail(record.id)} type="danger">
//                                 <IconTrashX />
//                             </Button>
//                         </Space>
//                     ) : (
//                         ""
//                         // <IconTrashX />
//                     )}
//                 </>
//             )
//         },
//     ];

//     const pdfRef = useRef(null);

//     // Cấu hình in với useReactToPrint
//     const generatePDF = useReactToPrint({
//         content: () => pdfRef.current,
//         documentTitle: 'Invoice',
//         onAfterPrint: () => {
//             console.log('PDF đã được in xong');
//         },
//     });

//     // Hàm gọi API để lấy nội dung HTML và in
//     const getHtmlByIdBill2 = async (id, totalExcessMoney) => {
//         try {
//             console.log('ninh', totalExcessMoney);
//             const response = await axios.get(`http://localhost:8080/api/bill/invoice-pdf/${id}/${totalExcessMoney}`);
//             if (pdfRef.current) {
//                 // Cập nhật nội dung HTML vào pdfRef
//                 pdfRef.current.innerHTML = response.data.data;
//                 setTimeout(() => {
//                     generatePDF(); // Gọi hàm in sau khi cập nhật nội dung
//                 }, 0);
//             }
//         } catch (error) {
//             console.error('Error fetching invoice data:', error);
//         }
//     };

//     const traSauTotal = billPayment
//         .filter((payment) => payment.status === 'TRA_SAU')
//         .reduce((sum, payment) => sum + payment.totalMoney, 0);

//     const hoanTienTotal = billPayment
//         .slice(1) // Loại bỏ khoản đầu tiên khỏi danh sách
//         .filter((payment) => payment.status === 'HOAN_TIEN')
//         .reduce((sum, payment) => sum + payment.totalMoney, 0);

//     const isHoanTra = Array.isArray(billPayment)
//         ? billPayment.some(payment => payment.status === 'HOAN_TIEN')
//         : billPayment?.status === 'HOAN_TIEN';

//     const isTraSau = Array.isArray(billPayment)
//         ? billPayment.some(payment => payment.status === 'TRA_SAU')
//         : billPayment?.status === 'TRA_SAU';

//     const chenhLechSoSanh = traSauTotal - hoanTienTotal;

//     const chenhLech = traSauTotal - hoanTienTotal > 0 ? traSauTotal - hoanTienTotal : hoanTienTotal - traSauTotal;

//     const [tienTraSau, setTienTraSau] = useState(0);

//     const getNoteByStatus = () => {
//         if (isHoanTra) {
//             return chenhLechSoSanh > 0
//                 ? `Khách phải trả thêm : ${FormatCurrency({ value: chenhLech })}`
//                 : `Hoàn tiền cho khách: ${FormatCurrency({ value: hoanTienTotal - traSauTotal })}`;
//         }

//         switch (bill.invoiceStatus) {
//             case 'CHO_XAC_NHAN': return 'Đã xác nhận đơn đặt hàng';
//             case 'XAC_NHAN': return 'Đã xác nhận, đơn đang chờ vận chuyển';
//             case 'CHO_VAN_CHUYEN': return 'Đã xác nhận vận chuyển';
//             case 'VAN_CHUYEN': return 'Đã xác nhận thông tin thanh toán';
//             case 'DA_THANH_TOAN': return 'Đơn hàng đã được giao thành công';
//             default: return '';
//         }
//     };

//     // Hàm riêng để lấy ghi chú cho hành động "Quay lại" hoặc "Hủy hóa đơn"
//     const getNoteForAction = (action) => {
//         if (action === 'QUAY_LAI') {
//             switch (bill.invoiceStatus) {
//                 case 'CHO_XAC_NHAN': return 'Yêu cầu quay lại trạng thái: Chờ xác nhận';
//                 case 'XAC_NHAN': return 'Yêu cầu quay lại trạng thái: Đã xác nhận';
//                 case 'CHO_VAN_CHUYEN': return 'Yêu cầu quay lại trạng thái: Chờ vận chuyển';
//                 case 'VAN_CHUYEN': return 'Yêu cầu quay lại trạng thái: Đang vận chuyển';
//                 case 'DA_THANH_TOAN': return 'Yêu cầu quay lại trạng thái: Đã thanh toán';
//                 default: return 'Yêu cầu quay lại trạng thái trước đó';
//             }
//         } else if (action === 'HUY_HOA_DON') {
//             return 'Đơn hàng đã được yêu cầu hủy. Vui lòng xem lại thông tin.';
//         }
//         return '';
//     };

//     // Cập nhật giá trị ghi chú khi trạng thái thay đổi
//     useEffect(() => {
//         form.setFieldsValue({ note: getNoteByStatus() });
//     }, [billPayment?.status, bill.invoiceStatus, chenhLech, chenhLechSoSanh]);

//     return (
//         <>
//             <nav className="breadcrumb fw-semibold">
//                 <Link
//                     className="breadcrumb-item bee-text text-decoration-none"
//                     to={"/admin/bill"}
//                 >
//                     Danh sách hóa đơn
//                 </Link>
//                 <span className="breadcrumb-item">Hóa đơn {bill.code}</span>
//             </nav>

//             <div className="container overflow-x-auto mb-3">
//                 <Timeline
//                     minEvents={8}
//                     placeholder
//                     maxEvents={billHistory.length}
//                     style={{ height: "400px" }}
//                 >
//                     {billHistory.map((item, index) => (
//                         <TimelineEvent
//                             key={index}

//                             icon={
//                                 // Gọi icon dưới dạng component
//                                 listStatus.find(status => status.status === item.status)?.icon
//                             }

//                             color={
//                                 // Lấy color từ listStatus
//                                 listStatus.find(status => status.status === item.status)?.color
//                             }
//                             title={
//                                 // Lấy title từ listStatus
//                                 <h6 className="mt-2">
//                                     {listStatus.find(status => status.status === item.status)?.title}
//                                 </h6>
//                             }
//                             subtitle={
//                                 <>
//                                     {item.actionDescription}
//                                     <br />
//                                     <FormatDate date={item.createdAt} />
//                                 </>
//                             }
//                         />
//                     ))}
//                 </Timeline>
//             </div>

//             <div className="d-flex justify-content-between align-items-center">
//                 {/* Bu tuuon Xác nhận và hủy*/}
//                 <div className=" mx-3 d-flex" >
//                     {bill.invoiceStatus !== 'THANH_CONG' || bill.invoiceStatus !== 'TRA_HANG' ? (
//                         <>
//                             {(bill.invoiceStatus === 'TAO_HOA_DON' || bill.invoiceStatus === 'CHO_XAC_NHAN'
//                                 || bill.invoiceStatus === 'XAC_NHAN' || bill.invoiceStatus === 'CHO_VAN_CHUYEN' || bill.invoiceStatus === 'VAN_CHUYEN'
//                                 || bill.invoiceStatus === 'DA_THANH_TOAN') && (
//                                     <div>
//                                         <Button
//                                             type="primary"
//                                             className="me-1"
//                                             onClick={() => showModal(true)}
//                                         >
//                                             {bill.invoiceStatus === 'TAO_HOA_DON' && "Chờ xác nhận"}
//                                             {bill.invoiceStatus === 'CHO_XAC_NHAN' && "Xác nhận"}
//                                             {bill.invoiceStatus === 'XAC_NHAN' && "Chờ vận chuyển"}
//                                             {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && "Vận chuyển"}

//                                             {bill.invoiceStatus === 'VAN_CHUYEN' && "Đã thanh toán"}
//                                             {bill.invoiceStatus === 'DA_THANH_TOAN' && "Thành công"}
//                                         </Button>
//                                     </div>
//                                 )}

//                             {(bill.invoiceStatus === 'TAO_HOA_DON' || bill.invoiceStatus === 'CHO_XAC_NHAN'
//                                 || bill.invoiceStatus === 'XAC_NHAN' || bill.invoiceStatus === 'CHO_VAN_CHUYEN'
//                                 || bill.invoiceStatus === 'YEU_CAU_HUY') && (
//                                     <div>
//                                         <Button
//                                             style={{ backgroundColor: 'red' }}
//                                             className="me-1"
//                                             onClick={() => showModalCancelBill(true)}
//                                         >
//                                             Hủy
//                                         </Button>
//                                     </div>
//                                 )}

//                         </>
//                     ) : (
//                         ""
//                     )}
//                     {/* {(bill.invoiceStatus !== 'TAO_HOA_DON' && bill.invoiceStatus !== 'CHO_XAC_NHAN' && bill.invoiceStatus !== 'DA_THANH_TOAN' && bill.invoiceStatus !== 'THANH_CONG' && bill.invoiceStatus !== 'DA_HUY' && bill.invoiceStatus !== 'TRA_HANG') && (
//                         <div>
//                             <Button
//                                 style={{ backgroundColor: 'Yellow' }}
//                                 className="me-1"
//                                 onClick={() => showModalQuayLai(true)}
//                             >
//                                 Quay lại
//                             </Button>
//                         </div>
//                     )} */}
//                 </div>
//                 {/* Modal của xác nhận đơn hàng  */}
//                 <Modal
//                     title={
//                         bill.invoiceStatus === 'TAO_HOA_DON' ? "Chờ xác nhận" :
//                             bill.invoiceStatus === 'CHO_XAC_NHAN' && isHoanTra && chenhLechSoSanh < 0 ? "Số tiền cần phải hoàn trả khách: " + chenhLech :
//                                 bill.invoiceStatus === 'CHO_XAC_NHAN' ? "Xác nhận đơn hàng" :
//                                     bill.invoiceStatus === 'XAC_NHAN' ? "Chờ vận chuyển đơn hàng" :
//                                         bill.invoiceStatus === 'CHO_VAN_CHUYEN' ? "Vận chuyển đơn hàng" :
//                                             bill.invoiceStatus === 'VAN_CHUYEN' && isTraSau && chenhLechSoSanh > 0 ? "Số tiền khách đã trả: " + chenhLech :
//                                                 bill.invoiceStatus === 'VAN_CHUYEN' ? "Thanh toán đơn hàng" :
//                                                     bill.invoiceStatus === 'DA_THANH_TOAN' ? "Thành công" :
//                                                         "Xác nhận"
//                     }
//                     open={isModalOpen}
//                     onCancel={handleCancel}
//                     footer={
//                         <>
//                             {bill.paymentStatus === 'DA_THANH_TOAN' ? (
//                                 chenhLechSoSanh < 0 ? (
//                                     <Button form="formNote" type="primary" htmlType="submit">
//                                         {bill.invoiceStatus === 'CHO_XAC_NHAN' && "Hoàn trả"}
//                                         {bill.invoiceStatus === 'XAC_NHAN' && "Chờ vận chuyển"}
//                                         {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && "Vận chuyển"}
//                                         {bill.invoiceStatus === 'DA_THANH_TOAN' && "Thành công"}
//                                         {bill.invoiceStatus === 'VAN_CHUYEN' && "Xác nhận đã thanh toán"}
//                                     </Button>
//                                 ) : (
//                                     <Button form="formNote" type="primary" htmlType="submit">
//                                         {bill.invoiceStatus === 'CHO_XAC_NHAN' && "Xác nhận"}
//                                         {bill.invoiceStatus === 'XAC_NHAN' && "Chờ vận chuyển"}
//                                         {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && "Vận chuyển"}
//                                         {bill.invoiceStatus === 'DA_THANH_TOAN' && "Thành công"}
//                                         {bill.invoiceStatus === 'VAN_CHUYEN' && "Xác nhận đã thanh toán"}
//                                     </Button>
//                                 )
//                             ) : (
//                                 <Button form="formNote" type="primary" htmlType="submit">
//                                     {bill.invoiceStatus === 'CHO_XAC_NHAN' && "Xác nhận"}
//                                     {bill.invoiceStatus === 'XAC_NHAN' && "Chờ vận chuyển"}
//                                     {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && "Vận chuyển"}
//                                     {bill.invoiceStatus === 'DA_THANH_TOAN' && "Thành công"}
//                                     {bill.invoiceStatus === 'VAN_CHUYEN' && "Xác nhận đã thanh toán"}
//                                 </Button>
//                             )}
//                         </>
//                     }
//                 >
//                     <Form id="formNote" onFinish={(data) => handleSubmitXacNhan(data)} form={form}>
//                         {isHoanTra && chenhLechSoSanh < 0 && bill.invoiceStatus === 'CHO_XAC_NHAN' && (
//                             <Form.Item
//                                 name="transactionNo"
//                                 rules={[
//                                     { required: true, message: "Mã giao dịch không được để trống!" },
//                                 ]}
//                             >
//                                 <Input placeholder="Nhập mã giao dịch" />
//                             </Form.Item>
//                         )}

//                         {isTraSau && chenhLechSoSanh > 0 && bill.invoiceStatus === 'VAN_CHUYEN' && (
//                             <Form.Item
//                                 name="totalReturn"
//                                 rules={[
//                                     { required: true, message: "Tổng tiền trả sau không được để trống!" },
//                                     {
//                                         validator: (_, value) => {
//                                             if (value && Number(value) !== chenhLech) {
//                                                 return Promise.reject(new Error(`Tổng tiền trả sau phải trả đủ! (Cần trả ${chenhLech})`));
//                                             }
//                                             return Promise.resolve();
//                                         },
//                                     },
//                                 ]}
//                             >
//                                 <Input placeholder="Nhập tổng tiền trả sau" />
//                             </Form.Item>

//                         )}
//                         <Form.Item
//                             name="note"
//                             rules={[
//                                 { required: true, message: "Ghi chú không được để trống!" },
//                             ]}
//                         >
//                             <TextArea placeholder="Nhập ghi chú..." />
//                         </Form.Item>
//                     </Form>
//                 </Modal>

//                 {/* Modal của quay lại trạng thái   */}
//                 <Modal
//                     title={"Quay lại"}
//                     open={isModalQuayLai}
//                     onCancel={handleCancelQuayLai}
//                     footer={
//                         <Button form="formNoteQuayLai" type="primary" htmlType="submit">
//                             Đồng ý
//                         </Button>
//                     }
//                 >
//                     <Form
//                         id="formNoteQuayLai"
//                         onFinish={handleSubmitQuayLai}
//                         form={form}
//                         layout="vertical"
//                     >
//                         <Form.Item
//                             name="note"
//                             label="Ghi chú"
//                             initialValue={getNoteForAction('QUAY_LAI')}
//                             rules={[
//                                 { required: true, message: "Ghi chú không được để trống!" },
//                             ]}
//                         >
//                             <TextArea placeholder="Nhập ghi chú..." rows={4} />
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//                 {/* Modal của hủy hóa đơn  */}
//                 <Modal
//                     title={
//                         "Hủy hóa đơn"
//                     }
//                     open={isModalCancelBill}
//                     onCancel={handleCancelBill}
//                     footer={
//                         <Button form="formNote" type="primary" htmlType="submit">
//                             Đồng ý
//                         </Button>
//                     }
//                 >
//                     <Form
//                         id="formNote"
//                         onFinish={handleCancelBillStatus}
//                         form={form}
//                         initialValue={getNoteForAction('QUAY_LAI')}
//                         layout="vertical" // Điều chỉnh layout cho đẹp hơn
//                     >
//                         {
//                             bill.invoiceStatus === 'YEU_CAU_HUY' && bill.paymentStatus === 'DA_THANH_TOAN' && (
//                                 <div>
//                                     <span >
//                                         Số tiền hoàn trả là: <strong> <FormatCurrency value={tongTienHoanTraKhiHuy} /></strong>
//                                     </span>
//                                     <br />
//                                     <Form.Item name="maGiaoDich" label="Mã giao dịch" required rules={[
//                                         { required: true, message: "Mã giao dịch không được để trống!" },

//                                     ]}>
//                                         <Input
//                                             placeholder="Nhập mã giao dịch"
//                                         />
//                                     </Form.Item>
//                                 </div>
//                             )
//                         }

//                         <Form.Item
//                             name="note"
//                             label="Lí do"
//                             rules={[
//                                 { required: true, message: "Ghi chú không được để trống!" },
//                                 { min: 20, message: "Ghi chú phải có ít nhất 20 ký tự!" }, // Thêm quy tắc kiểm tra độ dài
//                             ]}
//                         >
//                             <TextArea placeholder="Nhập lí do..." rows={4} />
//                         </Form.Item>
//                     </Form>
//                 </Modal>

//                 {/* Bu tuuon chi tiết và in hóa đơn*/}
//                 <div className="d-flex align-items-center">
//                     {bill.status !== 1 && bill.status !== 2 && (
//                         <Tooltip title="In hóa đơn">

//                             <Button
//                                 type="primary"
//                                 icon={<i className="fa-regular fa-file-lines"></i>}
//                                 onClick={() => {
//                                     if (bill.code) {
//                                         getHtmlByIdBill2(bill.code, totalBillAmount);
//                                     } else {
//                                         console.error("Bill code is missing!");
//                                     }
//                                 }}                                ><IconPrinter /></Button>
//                         </Tooltip>
//                     )}
//                     <div className="px-2">
//                         <BillHistory props={billHistory} />
//                     </div>
//                 </div>

//             </div >
//             <Divider />
//             {/* Thông tin đơn hàng */}
//             <InfoBill
//                 props={bill}
//                 onSuccess={() => {
//                     loadBill();
//                     loadBillHistory();
//                 }}
//             />

//             {/* Lịch sử thanh toán */}
//             <PaymentMethod
//                 bill={bill}
//                 onSucess={() => {
//                     loadBillHistory();
//                     loadBill();
//                 }}
//             />

//             {/* Thông tin đơn hàng */}
//             <div className="mt-3 order-details-container">
//                 <div className="d-flex align-items-center mb-4 align-middle">
//                     <Title level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">
//                         Danh sách sản phẩm
//                     </Title>
//                     {bill.invoiceStatus === 'TAO_HOA_DON' ||
//                         bill.invoiceStatus === 'CHO_XAC_NHAN' ? (
//                         <ProductModal
//                             idBill={bill}
//                             onClose={() => {
//                                 loadBillDetail();
//                                 loadBill();
//                                 loadBillHistory();
//                             }}
//                         />
//                     ) : bill.invoiceStatus === 'VAN_CHUYEN' ? (
//                         <>
//                             {['THANH_CONG', 'VAN_CHUYEN'].includes(bill.invoiceStatus) ? (
//                                 ''
//                             ) : (
//                                 <GivebackAll
//                                     bill={bill}
//                                     onSuccess={() => {
//                                         loadBillDetail();
//                                         loadBill();
//                                         loadBillHistory();
//                                     }}
//                                 />
//                             )}
//                         </>
//                     ) : (
//                         ''
//                     )}
//                 </div>

//                 <Table
//                     dataSource={listBillDetail}
//                     columns={columns}
//                     showHeader={true}
//                     rowClassName={(record) => (record.invoiceStatus === true ? 'bg-danger-subtle' : '')}
//                     pagination={{
//                         showSizeChanger: true,
//                         current: currentPage,
//                         pageSize: pageSize,
//                         pageSizeOptions: [3, 5, 10, 20],
//                         total: totalPages * pageSize,
//                         onChange: (page, pageSize) => {
//                             setCurrentPage(page);
//                             setPageSize(pageSize);
//                         }
//                     }}
//                 />
//             </div>
//             {/* <div > */}
//             <div style={{ display: 'none' }}>
//                 <div ref={pdfRef} />
//                 {/* <div id="pdfContent"/> */}
//             </div>
//         </>
//     );
// };

// export default BillDetail;

///Của Duc

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Modal, Divider, Radio, Space, Button, Table, Tooltip, Form, Input, Carousel, message, InputNumber } from 'antd';
import { IconPrinter, IconTrashX } from '@tabler/icons-react';
import FormatDate from 'views/utilities/FormatDate';
import Title from 'antd/es/typography/Title';
import FormatCurrency from 'views/utilities/FormatCurrency';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import { toast } from 'react-toastify';
import BillHistory from './billHistory';
import PaymentMethod from './paymentMethod';
import TextArea from 'antd/es/input/TextArea';
import InfoBill from './changeCustomer';
import * as request from 'views/utilities/httpRequest';
import ShowProductModal from '../order/modalProductOrder';
// import Gi from '../order/modalProductOrder';
import './bill.css';
import { color, margin, style } from '@mui/system';
import axios from 'axios';
import { IconPhotoStar, IconTrashFilled, IconX } from '@tabler/icons-react';
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
import { useReactToPrint } from 'react-to-print';
import { detailHoaDon } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';

const listStatus = [
  { id: 0, name: 'Tạo hóa đơn', status: 'TAO_HOA_DON', color: '#007BFF', title: 'Tạo hóa đơn', icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
  { id: 1, name: 'Chờ xác nhận', status: 'CHO_XAC_NHAN', color: '#FFC107', title: 'Chờ xác nhận', icon: FaRegFileAlt }, // Vàng (cảnh báo)
  { id: 2, name: 'Xác nhận', status: 'XAC_NHAN', color: '#17A2B8', title: 'Xác nhận', icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
  { id: 3, name: 'Chờ vận chuyển', status: 'CHO_VAN_CHUYEN', color: '#FD7E14', title: 'Chờ vận chuyển', icon: MdPayment }, // Cam (tiến trình)
  { id: 4, name: 'Vận chuyển', status: 'VAN_CHUYEN', color: '#28A745', title: 'Vận chuyển', icon: FaTruck }, // Xanh lá (thành công)
  { id: 5, name: 'Đã thanh toán', status: 'DA_THANH_TOAN', color: '#20C997', title: 'Đã thanh toán', icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
  { id: 6, name: 'Thành công', status: 'THANH_CONG', color: '#218838', title: 'Thành công', icon: GiConfirmed }, // Xanh lá đậm (hoàn tất)
  { id: 7, name: 'Đã hủy', status: 'DA_HUY', color: '#DC3545', title: 'Đã hủy', icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
  { id: 10, name: 'Trả hàng', status: 'TRA_HANG', color: '#138496', title: 'Trả hàng', icon: MdOutlineChangeCircle }, // Xanh dương đậm (xử lý)
  { id: 8, name: 'Yêu cầu hủy', status: 'YEU_CAU_HUY', color: '#FF4500', title: 'Yêu cầu hủy', icon: MdCancel }, // Đỏ cam (yêu cầu)
  { id: 9, name: 'Thay đổi', status: 'THAY_DOI', color: '#6A5ACD', title: 'Thay đổi', icon: MdOutlineReplayCircleFilled } // Tím xanh (đặt lại)
];

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);
  const [billDetail, setBillDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formGiveback] = Form.useForm();
  const [tongTienHoanTraKhiHuy, setTongTienHoanTraKhiHuy] = useState(0);
  const [cancelBill, setCancelBill] = useState(false);

  const [sanPhamMoi, setSanPhamMoi] = useState([]);

  const token = localStorage.getItem('token');
  // Lấy dữ liệu từ localStorage
  const idNhanVien = localStorage.getItem('employeeId');

  console.log('Employee id dddddddddddddddddddddddddddd:', idNhanVien);

  const loadBill = async () => {
    await request
      .get(`/bill/${id}`)
      .then((response) => {
        setBill(response);
        setTongTienHoanTraKhiHuy(response.totalMoney + response.shippingFee - response.discountAmount);
        console.log('Bill ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq', response);
        console.log('Bill ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq', id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadBillDetail = async () => {
    await request
      .get(`/bill-detail`, {
        params: {
          idBill: id,
          page: currentPage,
          sizePage: pageSize
        }
      })
      .then((response) => {
        setListBillDetail(response.data);
        console.log('Bill detail  ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq', response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadBillHistory = () => {
    request
      .get(`/bill-history/${id}`)
      .then((response) => {
        setBillHistory(response);
        console.log('Bill History:', response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Hàm load danh sách hóa đơn chi tiết
  //   const loadBillHistory = () => {
  //     request
  //       .get(`/bill-history/${id}`)
  //       .then((response) => {
  //         setBillHistory(response);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   };

  useEffect(() => {
    loadBill();
    loadBillDetail();
    loadBillHistory();
  }, [id]);

  useEffect(() => {
    loadBillDetail();
  }, [currentPage, pageSize]);

  const [billPayment, setBillPayment] = useState([]);

  const loadBillHistory1 = () => {
    axios
      .get(`http://localhost:8080/api/payment/${bill.id}`)
      .then((response) => {
        console.log('Data received from API1:', response);
        console.log('Data received from API2dddddddddddddddd:', response.data);
        console.log('Data received from API3:', response.data.data);
        console.log('Data received from API4:', response.data.totalMoney);
        console.log('Data received from API4:', response.data.totalMoney);
        console.log('ID passed to API call:', bill.id);
        setBillPayment(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  const paymentsToUpdate = billPayment.filter((payment) => payment.status === 'TRA_SAU');
  const paymentsToUpdate1 = billPayment.filter((payment) => payment.status === 'HOAN_TIEN');

  console.log(`Cập nhật thành công cho ID ddddddddddddddddddddwwwwwwwwwwwwwww:`, paymentsToUpdate);

  const updateRefundBill = (transactionCode) => {
    // Lọc ra các payment có trạng thái HOAN_TIEN hoặc TRA_SAU
    const paymentsToUpdate = billPayment.filter((payment) => payment.status === 'HOAN_TIEN' || payment.status === 'TRA_SAU');

    console.log(`Cập nhật thành công cho ID ddddddddddddddddddddwwwwwwwwwwwwwww:`, idNhanVien);

    // Duyệt qua từng payment và gọi API cập nhật
    paymentsToUpdate.forEach((payment) => {
      const requestData = {
        employee: idNhanVien, // ID nhân viên từ localStorage
        transactionNo: transactionCode || '' // Mã giao dịch
      };

      console.log('Dữ liệu gửi đi:', requestData);

      axios
        .put(`http://localhost:8080/api/payment/${payment.id}`, requestData)
        .then((response) => {
          loadBillHistory1();
          console.log(`Cập nhật thành công cho ID ${payment.id}:`, response.data);
        })
        .catch((error) => {
          console.error(`Lỗi khi cập nhật ID ${payment.id}:`, error);
        });
    });

    if (paymentsToUpdate.length === 0) {
      console.warn('Không tìm thấy payment nào có trạng thái HOAN_TIEN hoặc TRA_SAU.');
    }
  };

  const totalBillAmount = billPayment.reduce((sum, payment) => sum + payment.totalMoney, 0);

  useEffect(() => {
    loadBillHistory1();
  }, []);

  console.log('PDF đã được in xong', totalBillAmount);

  const createPayment = (product) => {
    const newPayment = {
      bill: id,
      employee: idNhanVien,
      method: 'CHUYEN_KHOAN',
      totalMoney: product.quantity * (product.discountPrice || product.price),
      status: 'HOAN_TRA',
      transactionNo: null
    };
    request
      .post(`/payment`, newPayment)
      .then((response) => {})
      .catch((e) => {
        console.log(e);
        message.error(e.response.data);
      });
  };

  const createPayment1 = (product) => {
    const newPayment = {
      bill: id,
      employee: idNhanVien,
      method: 'CHUYEN_KHOAN',
      totalMoney: product.quantity * (product.discountPrice || product.price),
      status: 'TRA_SAU',
      transactionNo: null
    };
    request
      .post(`/payment`, newPayment)
      .then((response) => {})
      .catch((e) => {
        console.log(e);
        message.error(e.response.data);
      });
  };

  //Hàm xóa
  const handleDeleteBillDetail = (id) => {
    console.log('idNhanVienmnnnnnnnnnnnnnnnnnnnnnnnnn', idNhanVien);

    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận xóa khỏi đơn hàng?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        request
          .remove(`/bill-detail/delete/${id}?idNhanVien=${idNhanVien}`)
          .then((response) => {
            message.success('Xóa thành công!');
            // Load lại dữ liệu liên quan
            loadBillDetail();
            loadBill();
            loadBillHistory();
            createPayment(id); // Nếu cần xử lý thanh toán
          })
          .catch((e) => {
            console.error(e);
            const errorMsg = e.response?.data?.message || 'Xóa thất bại, vui lòng thử lại!';
            message.error(`Lỗi: ${errorMsg}`);
          });
      }
    });
  };

  const handleChangeQuantity = (record, quantity) => {
    console.log('Số lượng hhhhhhhhhhhhhhhhhhhhhh', quantity);

    request
      .put(`/bill-detail/update-quantity-bill-detail/${record.id}?newQuantity=${quantity}&idNhanVien=${idNhanVien}`)
      .then((response) => {
        loadBillDetail();
        loadBill();
        loadBillHistory();
        message.success('Cập nhật thành công!');
      })
      .catch((e) => {
        // message.error(e.response?.data?.message || "Lỗi không xác định");
        console.log(e);
      });
  };

  const handleGiveBack = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: (
        <>
          <Form
            layout="vertical"
            form={formGiveback}
            onFinish={async (data) => {
              data.billDetail = id;
              await request
                .post(`/bill/give-back`, data)
                .then((response) => {
                  loadBillDetail();
                  loadBill();
                  loadBillHistory();
                  message.success('Trả hàng thành công!');
                })
                .catch((e) => {
                  console.log(e);
                  message.error(e.response.data);
                });
            }}
          >
            <Form.Item label="Số lượng" name={'quantity'} rules={[{ required: true, message: 'Số lượng không được để trống!' }]}>
              <InputNumber placeholder="Nhập số lượng muốn trả hàng..." className="w-100" />
            </Form.Item>
            <Form.Item
              label="Lý do trả hàng"
              name={'note'}
              rules={[
                {
                  required: true,
                  message: 'Lý do trả hàng không được để trống!'
                }
              ]}
            >
              <TextArea placeholder="Nhập lý do trả hàng..." />
            </Form.Item>
          </Form>
        </>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        formGiveback.submit();
      }
    });
  };

  //Modal của Xác nhận đơn hàng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (isCancel) => {
    setCancelBill(isCancel);
    loadBillHistory1();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCancelBill(false);
  };

  //Modal của quay lại trạng thái
  const [isModalQuayLai, setIsModalQuayLai] = useState(false);

  const showModalQuayLai = (isCancel) => {
    setCancelBill(isCancel);
    setIsModalQuayLai(true);
  };

  const handleCancelQuayLai = () => {
    setIsModalQuayLai(false);
    setCancelBill(false);
  };
  //Modal của huỷ hóa đơn
  const [isModalCancelBill, setIsModalCanCelBill] = useState(false);

  const showModalCancelBill = (isCancel) => {
    setCancelBill(isCancel);
    setIsModalCanCelBill(true);
  };

  const handleCancelBill = () => {
    setIsModalCanCelBill(false);
    setCancelBill(false);
  };

  const handleSubmitXacNhan = (data) => {
    let updatedStatus;
    if (bill.invoiceStatus === 'CHO_XAC_NHAN') {
      if (bill.invoiceType === 'TRUC_TUYEN') {
        handleSubmitQuantity();
      }
      updatedStatus = 'XAC_NHAN';
    } else if (bill.invoiceStatus === 'XAC_NHAN') {
      updatedStatus = 'CHO_VAN_CHUYEN';
    } else if (bill.invoiceStatus === 'CHO_VAN_CHUYEN') {
      updatedStatus = 'VAN_CHUYEN';
    } else if (bill.invoiceStatus === 'VAN_CHUYEN') {
      updatedStatus = 'DA_THANH_TOAN';
    } else if (bill.invoiceStatus === 'DA_THANH_TOAN') {
      updatedStatus = 'THANH_CONG';
    } else if (bill.invoiceStatus === 'TAO_HOA_DON') {
      updatedStatus = 'CHO_XAC_NHAN';
    }

    const requestData = {
      idHD: id, // ID hóa đơn phải có giá trị hợp lệ
      status: updatedStatus,
      note: data.note
    };

    console.log('idNhanVien  124:', idNhanVien);
    updateRefundBill(data.transactionNo);

    // Gửi request PUT tới server
    axios
      .put(`http://localhost:8080/api/bill/change-status`, requestData, {
        params: {
          idNhanVien: idNhanVien // Truyền idNhanVien nếu có, nếu không thì null
        }
      })
      .then((response) => {
        loadBill(); // Tải lại danh sách hóa đơn
        loadBillDetail(); // Tải lại chi tiết hóa đơn
        loadBillHistory(); // Tải lại lịch sử hóa đơn
        form.resetFields(); // Reset lại form sau khi gửi
        message.success('Thay đổi trạng thái đơn hàng thành công!');
        // if (billPayment?.status === 'HOAN_TIEN' || billPayment?.status === 'TRA_SAU') {
        // }
      })
      .catch((e) => {
        console.error('Lỗi khi thay đổi trạng thái:', e);
        message.error('Không thể thay đổi trạng thái. Chi tiết lỗi: ' + (e.response?.data?.message || e.message)); // Hiển thị lỗi chi tiết
      });

    setIsModalOpen(false); // Đóng modal sau khi gửi
  };

  const handleSubmitQuayLai = (data) => {
    const requestData = {
      actionDescription: data.note // Note từ form
    };
    // Gửi request PUT tới server
    request
      .put(`/bill/roll-back-bill/${id}`, requestData, {
        // params: {
        //     idNV: idNhanVien,
        // },
      })
      .then((response) => {
        loadBill(); // Tải lại danh sách hóa đơn
        loadBillDetail(); // Tải lại chi tiết hóa đơn
        loadBillHistory(); // Tải lại lịch sử hóa đơn
        form.resetFields(); // Reset lại form sau khi gửi
        message.success('Thay đổi trạng thái đơn hàng thành công!'); // Thông báo thành công
      })
      .catch((e) => {
        console.error('Lỗi khi thay đổi trạng thái:', e);
        message.error('Không thể thay đổi trạng thái. Chi tiết lỗi: ' + e.response?.data?.message || e.message); // Hiển thị lỗi chi tiết
      });

    setIsModalQuayLai(false); // Đóng modal sau khi gửi
  };

  const handleSubmitQuantity = () => {
    console.log('Hoa Don Detailp XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', listBillDetail);

    request
      .put(`/bill/quantity/${id}`, {
        params: {
          sanPhamMoi: listBillDetail
        }
      })
      .then((response) => {
        loadBill();
        loadBillDetail();
        loadBillHistory();
        form.resetFields();
      })
      .catch((e) => {
        console.error('Lỗi khi thay đổi trạng thái:', e);
      });
  };

  console.error('Chỉ có admin mới có thể hủy hóa đơn:', bill?.totalMoney);

  //Nút hủy
  const handleCancelBillStatus = (data) => {
    console.log('tongTienHoanTraKhiHuy,mmmmmmmmmmmmmmmmmmmmmmmmmmmmmdddd', tongTienHoanTraKhiHuy);

    const requestData = {
      description: data.note,
      transactionNo: data.maGiaoDich,
      totalMoney: parseInt(tongTienHoanTraKhiHuy)
    };

    // Gửi request PUT tới server
    axios
      .put(`http://localhost:8080/api/bill/cancel-status/${id}`, requestData, {
        params: {
          idNhanVien: idNhanVien // ID nhân viên hiện tại
        }
      })
      .then((response) => {
        loadBill(); // Tải lại danh sách hóa đơn
        loadBillDetail(); // Tải lại chi tiết hóa đơn
        loadBillHistory(); // Tải lại lịch sử hóa đơn
        form.resetFields(); // Reset lại form sau khi gửi
        toast.success('Hủy đơn hàng thành công!'); // Thông báo thành công
      })
      .catch((e) => {
        console.error('Chỉ có admin mới có thể hủy hóa đơn:', e);
        toast.error('Chỉ có admin mới có thể hủy hóa đơn: '); // Hiển thị lỗi chi tiết\
        //Cái này giúp lấy ra lỗi của be lên
        // const errorMessage = e.response?.data?.message || 'Chỉ có admin mới có thể hủy hóa đơn';
        // toast.error(errorMessage);
      });
    setIsModalCanCelBill(false);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: <IconPhotoStar />,
      dataIndex: 'image',
      key: 'image',
      render: (item, record) => (
        <>
          <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} style={{ width: '150px' }}>
            {item !== undefined &&
              item.split(',').map((images, index) => (
                <div className="position-relative" style={{ height: '150px' }}>
                  <img src={images} alt="image" style={{ width: '150px', height: '150px' }} className="object-fit-contain" />
                </div>
              ))}
          </Carousel>
        </>
      )
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="d-flex flex-column justify-content-between">
          <div className="fw-semibold">{record.name}</div>
          <div>
            <small>Mã SP: {record.detailCode}</small>
          </div>
          <div>
            <span className="text-secondary"> </span>
            {record.discountPrice && record.discountPrice !== 0 ? (
              <>
                Đơn giá :
                <span className="text-decoration-line-through text-muted ms-2">
                  <FormatCurrency value={record.price} />
                </span>
                <br />
                Giảm giá :
                <span className="ms-2 text-danger fw-bold">
                  <FormatCurrency value={record.discountPrice} />
                </span>
              </>
            ) : (
              <span className="text-danger fw-bold">
                Đơn giá <FormatCurrency value={record.priceHDCT} />
              </span>
            )}
            {record.priceHDCT && record.price && record.priceHDCT !== record.price ? (
              <h6>
                Đơn giá được cập nhật từ giá cũ{' '}
                <span className="text-decoration-line-through text-muted">
                  <FormatCurrency value={record.priceHDCT} />
                </span>{' '}
                thành giá mới{' '}
                <span className="text-danger fw-bold">
                  <FormatCurrency value={record.price} />
                </span>
              </h6>
            ) : null}
          </div>
        </div>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px' // Tạo khoảng cách giữa các nút và input
          }}
        >
          <button
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: record.price !== record.priceHDCT || quantity <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              color: record.price !== record.priceHDCT || quantity <= 1 ? '#ccc' : '#000'
            }}
            onClick={() => {
              const newValue = quantity - 1;
              if (record.price === record.priceHDCT) {
                // Chỉ cho phép cập nhật khi giá không thay đổi
                if (newValue >= 1) {
                  handleChangeQuantity(record, newValue);
                }
              } else {
                alert('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
            disabled={record.price !== record.priceHDCT || quantity <= 1} // Vô hiệu hóa nút nếu giá thay đổi hoặc số lượng <= 1
          >
            -
          </button>

          <InputNumber
            className="text-center"
            value={quantity}
            style={{
              width: '64px',
              textAlign: 'center',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: record.price !== record.priceHDCT ? '#f5f5f5' : '#fff',
              color: record.price !== record.priceHDCT ? '#aaa' : '#000',
              cursor: record.price !== record.priceHDCT ? 'not-allowed' : 'text'
            }}
            min={1}
            inputMode="numeric"
            disabled={record.price !== record.priceHDCT} // Vô hiệu hóa input nếu giá thay đổi
            onPressEnter={(e) => {
              const value = Number(e.target.value);
              if (record.price === record.priceHDCT) {
                if (!isNaN(value) && value > 0) {
                  handleChangeQuantity(record, value);
                } else {
                  message.error('Vui lòng chỉ nhập số và phải lớn hơn hoặc bằng 1!');
                }
              } else {
                message.warning('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (record.price === record.priceHDCT) {
                if (!isNaN(value) && value > 0) {
                  handleChangeQuantity(record, value);
                } else {
                  message.error('Vui lòng chỉ nhập số và phải lớn hơn hoặc bằng 1!');
                }
              } else {
                message.warning('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
          />

          <button
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: record.price !== record.priceHDCT ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              color: record.price !== record.priceHDCT ? '#ccc' : '#000'
            }}
            onClick={() => {
              if (record.price === record.priceHDCT) {
                handleChangeQuantity(record, quantity + 1);
              } else {
                alert('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
            disabled={record.price !== record.priceHDCT} // Nút bị vô hiệu hóa nếu giá thay đổi
          >
            +
          </button>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'quantity',
      key: 'total',
      render: (quantity, record) => (
        <div className="text-danger fw-bold">
          <FormatCurrency value={(record.discountPrice || record.priceHDCT) * quantity} />
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          {bill.invoiceStatus === 'TAO_HOA_DON' ||
          bill.invoiceStatus === 'CHO_XAC_NHAN' ||
          bill.invoiceStatus === 'XAC_NHAN' ||
          bill.invoiceStatus === 'CHO_VAN_CHUYEN' ? (
            <Space size="middle">
              <Button onClick={() => handleDeleteBillDetail(record.id)} type="danger">
                <IconTrashX />
              </Button>
            </Space>
          ) : (
            ''
            // <IconTrashX />
          )}
        </>
      )
    }
  ];

  const pdfRef = useRef(null);

  // Cấu hình in với useReactToPrint
  const generatePDF = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: 'Invoice',
    onAfterPrint: () => {
      console.log('PDF đã được in xong');
    }
  });

  // Hàm gọi API để lấy nội dung HTML và in
  const getHtmlByIdBill2 = async (id, totalExcessMoney) => {
    try {
      console.log('ninh', totalExcessMoney);
      const response = await axios.get(`http://localhost:8080/api/bill/invoice-pdf/${id}/${totalExcessMoney}`);
      if (pdfRef.current) {
        // Cập nhật nội dung HTML vào pdfRef
        pdfRef.current.innerHTML = response.data.data;
        setTimeout(() => {
          generatePDF(); // Gọi hàm in sau khi cập nhật nội dung
        }, 0);
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  };

  const traSauTotal = billPayment.filter((payment) => payment.status === 'TRA_SAU').reduce((sum, payment) => sum + payment.totalMoney, 0);

  const hoanTienTotal = billPayment
    .slice(1) // Loại bỏ khoản đầu tiên khỏi danh sách
    .filter((payment) => payment.status === 'HOAN_TIEN')
    .reduce((sum, payment) => sum + payment.totalMoney, 0);

  const isHoanTra = Array.isArray(billPayment)
    ? billPayment.some((payment) => payment.status === 'HOAN_TIEN')
    : billPayment?.status === 'HOAN_TIEN';
  const isTraSau = Array.isArray(billPayment)
    ? billPayment.some((payment) => payment.status === 'TRA_SAU')
    : billPayment?.status === 'TRA_SAU';

  const chenhLechSoSanh = traSauTotal - hoanTienTotal;

  const chenhLech = traSauTotal - hoanTienTotal > 0 ? traSauTotal - hoanTienTotal : hoanTienTotal - traSauTotal;

  const [tienTraSau, setTienTraSau] = useState(0);

  const getNoteByStatus = () => {
    if (isHoanTra) {
      return chenhLechSoSanh > 0 ? `Hoàn tiền cho khách : ${chenhLech}` : `Khách phải trả thêm: ${chenhLech}`;
    }

    switch (bill.invoiceStatus) {
      case 'CHO_XAC_NHAN':
        return 'Đã xác nhận đơn đặt hàng';
      case 'XAC_NHAN':
        return 'Đã xác nhận, đơn đang chờ vận chuyển';
      case 'CHO_VAN_CHUYEN':
        return 'Đã xác nhận vận chuyển';
      case 'VAN_CHUYEN':
        return 'Đã xác nhận thông tin thanh toán';
      case 'DA_THANH_TOAN':
        return 'Đơn hàng đã được giao thành công';
      default:
        return '';
    }
  };

  // Hàm riêng để lấy ghi chú cho hành động "Quay lại" hoặc "Hủy hóa đơn"
  const getNoteForAction = (action) => {
    if (action === 'QUAY_LAI') {
      switch (bill.invoiceStatus) {
        case 'CHO_XAC_NHAN':
          return 'Yêu cầu quay lại trạng thái: Chờ xác nhận';
        case 'XAC_NHAN':
          return 'Yêu cầu quay lại trạng thái: Đã xác nhận';
        case 'CHO_VAN_CHUYEN':
          return 'Yêu cầu quay lại trạng thái: Chờ vận chuyển';
        case 'VAN_CHUYEN':
          return 'Yêu cầu quay lại trạng thái: Đang vận chuyển';
        case 'DA_THANH_TOAN':
          return 'Yêu cầu quay lại trạng thái: Đã thanh toán';
        default:
          return 'Yêu cầu quay lại trạng thái trước đó';
      }
    } else if (action === 'HUY_HOA_DON') {
      return 'Đơn hàng đã được yêu cầu hủy. Vui lòng xem lại thông tin.';
    }
    return '';
  };

  // Cập nhật giá trị ghi chú khi trạng thái thay đổi
  useEffect(() => {
    form.setFieldsValue({ note: getNoteByStatus() });
  }, [billPayment?.status, bill.invoiceStatus, chenhLech, chenhLechSoSanh]);

  return (
    <>
      <nav className="breadcrumb fw-semibold">
        <Link className="breadcrumb-item bee-text text-decoration-none" to={'/admin/bill'}>
          Danh sách hóa đơn
        </Link>
        <span className="breadcrumb-item">Hóa đơn {bill.code}</span>
      </nav>

      <div className="container overflow-x-auto mb-3">
        <Timeline minEvents={8} placeholder maxEvents={billHistory.length} style={{ height: '400px' }}>
          {billHistory.map((item, index) => (
            <TimelineEvent
              key={index}
              icon={
                // Gọi icon dưới dạng component
                listStatus.find((status) => status.status === item.status)?.icon
              }
              color={
                // Lấy color từ listStatus
                listStatus.find((status) => status.status === item.status)?.color
              }
              title={
                // Lấy title từ listStatus
                <h6 className="mt-2">{listStatus.find((status) => status.status === item.status)?.title}</h6>
              }
              subtitle={
                <>
                  {item.actionDescription}
                  <br />
                  <FormatDate date={item.createdAt} />
                </>
              }
            />
          ))}
        </Timeline>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        {/* Bu tuuon Xác nhận và hủy*/}
        <div className=" mx-3 d-flex">
          {bill.invoiceStatus !== 'THANH_CONG' || bill.invoiceStatus !== 'TRA_HANG' ? (
            <>
              {(bill.invoiceStatus === 'TAO_HOA_DON' ||
                bill.invoiceStatus === 'CHO_XAC_NHAN' ||
                bill.invoiceStatus === 'XAC_NHAN' ||
                bill.invoiceStatus === 'CHO_VAN_CHUYEN' ||
                bill.invoiceStatus === 'VAN_CHUYEN' ||
                bill.invoiceStatus === 'DA_THANH_TOAN') && (
                <div>
                  <Button type="primary" className="me-1" onClick={() => showModal(true)}>
                    {bill.invoiceStatus === 'TAO_HOA_DON' && 'Chờ xác nhận'}
                    {bill.invoiceStatus === 'CHO_XAC_NHAN' && 'Xác nhận'}
                    {bill.invoiceStatus === 'XAC_NHAN' && 'Chờ vận chuyển'}
                    {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && 'Vận chuyển'}

                    {bill.invoiceStatus === 'VAN_CHUYEN' && 'Đã thanh toán'}
                    {bill.invoiceStatus === 'DA_THANH_TOAN' && 'Thành công'}
                  </Button>
                </div>
              )}

              {(bill.invoiceStatus === 'TAO_HOA_DON' ||
                bill.invoiceStatus === 'CHO_XAC_NHAN' ||
                bill.invoiceStatus === 'XAC_NHAN' ||
                bill.invoiceStatus === 'CHO_VAN_CHUYEN' ||
                bill.invoiceStatus === 'YEU_CAU_HUY') && (
                <div>
                  <Button style={{ backgroundColor: 'red' }} className="me-1" onClick={() => showModalCancelBill(true)}>
                    Hủy
                  </Button>
                </div>
              )}
            </>
          ) : (
            ''
          )}
          {bill.invoiceStatus !== 'TAO_HOA_DON' &&
            bill.invoiceStatus !== 'CHO_XAC_NHAN' &&
            bill.invoiceStatus !== 'DA_THANH_TOAN' &&
            bill.invoiceStatus !== 'THANH_CONG' &&
            bill.invoiceStatus !== 'DA_HUY' &&
            bill.invoiceStatus !== 'TRA_HANG' && (
              <div>
                <Button style={{ backgroundColor: 'Yellow' }} className="me-1" onClick={() => showModalQuayLai(true)}>
                  Quay lại
                </Button>
              </div>
            )}
        </div>
        {/* Modal của xác nhận đơn hàng  */}
        <Modal
          title={
            bill.invoiceStatus === 'TAO_HOA_DON'
              ? 'Chờ xác nhận'
              : bill.invoiceStatus === 'CHO_XAC_NHAN' && isHoanTra && chenhLechSoSanh < 0
                ? 'Số tiền cần phải hoàn trả khách: ' + chenhLech
                : bill.invoiceStatus === 'CHO_XAC_NHAN'
                  ? 'Xác nhận đơn hàng'
                  : bill.invoiceStatus === 'XAC_NHAN'
                    ? 'Chờ vận chuyển đơn hàng'
                    : bill.invoiceStatus === 'CHO_VAN_CHUYEN'
                      ? 'Vận chuyển đơn hàng'
                      : bill.invoiceStatus === 'VAN_CHUYEN' && isTraSau && chenhLechSoSanh > 0
                        ? 'Số tiền khách đã trả: ' + chenhLech
                        : bill.invoiceStatus === 'VAN_CHUYEN'
                          ? 'Thanh toán đơn hàng'
                          : bill.invoiceStatus === 'DA_THANH_TOAN'
                            ? 'Thành công'
                            : 'Xác nhận'
          }
          open={isModalOpen}
          onCancel={handleCancel}
          footer={
            <>
              {bill.paymentStatus === 'DA_THANH_TOAN' ? (
                isHoanTra ? (
                  <Button form="formNote" type="primary" htmlType="submit">
                    {bill.invoiceStatus === 'CHO_XAC_NHAN' && 'Hoàn trả'}
                    {bill.invoiceStatus === 'XAC_NHAN' && 'Chờ vận chuyển'}
                    {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && 'Vận chuyển'}
                    {bill.invoiceStatus === 'DA_THANH_TOAN' && 'Thành công'}
                    {bill.invoiceStatus === 'VAN_CHUYEN' && 'Xác nhận đã thanh toán'}
                  </Button>
                ) : (
                  <Button form="formNote" type="primary" htmlType="submit">
                    {bill.invoiceStatus === 'CHO_XAC_NHAN' && 'Xác nhận'}
                    {bill.invoiceStatus === 'XAC_NHAN' && 'Chờ vận chuyển'}
                    {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && 'Vận chuyển'}
                    {bill.invoiceStatus === 'DA_THANH_TOAN' && 'Thành công'}
                    {bill.invoiceStatus === 'VAN_CHUYEN' && 'Xác nhận đã thanh toán'}
                  </Button>
                )
              ) : (
                <Button form="formNote" type="primary" htmlType="submit">
                  {bill.invoiceStatus === 'CHO_XAC_NHAN' && 'Xác nhận'}
                  {bill.invoiceStatus === 'XAC_NHAN' && 'Chờ vận chuyển'}
                  {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && 'Vận chuyển'}
                  {bill.invoiceStatus === 'DA_THANH_TOAN' && 'Thành công'}
                  {bill.invoiceStatus === 'VAN_CHUYEN' && 'Xác nhận đã thanh toán'}
                </Button>
              )}
            </>
          }
        >
          <Form id="formNote" onFinish={(data) => handleSubmitXacNhan(data)} form={form}>
            {isHoanTra && chenhLechSoSanh < 0 && bill.invoiceStatus === 'CHO_XAC_NHAN' && (
              <Form.Item name="transactionNo" rules={[{ required: true, message: 'Mã giao dịch không được để trống!' }]}>
                <Input placeholder="Nhập mã giao dịch" />
              </Form.Item>
            )}
            {isTraSau && chenhLechSoSanh > 0 && bill.invoiceStatus === 'VAN_CHUYEN' && (
              <Form.Item
                name="totalReturn"
                rules={[
                  { required: true, message: 'Tổng tiền trả sau không được để trống!' },
                  {
                    validator: (_, value) => {
                      if (value && Number(value) !== chenhLech) {
                        return Promise.reject(new Error(`Tổng tiền trả sau phải trả đủ! (Cần trả ${chenhLech})`));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="Nhập tổng tiền trả sau" />
              </Form.Item>
            )}
            <Form.Item name="note" rules={[{ required: true, message: 'Ghi chú không được để trống!' }]}>
              <TextArea placeholder="Nhập ghi chú..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal của quay lại trạng thái   */}
        <Modal
          title={'Quay lại'}
          open={isModalQuayLai}
          onCancel={handleCancelQuayLai}
          footer={
            <Button form="formNoteQuayLai" type="primary" htmlType="submit">
              Đồng ý
            </Button>
          }
        >
          <Form id="formNoteQuayLai" onFinish={handleSubmitQuayLai} form={form} layout="vertical">
            <Form.Item
              name="note"
              label="Ghi chú"
              initialValue={getNoteForAction('QUAY_LAI')}
              rules={[{ required: true, message: 'Ghi chú không được để trống!' }]}
            >
              <TextArea placeholder="Nhập ghi chú..." rows={4} />
            </Form.Item>
          </Form>
        </Modal>
        {/* Modal của hủy hóa đơn  */}
        <Modal
          title={'Hủy hóa đơn'}
          open={isModalCancelBill}
          onCancel={handleCancelBill}
          footer={
            <Button form="formNote" type="primary" htmlType="submit">
              Đồng ý
            </Button>
          }
        >
          <Form
            id="formNote"
            onFinish={handleCancelBillStatus}
            form={form}
            initialValue={getNoteForAction('QUAY_LAI')}
            layout="vertical" // Điều chỉnh layout cho đẹp hơn
          >
            {bill.invoiceStatus === 'YEU_CAU_HUY' && bill.paymentStatus === 'DA_THANH_TOAN' && (
              <div>
                <span>
                  Số tiền hoàn trả là:{' '}
                  <strong>
                    {' '}
                    <FormatCurrency value={tongTienHoanTraKhiHuy} />
                  </strong>
                </span>
                <br />
                <Form.Item
                  name="maGiaoDich"
                  label="Mã giao dịch"
                  required
                  rules={[{ required: true, message: 'Mã giao dịch không được để trống!' }]}
                >
                  <Input placeholder="Nhập mã giao dịch" />
                </Form.Item>
              </div>
            )}

            <Form.Item
              name="note"
              label="Lí do"
              rules={[
                { required: true, message: 'Ghi chú không được để trống!' },
                { min: 20, message: 'Ghi chú phải có ít nhất 20 ký tự!' } // Thêm quy tắc kiểm tra độ dài
              ]}
            >
              <TextArea placeholder="Nhập lí do..." rows={4} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Bu tuuon chi tiết và in hóa đơn*/}
        <div className="d-flex align-items-center">
          {bill.status !== 1 && bill.status !== 2 && (
            <Tooltip title="In hóa đơn">
              <Button
                type="primary"
                icon={<i className="fa-regular fa-file-lines"></i>}
                onClick={() => {
                  if (bill.code) {
                    getHtmlByIdBill2(bill.code, totalBillAmount);
                  } else {
                    console.error('Bill code is missing!');
                  }
                }}
              >
                <IconPrinter />
              </Button>
            </Tooltip>
          )}
          <div className="px-2">
            <BillHistory props={billHistory} />
          </div>
        </div>
      </div>
      <Divider />
      {/* Thông tin đơn hàng */}
      <InfoBill
        props={bill}
        onSuccess={() => {
          loadBill();
          loadBillHistory();
        }}
      />

      {/* Lịch sử thanh toán */}
      <PaymentMethod
        bill={bill}
        onSucess={() => {
          loadBillHistory();
          loadBill();
        }}
      />

      {/* Thông tin đơn hàng */}
      <div className="mt-3 order-details-container">
        <div className="d-flex align-items-center mb-4 align-middle">
          <Title level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">
            Danh sách sản phẩm
          </Title>
          {bill.invoiceStatus === 'TAO_HOA_DON' || bill.invoiceStatus === 'CHO_XAC_NHAN' ? (
            <ShowProductModal
              idBill={bill}
              onClose={() => {
                loadBillDetail();
                loadBill();
                loadBillHistory();
              }}
            />
          ) : bill.invoiceStatus === 'VAN_CHUYEN' ? (
            <>
              {['THANH_CONG', 'VAN_CHUYEN'].includes(bill.invoiceStatus) ? (
                ''
              ) : (
                <GivebackAll
                  bill={bill}
                  onSuccess={() => {
                    loadBillDetail();
                    loadBill();
                    loadBillHistory();
                  }}
                />
              )}
            </>
          ) : (
            ''
          )}
        </div>

        <Table
          dataSource={listBillDetail}
          columns={columns}
          showHeader={true}
          rowClassName={(record) => (record.invoiceStatus === true ? 'bg-danger-subtle' : '')}
          pagination={{
            showSizeChanger: true,
            current: currentPage,
            pageSize: pageSize,
            pageSizeOptions: [3, 5, 10, 20],
            total: totalPages * pageSize,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }
          }}
        />
      </div>
      {/* <div > */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef} />
        {/* <div id="pdfContent"/> */}
      </div>
    </>
  );
};

export default BillDetail;
