// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Modal, Divider, Radio, Space, Button, Table, Tooltip, Form, Input, Carousel } from 'antd';
// import { IconPrinter, IconTrashX } from '@tabler/icons-react';
// import FormatDate from 'views/utilities/FormatDate';
// import FormatCurrency from 'views/utilities/FormatCurrency';
// import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
// import { toast } from 'react-toastify';
// import BillHistory from './billHistory';
// import PaymentMethod from './paymentMethod';
// import TextArea from 'antd/es/input/TextArea';
// import InfoBill from './changeCustomer';
// import { FaRegFileAlt, FaTruck, FaRegFlushed, FaCheck, FaPlusCircle } from 'react-icons/fa';
// import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle } from 'react-icons/md';
// import { GiConfirmed } from 'react-icons/gi';
// import * as request from 'views/utilities/httpRequest';
// import ShowProductModal from '../order/modalProductOrder';
// import './bill.css';
// import { color, margin, style } from '@mui/system';

// const BillDetail = () => {
//   const [bill, setBill] = useState([]);
//   const [billHistory, setBillHistory] = useState([]);
//   const [listBillDetail, setListBillDetail] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [pageSize, setPageSize] = useState(3);
//   const { id } = useParams();
//   const [form] = Form.useForm();
//   const [formGiveback] = Form.useForm();
//   const [cancelBill, setCancelBill] = useState(false);

//   // Hàm load danh sách hóa đơn
//   const loadBill = async () => {
//     await request
//       .get(`/bill/${id}`)
//       .then((response) => {
//         setBill(response);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };

//   // Hàm load danh sách hóa đơn chi tiết
//   const loadBillDetail = async () => {
//     try {
//       const response = await request.get(`/bill-detail`, {
//         params: {
//           bill: id,
//           idHoaDon: id,
//           page: currentPage,
//           sizePage: pageSize
//         }
//       });

//       console.log('ID hóa đơn : ' + id);
//       setListBillDetail(response.data);
//       console.log('Data trả về :', response.data); // Đã sửa ở đây để log dữ liệu response.data
//       setTotalPages(response.totalPages);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Hàm load danh sách hóa đơn chi tiết
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

//   useEffect(() => {
//     loadBill();
//     loadBillDetail();
//     loadBillHistory();
//   }, [id]);

//   useEffect(() => {
//     loadBillDetail();
//   }, [currentPage, pageSize]);

//   // Hàm xóa sản phẩm khỏi giỏ hàng
//   const handleDeleteBillDetail = (id) => {
//     Modal.confirm({
//       title: 'Xác nhận',
//       maskClosable: true,
//       content: 'Xác nhận xóa khỏi giỏ hàng ?',
//       okText: 'Xác nhận',
//       cancelText: 'Hủy',
//       onOk: () => {
//         request
//           .remove(`/bill-detail/${id}`)
//           .then((response) => {
//             toast.success('Xóa thành công!');
//             loadBillDetail();
//             loadBill();
//             loadBillHistory();
//           })
//           .catch((e) => {
//             console.log(e);
//             toast.error(e.response.data);
//           });
//       }
//     });
//   };

//   // Hàm update số lượng sản phẩm trong giỏ
//   const handleChangeQuantity = (record, quantity) => {
//     request
//       .get(`/bill-detail/update-quantity/${record.id}`, {
//         params: {
//           newQuantity: quantity,
//           price: record.trangThai === true ? record.donGia : record.discountValue === null ? record.shoePrice : record.discountValue
//         }
//       })
//       .then((response) => {
//         loadBillDetail();
//         loadBill();
//         loadBillHistory();
//         toast.success('Cập nhật thành công!');
//       })
//       .catch((e) => {
//         console.log(e);
//         toast.error(e.response.data);
//       });
//   };

//   // Hàm trả hàng
//   const handleGiveBack = (id) => {
//     Modal.confirm({
//       title: 'Xác nhận',
//       maskClosable: true,
//       content: (
//         <>
//           <Form
//             layout="vertical"
//             form={formGiveback}
//             onFinish={async (data) => {
//               data.billDetail = id;
//               await request
//                 .post(`/bill/give-back`, data)
//                 .then((response) => {
//                   loadBillDetail();
//                   loadBill();
//                   loadBillHistory();
//                   toast.success('Trả hàng thành công!');
//                 })
//                 .catch((e) => {
//                   console.log(e);
//                   toast.error(e.response.data);
//                 });
//             }}
//           >
//             <Form.Item label="Số lượng" name={'quantity'} rules={[{ required: true, message: 'Số lượng không được để trống!' }]}>
//               <InputNumber placeholder="Nhập số lượng muốn trả hàng..." className="w-100" />
//             </Form.Item>
//             <Form.Item label="Lý do trả hàng" name={'note'} rules={[{ required: true, message: 'Lý do trả hàng không được để trống!' }]}>
//               <TextArea placeholder="Nhập lý do trả hàng..." />
//             </Form.Item>
//           </Form>
//         </>
//       ),
//       okText: 'Xác nhận',
//       cancelText: 'Hủy',
//       onOk: async () => {
//         formGiveback.submit();
//       }
//     });
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const showModal = (isCancel) => {
//     setCancelBill(isCancel);
//     setIsModalOpen(true);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     setCancelBill(false);
//   };

//   // Hàm thay đổi trạng thái giao hàng
//   const handleSubmit = (data) => {
//     request
//       .get(`/bill/change-status/${bill.id}`, {
//         params: {
//           note: data.ghiChu,
//           isCancel: cancelBill
//         }
//       })
//       .then((response) => {
//         loadBill();
//         loadBillDetail();
//         loadBillHistory();
//         form.resetFields();
//         toast.success('Đã cập nhật trạng thái đơn hàng!');
//       })
//       .catch((e) => {
//         console.log(e);
//         toast.error(e.response.data);
//       });
//     setIsModalOpen(false);
//   };

//   const columns = [
//     {
//       title: '#',
//       dataIndex: 'index',
//       key: 'index'
//     },
//     {
//       title: 'Thông tin sản phẩm',
//       dataIndex: 'images',
//       key: 'images',
//       render: (item) => (
//         <>
//           <Carousel autoplay autoplaySpeed={500} dots={false} arrows={false} style={{ width: '100px' }}>
//             {item !== undefined &&
//               item.split(',').map((images, index) => (
//                 <div className="" style={{ height: '100px' }}>
//                   <img src={images} alt="images" style={{ width: '100px', height: '100px' }} className="object-fit-cover" />
//                 </div>
//               ))}
//           </Carousel>
//         </>
//       )
//     },
//     {
//       title: 'Sản phẩm',
//       dataIndex: 'ten',
//       key: 'ten',
//       render: (name, record) => (
//         <>
//           <ul className="list-unstyled ">
//             <li className="fw-semibold">{name}</li>
//             <li>
//               Đơn giá :
//               <span className="text-danger">
//                 <FormatCurrency value={record.gia} />
//               </span>
//             </li>
//           </ul>
//         </>
//       )
//     },
//     {
//       title: 'Số lượng',
//       dataIndex: 'soLuong',
//       key: 'soLuong',
//       render: (soLuong, record) => (
//         <>
//           {bill.trangThai <= 4 ? (
//             <Form key={record.id}>
//               <Form.Item initialValue={soLuong} name={'soLuong'} className="m-0 p-0">
//                 <Input
//                   className="text-center"
//                   min={1}
//                   type="number"
//                   style={{ width: '64px' }}
//                   onPressEnter={(e) => handleChangeQuantity(record, e.target.value)}
//                 />
//               </Form.Item>
//             </Form>
//           ) : (
//             soLuong
//           )}
//         </>
//       )
//     },
//     {
//       title: 'Tổng tiền',
//       dataIndex: 'soLuong',
//       key: 'total',
//       render: (soLuong, record) => (
//         <div className="text-center text-danger fw-semibold">
//           <FormatCurrency value={record.giaBan * record.soLuong} />
//         </div>
//       )
//     },
//     {
//       title: 'Hành động',
//       dataIndex: 'id',
//       key: 'action',
//       render: (id, record) => (
//         <>
//           {bill.trangThai === 'Chờ thanh toán' ||
//           bill.trangThai === 'Tạo đơn hàng' ||
//           bill.trangThai === 'Chờ xác nhận' ||
//           bill.trangThai === 'Chờ giao' ||
//           bill.trangThai === 'Đang giao' ? (
//             <Space size="middle">
//               <Button onClick={() => handleDeleteBillDetail(record.id)} type="danger">
//                 Xóa
//               </Button>
//             </Space>
//           ) : (
//             <IconTrashX />
//           )}
//         </>
//       )
//     }
//   ];

//   const updateModalTitle = {
//     'Chờ thanh toán': 'Chờ thanh toán',
//     'Tạo đơn hàng': 'Tạo đơn hàng'
//   };

//   return (
//     <>
//       <nav className="breadcrumb fw-semibold">
//         <h3 className="breadcrumb-item">Mã đơn hàng : {bill.ma}</h3>
//       </nav>
//       <div className="container overflow-x-auto mb-3">
//         <Timeline minEvents={6} placeholder maxEvents={billHistory.length} style={{ height: '400px' }}>
//           {billHistory.map((item, index) => (
//             <TimelineEvent
//               key={index}
//               icon={
//                 item.trangThai === 'Tạo đơn hàng'
//                   ? FaPlusCircle
//                   : item.trangThai === 'Chờ xác nhận'
//                     ? FaCheck
//                     : item.trangThai === 'Đang vận chuyển'
//                       ? FaRegFileAlt
//                       : item.trangThai === 'Chờ xác nhận'
//                         ? MdOutlineConfirmationNumber
//                         : item.trangThai === 'Chờ giao hàng'
//                           ? MdPayment
//                           : item.trangThai === 'Đang giao hàng'
//                             ? FaRegFlushed
//                             : item.trangThai === 'Đã thanh toán'
//                               ? FaTruck
//                               : item.trangThai === 'Hoàn thành'
//                                 ? GiConfirmed
//                                 : item.trangThai === 'Đã hủy'
//                                   ? MdOutlineCancelPresentation
//                                   : ''
//               }
//               color={
//                 item.trangThai === 'Chờ xác nhận'
//                   ? '#024FA0'
//                   : item.trangThai === 'Chờ giao hàng'
//                     ? '#F2721E'
//                     : item.trangThai === 'Đang giao hàng'
//                       ? '#50B846'
//                       : item.trangThai === 'Trả 1 phần'
//                         ? '#FFBC05'
//                         : item.trangThai === 'Hủy'
//                           ? '#9C281C'
//                           : '#2DC255'
//               }
//               title={
//                 <h4 className="mt-2">
//                   {item.trangThai === 'Tạo đơn hàng'
//                     ? 'Tạo đơn hàng'
//                     : item.trangThai === 'Chờ xác nhận'
//                       ? 'Chờ xác nhận'
//                       : item.trangThai === 'Đang vận chuyển'
//                         ? 'Đang vận chuyển'
//                         : item.trangThai === 'Chờ giao hàng'
//                           ? 'Chờ giao hàng'
//                           : item.trangThai === 'Đang giao hàng'
//                             ? 'Đang giao hàng'
//                             : item.trangThai === 'Đã thanh toán'
//                               ? 'Đã thanh toán'
//                               : item.trangThai === 'Hoàn thành'
//                                 ? 'Hoàn thành'
//                                 : item.trangThai === 'Hủy'
//                                   ? 'Hủy'
//                                   : ''}
//                 </h4>
//               }
//               subtitle={
//                 <>
//                   {item.ghiChu}
//                   <br />
//                   <FormatDate date={item.ngayTao} />
//                 </>
//               }
//             />
//           ))}
//         </Timeline>
//       </div>
//       <div className="d-flex justify-content-between align-items-center highlight-container">
//         {/* Xác nhận */}
//         <div className="d-flex align-items-center">
//           {bill.trangThai !== 'Hoàn thành' && (
//             <>
//               {bill.trangThai <= 'Chờ xác nhận' && (
//                 <Button type="primary" danger className="me-1" onClick={() => showModal(true)}>
//                   Hủy
//                 </Button>
//               )}
//               {bill.trangThai === 'Hủy' || bill.trangThai === 'Hoàn 1 phần' ? (
//                 ''
//               ) : (
//                 <Button type="primary" onClick={() => showModal(false)}>
//                   {bill.trangThai === 'Giao hàng' ? 'Giao hàng' : bill.trangThai === 'Hoàn thành' ? 'Hoàn thành' : 'Xác nhận'}
//                 </Button>
//               )}
//             </>
//           )}
//         </div>
//         {/* In hóa đơn */}
//         <div className="d-flex align-items-center">
//           {bill.trangThai !== 'Tạo đơn hàng' && bill.trangThai !== 'Chờ xác nhận' && (
//             <Tooltip title="In hóa đơn">
//               <Link className="px-2" target="blank" to={`/export-pdf/${bill.id}`}>
//                 <Button type="primary" icon={<IconPrinter />} />
//               </Link>
//             </Tooltip>
//           )}
//           <BillHistory props={billHistory} />
//         </div>
//       </div>
//       <Divider />
//       {/* Thông tin đơn hàng */}
//       <InfoBill
//         props={bill}
//         onSuccess={() => {
//           loadBill();
//           loadBillHistory();
//         }}
//       />
//       {/* Lịch sử thanh toán */}
//       <PaymentMethod
//         bill={bill}
//         onSucess={() => {
//           loadBillHistory();
//         }}
//       />
//       {/* Thông tin đơn hàng */}
//       <div className="d-flex align-items-center mt-5 align-middle">
//         <h2 level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">
//           Danh sách sản phẩm
//         </h2>
//         {bill.trangThai ? (
//           <ShowProductModal
//             idHoaDon={bill.id}
//             onClose={() => {
//               loadBillDetail();
//               loadBill();
//               loadBillHistory();
//             }}
//           />
//         ) : bill.trangThai === 'Đang giao' ? (
//           <>
//             {['Hoàn thành', 'Hủy'].includes(bill.trangThai) ? (
//               ''
//             ) : (
//               <GivebackAll
//                 bill={bill}
//                 onSuccess={() => {
//                   loadBillDetail();
//                   loadBill();
//                   loadBillHistory();
//                 }}
//               />
//             )}
//           </>
//         ) : (
//           ''
//         )}
//       </div>
//       <Table
//         dataSource={listBillDetail}
//         columns={columns}
//         showHeader={true}
//         rowClassName={(record) => (record.trangThai === true ? 'bg-danger-subtle' : '')}
//         pagination={{
//           showSizeChanger: true,
//           current: currentPage,
//           pageSize: pageSize,
//           pageSizeOptions: [3, 5, 10, 20],
//           total: totalPages * pageSize,
//           onChange: (page, pageSize) => {
//             setCurrentPage(page);
//             setPageSize(pageSize);
//           }
//         }}
//       />

//       <Modal
//         title="Nhập ghi chú"
//         open={isModalOpen}
//         onCancel={handleCancel}
//         footer={
//           <Button form="formNote" type="primary" htmlType="submit">
//             Xác nhận
//           </Button>
//         }
//       >
//         <p>
//           <span className="text-danger">*</span>Chọn mẫu tin nhắn:
//         </p>
//         <Radio.Group
//           className="mb-3"
//           onChange={(e) => {
//             form.setFieldsValue({ ghiChu: e.target.value });
//           }}
//         >
//           <Space direction="vertical">
//             <Radio value={'Đã xác nhận đơn hàng'}>Đã xác nhận đơn hàng</Radio>
//             <Radio value={'Đã bàn giao cho đơn vị vận chuyển'}>Đã bàn giao cho đơn vị vận chuyển</Radio>
//             <Radio value={'Đã xác nhận thông tin thanh toán'}>Đã xác nhận thông tin thanh toán</Radio>
//             <Radio value={'Đơn hàng đã được giao thành công'}>Đơn hàng đã được giao thành công</Radio>
//             <Radio value={'Đã hủy đơn hàng'}>Đã hủy đơn hàng</Radio>
//             <Radio value={''}>Khác</Radio>
//           </Space>
//         </Radio.Group>
//         <Form id="formNote" onFinish={(data) => handleSubmit(data)} form={form}>
//           <Form.Item name={'note'} rules={[{ required: true, message: 'Ghi chú không được để trống!' }]}>
//             <TextArea placeholder="Nhập ghi chú..." />
//           </Form.Item>
//         </Form>
//       </Modal>
//       <br />
//       <hr />
//       {/* Thanh toán chi tiết */}
//       <div className="mt-3" style={{ textAlign: 'right' }}>
//         <h4 className="text-uppercase" style={{ color: 'red', marginBottom: '1rem' }}>
//           Chi tiết thanh toán
//         </h4>
//         <ul className="list-unstyled" style={{ lineHeight: '1.8' }}>
//           <li style={{ marginBottom: '0.5rem' }}>
//             <strong>Tổng tiền hàng:</strong> <FormatCurrency value={bill.tongTien} />
//           </li>
//           <li style={{ marginBottom: '0.5rem' }}>
//             <strong>Phiếu giảm giá:</strong> {bill.phieuGiamGia ? bill.phieuGiamGia : 'Không có'}
//           </li>
//           <li style={{ marginBottom: '0.5rem' }}>
//             <strong>Phí vận chuyển:</strong> <FormatCurrency value={bill.phiShip || 0} />
//           </li>
//           <li className="fw-bold">
//             <strong>Tổng tiền sau giảm giá:</strong> <FormatCurrency value={bill.tongTien} />
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default BillDetail;




import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Modal, Divider, Radio, Space, Button, Table, Tooltip, Form, Input, Carousel } from 'antd';
import { IconPrinter, IconTrashX } from '@tabler/icons-react';
import FormatDate from 'views/utilities/FormatDate';
import Title from "antd/es/typography/Title";
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
import axios from "axios"
import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle } from 'react-icons/md'; // Material Design icons
import { GiConfirmed } from 'react-icons/gi'; // Game Icons


const listStatus = [
    { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON", color: "#024FA0", title: "Tạo hóa đơn", icon: FaRegFileAlt },
    { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN", color: "#9C281C", title: "Chờ xác nhận", icon: FaRegFileAlt },
    { id: 2, name: "Xác nhận", status: "XAC_NHAN", color: "#7925C7", title: "Xác nhận", icon: MdOutlineConfirmationNumber },
    { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN", color: "#F2721E", title: "Chờ vận chuyển", icon: MdPayment },
    { id: 4, name: "Vận chuyển", status: "VAN_CHUYEN", color: "#2DC255", title: "Vận chuyển", icon: FaTruck },
    { id: 5, name: "Thanh toán", status: "DA_THANH_TOAN", color: "#50B846", title: "Đã thanh toán", icon: FaTruckLoading },
    { id: 6, name: "Thành công", status: "THANH_CONG", color: "#2DC255", title: "Thành công", icon: GiConfirmed },
    { id: 7, name: "Đã hủy", status: "DA_HUY", color: "#FFBC05", title: "Đã hủy", icon: MdOutlineCancelPresentation },
    { id: 8, name: "Trả hàng", status: "TRA_HANG", color: "#2DC255", title: "Trả hàng", icon: MdOutlineChangeCircle }
];


const BillDetail = () => {
    const [bill, setBill] = useState([]);
    const [billHistory, setBillHistory] = useState([]);
    const [listBillDetail, setListBillDetail] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(3);
    const { id } = useParams();
    const [form] = Form.useForm();
    const [formGiveback] = Form.useForm();

    const [cancelBill, setCancelBill] = useState(false);

    const loadBill = async () => {
        await request
            .get(`/bill/${id}`)
            .then((response) => {
                setBill(response);
                console.log("Bill ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq", response)
                console.log("Bill ddddddddddmmmmmmmmmmmmqqqqqqqqqqqqqq", id)
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
                    sizePage: pageSize,
                },
            })
            .then((response) => {
                setListBillDetail(response.data);
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
                console.log("Bill History:", response.data);
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

    const handleDeleteBillDetail = (id) => {
        Modal.confirm({
            title: "Xác nhận",
            maskClosable: true,
            content: "Xác nhận xóa khỏi giỏ hàng ?",
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: () => {
                request
                    .remove(`/bill-detail/${id}`)
                    .then((response) => {
                        toast.success("Xóa thành công!");
                        loadBillDetail();
                        loadBill();
                        loadBillHistory();
                    })
                    .catch((e) => {
                        console.log(e);
                        toast.error(e.response.data);
                    });
            },
        });
    };

    const handleChangeQuantity = (record, quantity) => {
        request
            .get(`/bill-detail/update-quantity/${record.id}`, {
                params: {
                    newQuantity: quantity,
                    price:
                        record.status === true
                            ? record.price
                            : record.discountValue === null
                                ? record.shoePrice
                                : record.discountValue,
                },
            })
            .then((response) => {
                loadBillDetail();
                loadBill();
                loadBillHistory();
                toast.success("Cập nhật thành công!");
            })
            .catch((e) => {
                console.log(e);
                toast.error(e.response.data);
            });
    };

    const handleGiveBack = (id) => {
        Modal.confirm({
            title: "Xác nhận",
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
                                    toast.success("Trả hàng thành công!");
                                })
                                .catch((e) => {
                                    console.log(e);
                                    toast.error(e.response.data);
                                });
                        }}
                    >
                        <Form.Item
                            label="Số lượng"
                            name={"quantity"}
                            rules={[
                                { required: true, message: "Số lượng không được để trống!" },
                            ]}
                        >
                            <InputNumber
                                placeholder="Nhập số lượng muốn trả hàng..."
                                className="w-100"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Lý do trả hàng"
                            name={"note"}
                            rules={[
                                {
                                    required: true,
                                    message: "Lý do trả hàng không được để trống!",
                                },
                            ]}
                        >
                            <TextArea placeholder="Nhập lý do trả hàng..." />
                        </Form.Item>
                    </Form>
                </>
            ),
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                formGiveback.submit();
            },
        });
    };

    //Modal của Xác nhận đơn hàng 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (isCancel) => {
        setCancelBill(isCancel);
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

    const idNhanVien = 2; //Day la nhan vien  đang nhặp 

    const handleSubmitXacNhan = (data) => {
        let updatedStatus;
        if (bill.invoiceStatus === 'CHO_XAC_NHAN') {
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
            idHD: id,  // ID hóa đơn phải có giá trị hợp lệ
            status: updatedStatus,
            note: data.note,
        };

    
        console.log("idNhanVien:", idNhanVien);

        // Gửi request PUT tới server
        axios.put(`http://localhost:8080/api/bill/change-status`, requestData, {
            params: {
                idNhanVien: idNhanVien, // Truyền idNhanVien nếu có, nếu không thì null
            },
        })
            .then((response) => {
                loadBill(); // Tải lại danh sách hóa đơn
                loadBillDetail(); // Tải lại chi tiết hóa đơn
                loadBillHistory(); // Tải lại lịch sử hóa đơn
                form.resetFields(); // Reset lại form sau khi gửi
                toast.success("Thay đổi trạng thái đơn hàng thành công!"); // Thông báo thành công
            })
            .catch((e) => {
                console.error("Lỗi khi thay đổi trạng thái:", e);
                toast.error("Không thể thay đổi trạng thái. Chi tiết lỗi: " + (e.response?.data?.message || e.message)); // Hiển thị lỗi chi tiết
            });

        setIsModalOpen(false); // Đóng modal sau khi gửi
    };

    const handleSubmitQuayLai = (data) => {
        const requestData = {
            actionDescription: data.note, // Note từ form
        };

    

        // Gửi request PUT tới server
        request.put(`/bill/roll-back-bill/${id}`, requestData, {
            // params: {
            //     idNV: idNhanVien,
            // },
        })
            .then((response) => {
                loadBill(); // Tải lại danh sách hóa đơn
                loadBillDetail(); // Tải lại chi tiết hóa đơn
                loadBillHistory(); // Tải lại lịch sử hóa đơn
                form.resetFields(); // Reset lại form sau khi gửi
                toast.success("Thay đổi trạng thái đơn hàng thành công!"); // Thông báo thành công
            })
            .catch((e) => {
                console.error("Lỗi khi thay đổi trạng thái:", e);
                toast.error("Không thể thay đổi trạng thái. Chi tiết lỗi: " + e.response?.data?.message || e.message); // Hiển thị lỗi chi tiết
            });

        setIsModalQuayLai(false); // Đóng modal sau khi gửi
    };

    //Nút hủy 
    const handleCancelBillStatus = (data) => {

        const requestData = {
            description: data.note,
        };


        // Gửi request PUT tới server
        axios.put(`bill/cancel-status/${id}`, requestData, {
            params: {
                idNhanVien: idNhanVien, // ID nhân viên hiện tại
            },
        })
            .then((response) => {
                loadBill(); // Tải lại danh sách hóa đơn
                loadBillDetail(); // Tải lại chi tiết hóa đơn
                loadBillHistory(); // Tải lại lịch sử hóa đơn
                form.resetFields(); // Reset lại form sau khi gửi
                toast.success("Hủy đơn hàng thành công!"); // Thông báo thành công

            })
            .catch((e) => {
                console.error("Chỉ có admin mới có thể hủy hóa đơn:", e);
                toast.error("Chỉ có admin mới có thể hủy hóa đơn: "); // Hiển thị lỗi chi tiết\
                //Cái này giúp lấy ra lỗi của be lên 
                // const errorMessage = e.response?.data?.message || 'Chỉ có admin mới có thể hủy hóa đơn';
                // toast.error(errorMessage);
            });
        setIsModalCanCelBill(false);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'indexs',
            key: 'indexs'
        },
        {
            title: 'Thông tin sản phẩm',
            dataIndex: 'image',
            key: 'image',
            render: (item) => (
                <>
                    <Carousel autoplay autoplaySpeed={500} dots={false} arrows={false} style={{ width: '100px' }}>
                        {item && item.split(',').map((image, index) => (
                            <div key={index} className="" style={{ height: '100px' }}>
                                <img src={image} alt="images" style={{ width: '100px', height: '110px' , borderRadius:'10px' }} className="object-fit-cover" />
                            </div>
                        ))}

                    </Carousel>
                </>
            )
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'priceBillDetail',
            key: 'priceBillDetail',
            render: (productName, record) => (
                <ul className="list-unstyled">
                    <li className="fw-semibold">{typeof productName === 'string' ? productName : 'No product name'}</li>
                    <li>
                        Đơn giá:
                        <span className="text-danger">
                            <FormatCurrency value={record.priceBillDetail} />
                        </span>
                    </li>
                </ul>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <>
                    {bill.status <= 4 ? (
                        <Form key={record.id}>
                            <Form.Item initialValue={typeof quantity === 'number' && !isNaN(quantity) ? quantity : 'No quantity'} className="m-0 p-0">
                                <Input
                                    className="text-center"
                                    min={1}
                                    type="number"
                                    style={{ width: '64px' }}
                                    onPressEnter={(e) => handleChangeQuantity(record, e.target.value)}
                                />
                            </Form.Item>
                        </Form>
                    ) : (
                        typeof quantity === 'number' ? quantity : 'No quantity'
                    )}
                </>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'soLuong',
            key: 'total',
            render: (soLuong, record) => (
                <div className="text-center text-danger fw-semibold">
                    <FormatCurrency value={record.priceProductDetail * (record.quantity || 0)} />
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const statusObj = listStatus.find(item => item.id === status);

                return (
                    <div className="text-center fw-semibold">
                        {statusObj ? (
                            <>
                                <span>{statusObj.icon}</span>
                                <span className="ms-2">{statusObj.name}</span>
                            </>
                        ) : (
                            <span>Không xác định</span>
                        )}
                    </div>
                );
            },
        },

        {
            title: "Hành động",
            dataIndex: "id",
            key: "action",
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
                        ""
                        // <IconTrashX />
                    )}
                </>
            )
        },
    ];


    return (
        <>
            <nav className="breadcrumb fw-semibold">
                <Link
                    className="breadcrumb-item bee-text text-decoration-none"
                    to={"/admin/bill"}
                >
                    Danh sách hóa đơn
                </Link>
                <span className="breadcrumb-item">Hóa đơn {bill.code}</span>
            </nav>

            <div className="container overflow-x-auto mb-3">
                <Timeline
                    minEvents={8}
                    placeholder
                    maxEvents={billHistory.length}
                    style={{ height: "400px" }}
                >
                    {billHistory.map((item, index) => (
                        <TimelineEvent
                            key={index}

                            icon={
                                // Gọi icon dưới dạng component
                                listStatus.find(status => status.status === item.status)?.icon || ""
                            }

                            color={
                                // Lấy color từ listStatus
                                listStatus.find(status => status.status === item.status)?.color || ""
                            }
                            title={
                                // Lấy title từ listStatus
                                <h6 className="mt-2">
                                    {listStatus.find(status => status.status === item.status)?.title || "Không xác định"}
                                </h6>
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
                <div className=" mx-3 d-flex" >
                    {bill.invoiceStatus !== 'THANH_CONG' || bill.invoiceStatus !== 'TRA_HANG' ? (
                        <>
                            {(bill.invoiceStatus === 'TAO_HOA_DON' || bill.invoiceStatus === 'CHO_XAC_NHAN'
                                || bill.invoiceStatus === 'XAC_NHAN' || bill.invoiceStatus === 'CHO_VAN_CHUYEN'
                                || bill.invoiceStatus === 'VAN_CHUYEN' || bill.invoiceStatus === 'DA_THANH_TOAN') && (
                                    <div>
                                        <Button
                                            type="primary"
                                            className="me-1"
                                            onClick={() => showModal(true)}
                                        >
                                            {bill.invoiceStatus === 'TAO_HOA_DON' && "Chờ xác nhận"}
                                            {bill.invoiceStatus === 'CHO_XAC_NHAN' && "Xác nhận"}
                                            {bill.invoiceStatus === 'XAC_NHAN' && "Chờ vận chuyển"}
                                            {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && "Vận chuyển"}
                                            {bill.invoiceStatus === 'VAN_CHUYEN' && "Thanh toán"}
                                            {bill.invoiceStatus === 'DA_THANH_TOAN' && "Thành công"}
                                        </Button>
                                    </div>
                                )}

                            {(bill.invoiceStatus === 'TAO_HOA_DON' || bill.invoiceStatus === 'CHO_XAC_NHAN'
                                || bill.invoiceStatus === 'XAC_NHAN' || bill.invoiceStatus === 'CHO_VAN_CHUYEN') && (
                                    <div>
                                        <Button
                                            style={{ backgroundColor: 'red' }}
                                            className="me-1"
                                            onClick={() => showModalCancelBill(true)}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                )}


                        </>
                    ) : (
                        ""
                    )}
                    {(bill.invoiceStatus !== 'TAO_HOA_DON') && (
                        <div>
                            <Button
                                style={{ backgroundColor: 'Yellow' }}
                                className="me-1"
                                onClick={() => showModalQuayLai(true)}
                            >
                                Quay lại
                            </Button>
                        </div>
                    )}
                </div>
                {/* Modal của xác nhận đơn hàng  */}
                <Modal
                    title={
                        bill.invoiceStatus === 'TAO_HOA_DON' ? "Chờ xác nhận" :
                            bill.invoiceStatus === 'CHO_XAC_NHAN' ? "Xác nhận đơn hàng" :
                                bill.invoiceStatus === 'XAC_NHAN' ? "Chờ vận chuyển đơn hàng" :
                                    bill.invoiceStatus === 'CHO_VAN_CHUYEN' ? "Vận chuyển đơn hàng" :
                                        bill.invoiceStatus === 'VAN_CHUYEN' ? "Thanh toán đơn hàng" :
                                            bill.invoiceStatus === 'DA_THANH_TOAN' ? "Thành công" :
                                                "Xác nhận"
                    }
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={
                        <Button form="formNote" type="primary" htmlType="submit">
                            {bill.invoiceStatus === 'CHO_XAC_NHAN' && "Xác nhận"}
                            {bill.invoiceStatus === 'XAC_NHAN' && "Chờ vận chuyển"}
                            {bill.invoiceStatus === 'CHO_VAN_CHUYEN' && "Vận chuyển"}
                            {bill.invoiceStatus === 'DA_THANH_TOAN' && "Thành công"}
                        </Button>
                    }
                >
                    <Form
                        id="formNote"
                        onFinish={handleSubmitXacNhan}
                        form={form}
                        layout="vertical" // Điều chỉnh layout cho đẹp hơn
                    >
                        <Form.Item
                            name="note"
                            label="Ghi chú"
                            rules={[
                                { required: true, message: "Ghi chú không được để trống!" },
                            ]}
                        >
                            <TextArea placeholder="Nhập ghi chú..." rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
                {/* Modal của quay lại trạng thái   */}
                <Modal
                    title={
                        "Quay lại"
                    }
                    open={isModalQuayLai}
                    onCancel={handleCancelQuayLai}
                    footer={
                        <Button form="formNote" type="primary" htmlType="submit">
                            Đồng ý
                        </Button>
                    }
                >
                    <Form
                        id="formNote"
                        onFinish={handleSubmitQuayLai}
                        form={form}
                        layout="vertical" // Điều chỉnh layout cho đẹp hơn
                    >
                        <Form.Item
                            name="note"
                            label="Ghi chú"
                            rules={[
                                { required: true, message: "Ghi chú không được để trống!" },
                                // { min: 30, message: "Ghi chú phải có ít nhất 30 ký tự!" }, // Thêm quy tắc kiểm tra độ dài
                            ]}
                        >
                            <TextArea placeholder="Nhập ghi chú..." rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
                {/* Modal của hủy hóa đơn  */}
                <Modal
                    title={
                        "Hủy hóa đơn"
                    }
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
                        layout="vertical" // Điều chỉnh layout cho đẹp hơn
                    >
                        <Form.Item
                            name="note"
                            label="Lí do"
                            rules={[
                                { required: true, message: "Ghi chú không được để trống!" },
                                { min: 30, message: "Ghi chú phải có ít nhất 30 ký tự!" }, // Thêm quy tắc kiểm tra độ dài
                            ]}
                        >
                            <TextArea placeholder="Nhập lí do..." rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Bu tuuon chi tiết và in háo đơn*/}
                <div className="d-flex align-items-center">
                    {bill.status !== 1 && bill.status !== 2 && (
                        <Tooltip title="In hóa đơn">
                            <Link
                                className="px-2"
                                target="blank"
                                to={`/export-pdf/${bill.id}`}
                            >
                                <Button
                                    type="primary"
                                    icon={<i className="fa-regular fa-file-lines"></i>}
                                ></Button>
                            </Link>
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
                }}
            />

            {/* Thông tin đơn hàng */}
            <div className="mt-3 order-details-container">
                <div className="d-flex align-items-center mb-4 align-middle">
                    <Title level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">
                        Danh sách sản phẩm
                    </Title>
                    {bill.invoiceStatus === 'TAO_HOA_DON' ||
                        bill.invoiceStatus === 'CHO_XAC_NHAN' ||
                        bill.invoiceStatus === 'XAC_NHAN' ||
                        bill.invoiceStatus === 'CHO_VAN_CHUYEN' ? (
                        <ShowProductModal
                            idBill={id}
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

        </>
    );
};

export default BillDetail;
