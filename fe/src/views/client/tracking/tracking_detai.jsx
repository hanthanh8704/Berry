//Bản tiếng Việt
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { message } from 'antd';
// import { detailHoaDon, findByMaAndSDT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { Card, Button, Typography, Steps, Row, Carousel, Col } from 'antd';
// import { CheckCircleOutlined } from '@ant-design/icons';
// import FormatCurrency from '../../utilities/FormatCurrency.jsx';
// const { Title, Text } = Typography;
// const { Step } = Steps;
// import { Link } from 'react-router-dom'; // nếu bạn dùng react-router-dom
// import './tracking_detail.css';
// const TrackingDetail = () => {

//     const location = useLocation();
//     const navigate = useNavigate();
//     const [hoaDonDetail, setHoaDonDetail] = useState();
//     const { ma } = useParams(); //ID Sản phẩm 

//     useEffect(() => {
//         console.log("Current ma:", ma); // Log giá trị ma để kiểm tra
//         DetailHoaDon();
//     }, [ma]);

//     const DetailHoaDon = () => {
//         detailHoaDon(ma)
//             .then(response => {
//                 console.log("API response:", response.data); // Log toàn bộ response để kiểm tra
//                 setHoaDonDetail(response.data); // Set product data
//             })
//             .catch(error => {
//                 console.error('Error fetching San Pham CT:', error);
//             });
//     };

//     const determineCurrentStep = (trangThaiGiaoHang) => {
//         switch (trangThaiGiaoHang) {
//             case "Hoàn thành":
//                 return 5;
//             case "Đã giao hàng":
//                 return 4;
//             case "Đang giao hàng":
//                 return 3;
//             case "Đang chuẩn bị hàng":
//                 return 2;
//             case "Đã xác nhận":
//                 return 1;
//             default: // Chờ xác nhận
//                 return 0;
//         }
//     };

//     return (
//         <div style={{ padding: '20px' }}>
//             <Card>
//                 <Row className="d-flex" style={{ marginBottom: '10px' }}>
//                     <Typography.Text strong>
//                         <Link to="/home" style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
//                             Trang chủ
//                         </Link>
//                     </Typography.Text>

//                     <Typography.Text style={{ color: 'black', marginRight: 10 }}>|</Typography.Text>
//                     <Typography.Text strong>
//                         <Link to="/tracking" style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
//                             Tra cứu
//                         </Link>
//                     </Typography.Text>

//                     <Typography.Text style={{ color: 'black', marginRight: 10 }}>|</Typography.Text>

//                     <Typography.Text>
//                         {hoaDonDetail ? (
//                             <Link to={`/tracking/${hoaDonDetail.ma}`} style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
//                                 {hoaDonDetail.ma}
//                             </Link>
//                         ) : (
//                             <Text>Loading...</Text>
//                         )}

//                     </Typography.Text>
//                 </Row>
//                 <Card style={{ marginTop: '20px', backgroundColor: 'whitesmoke' }}>
//                     <Title level={5}>Lịch sử đơn hàng</Title>

//                     {/* Hàm xác định trạng thái hiện tại */}
//                     <Steps current={determineCurrentStep(hoaDonDetail?.trangThaiGiaoHang)} style={{ marginBottom: '20px' }}>
//                         <Step
//                             title="Chờ xác nhận"
//                             description={hoaDonDetail?.ngayTao}
//                             icon={<CheckCircleOutlined />}
//                         />
//                         <Step
//                             title="Đã xác nhận"
//                             description={hoaDonDetail?.ngaySua ? hoaDonDetail?.ngaySua : 'Thời gian không có sẵn'}
//                             icon={<CheckCircleOutlined />}
//                         />
//                         <Step
//                             title="Đang chuẩn bị hàng"
//                             description={hoaDonDetail?.ngaySua ? hoaDonDetail?.ngaySua : 'Thời gian không có sẵn'}
//                             icon={<CheckCircleOutlined />}
//                         />
//                         <Step
//                             title="Đang giao hàng"
//                             description={hoaDonDetail?.ngaySua ? hoaDonDetail?.ngaySua : 'Thời gian không có sẵn'}
//                             icon={<CheckCircleOutlined />}
//                         />
//                         <Step
//                             title="Đã giao hàng"
//                             description={hoaDonDetail?.ngaySua ? hoaDonDetail?.ngaySua : 'Thời gian không có sẵn'}
//                             icon={<CheckCircleOutlined />}
//                         />
//                         <Step
//                             title="Hoàn thành"
//                             description={hoaDonDetail?.ngaySua ? hoaDonDetail?.ngaySua : 'Thời gian không có sẵn'}
//                             icon={<CheckCircleOutlined />}
//                         />
//                     </Steps>
//                 </Card>

//                 <Card style={{ marginTop: '20px', backgroundColor: 'whitesmoke' }}>
//                     <Title level={5}>ĐỊA CHỈ NHẬN HÀNG</Title>
//                     <Text>Địa chỉ : {hoaDonDetail?.tenNguoiNhan}</Text>
//                     <br />
//                     <Text>Số điện thoại: {hoaDonDetail?.soDienThoaiNguoiNhan}</Text>
//                     <br />
//                     <Text>{hoaDonDetail?.diaChi}</Text>
//                 </Card>


//                 <Card style={{ marginTop: '20px', backgroundColor: 'whitesmoke' }}>
//                     {hoaDonDetail ? (
//                         <div>
//                             {hoaDonDetail?.hoaDonChiTietList?.map((chiTiet, index) => (
//                                 <div key={index} className="d-flex align-items-center justify-content-between" style={{ marginBottom: '20px' }}> {/* Add marginBottom to separate each record */}
//                                     <div className="d-flex">
//                                         <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ height: '100px', width: '100px' }}>
//                                             {chiTiet?.chiTietSanPham?.anhList?.map((anh, subIndex) => (
//                                                 <div key={`${index}-${subIndex}`} className="image-container">
//                                                     <img src={anh.anh} alt="images" className="object-fit-cover" />
//                                                     {chiTiet?.chiTietSanPham?.phanTramGiam ? (
//                                                         <p className="discount-badge">
//                                                             {-chiTiet?.chiTietSanPham?.phanTramGiam}%
//                                                         </p>
//                                                     ) : null}
//                                                 </div>
//                                             ))}
//                                         </Carousel>

//                                         <div className="mx-4">
//                                             <Text strong style={{ fontSize: '18px' }}>
//                                                 {chiTiet?.chiTietSanPham?.idSanPham?.ten}{" "}
//                                                 {chiTiet?.chiTietSanPham?.idThuongHieu?.ten}{" "}
//                                                 "{chiTiet?.chiTietSanPham?.idCoAo?.ten}"{" "}
//                                                 "{chiTiet?.chiTietSanPham?.idTayAo?.ten}"
//                                             </Text>
//                                             <br />
//                                             <Text style={{ fontSize: '14px' }}>
//                                                 Phân loại hàng: {chiTiet?.chiTietSanPham?.idMauSac?.ten}{", "}
//                                                 {chiTiet?.chiTietSanPham?.idKichCo?.ten}{" "}
//                                             </Text>
//                                             <br />
//                                             <Text style={{ fontSize: '14px' }}>
//                                                 Số lượng: {chiTiet?.soLuong}
//                                             </Text>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <Text style={{ fontSize: '14px', color: 'red' }}>
//                                             <FormatCurrency value={chiTiet?.chiTietSanPham?.giaMoi === 0
//                                                 ? chiTiet?.chiTietSanPham?.giaBan * chiTiet?.soLuong
//                                                 : chiTiet?.chiTietSanPham?.giaMoi * chiTiet?.soLuong} />
//                                         </Text>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p>Đang tải dữ liệu...</p>
//                     )}

//                     <hr />

//                     <div className="text-end my-5">
//                         <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>Thông tin đơn hàng</Title>

//                         <Row gutter={16} style={{ marginBottom: '10px' }}>
//                             <Col span={12} style={{ textAlign: 'right' }}>
//                                 <Text>Tổng tiền hàng:</Text>
//                             </Col>
//                             <Col span={12} style={{ textAlign: 'left' }}>
//                                 <Text strong><FormatCurrency value={hoaDonDetail?.tongTien} /></Text>
//                             </Col>
//                         </Row>

//                         <Row gutter={16} style={{ marginBottom: '10px' }}>
//                             <Col span={12} style={{ textAlign: 'right' }}>
//                                 <Text>Phí Ship:</Text>
//                             </Col>
//                             <Col span={12} style={{ textAlign: 'left' }}>
//                                 <Text strong><FormatCurrency value={hoaDonDetail?.phiShip} /></Text>
//                             </Col>
//                         </Row>

//                         <Row gutter={16} style={{ marginBottom: '10px' }}>
//                             <Col span={12} style={{ textAlign: 'right' }}>
//                                 <Text>Giảm giá:</Text>
//                             </Col>
//                             <Col span={12} style={{ textAlign: 'left' }}>
//                                 <Text strong><FormatCurrency value={hoaDonDetail?.soTienDuocGiam} /></Text>
//                             </Col>
//                         </Row>

//                         <Row gutter={16} style={{ marginBottom: '10px' }}>
//                             <Col span={12} style={{ fontSize: '20px', textAlign: 'right' }}>
//                                 <Text>Tổng thanh toán:</Text>
//                             </Col>
//                             <Col span={12} style={{ textAlign: 'left' }}>
//                                 <Text strong style={{ fontSize: '20px', color: 'red' }}><FormatCurrency value={hoaDonDetail?.tongTien + hoaDonDetail?.phiShip - hoaDonDetail?.soTienDuocGiam} /></Text>
//                             </Col>
//                         </Row>
//                     </div>
//                 </Card>



//             </Card>
//         </div >
//     )
// };

// export default TrackingDetail;



//Bản tiếng Anh

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { detailHoaDon, findByMaAndSDT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Card, Button, Typography, Steps, Row, Carousel, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
const { Title, Text } = Typography;
const { Step } = Steps;
import { Link } from 'react-router-dom'; // nếu bạn dùng react-router-dom
import './tracking_detail.css';
const TrackingDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [hoaDonDetail, setHoaDonDetail] = useState();
    const { ma } = useParams(); //ID Sản phẩm 

    useEffect(() => {
        console.log("Current ma:", ma); // Log giá trị ma để kiểm tra
        DetailHoaDon();
    }, [ma]);

    const DetailHoaDon = () => {
        detailHoaDon(ma)
            .then(response => {
                console.log("API response:", response.data); // Log toàn bộ response để kiểm tra
                setHoaDonDetail(response.data); // Set product data
            })
            .catch(error => {
                console.error('Error fetching San Pham CT:', error);
            });
    };

    const determineCurrentStep = (trangThaiGiaoHang) => {
        switch (trangThaiGiaoHang) {
            case 5:
                return 5;
            case 4:
                return 4;
            case 3:
                return 3;
            case 2:
                return 2;
            case 1:
                return 1;
            default: // Chờ xác nhận
                return 0;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card>
                <Row className="d-flex" style={{ marginBottom: '10px' }}>
                    <Typography.Text strong>
                        <Link to="/home" style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
                            Trang chủ
                        </Link>
                    </Typography.Text>

                    <Typography.Text style={{ color: 'black', marginRight: 10 }}>|</Typography.Text>
                    <Typography.Text strong>
                        <Link to="/tracking" style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
                            Tra cứu
                        </Link>
                    </Typography.Text>

                    <Typography.Text style={{ color: 'black', marginRight: 10 }}>|</Typography.Text>

                    <Typography.Text>
                        {hoaDonDetail ? (
                            <Link to={`/tracking/${hoaDonDetail.code}`} style={{ color: 'black', textDecoration: 'none', marginRight: 10 }}>
                                {hoaDonDetail.code}
                            </Link>
                        ) : (
                            <Text>Loading...</Text>
                        )}

                    </Typography.Text>
                </Row>
                <Card style={{ marginTop: '20px', backgroundColor: 'whitesmoke' }}>
                    <Title level={5}>Lịch sử đơn hàng</Title>

                    {/* Hàm xác định trạng thái hiện tại */}
                    <Steps current={determineCurrentStep(hoaDonDetail?.invoiceStatus)} style={{ marginBottom: '20px' }}>
                        <Step
                            title="Chờ xác nhận"
                            description={hoaDonDetail?.createdAt}
                            icon={<CheckCircleOutlined />}
                        />
                        <Step
                            title="Đã xác nhận"
                            description={hoaDonDetail?.updatedAt ? hoaDonDetail?.updatedAt : 'Thời gian không có sẵn'}
                            icon={<CheckCircleOutlined />}
                        />
                        <Step
                            title="Đang chuẩn bị hàng"
                            description={hoaDonDetail?.updatedAt ? hoaDonDetail?.updatedAt : 'Thời gian không có sẵn'}
                            icon={<CheckCircleOutlined />}
                        />
                        <Step
                            title="Đang giao hàng"
                            description={hoaDonDetail?.updatedAt ? hoaDonDetail?.updatedAt : 'Thời gian không có sẵn'}
                            icon={<CheckCircleOutlined />}
                        />
                        <Step
                            title="Đã giao hàng"
                            description={hoaDonDetail?.updatedAt ? hoaDonDetail?.updatedAt : 'Thời gian không có sẵn'}
                            icon={<CheckCircleOutlined />}
                        />
                        <Step
                            title="Hoàn thành"
                            description={hoaDonDetail?.updatedAt ? hoaDonDetail?.updatedAt : 'Thời gian không có sẵn'}
                            icon={<CheckCircleOutlined />}
                        />
                    </Steps>
                </Card>

                <Card style={{ marginTop: '20px', backgroundColor: 'whitesmoke' }}>
                    <Title level={5}>ĐỊA CHỈ NHẬN HÀNG</Title>
                    <Text>Địa chỉ : {hoaDonDetail?.recipientName}</Text>
                    <br />
                    <Text>Số điện thoại: {hoaDonDetail?.recipientPhone}</Text>
                    <br />
                    <Text>{hoaDonDetail?.address}</Text>
                </Card>


                <Card style={{ marginTop: '20px', backgroundColor: 'whitesmoke' }}>
                    {hoaDonDetail ? (
                        <div>
                            {hoaDonDetail?.billDetails?.map((chiTiet, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-between" style={{ marginBottom: '20px' }}> {/* Add marginBottom to separate each record */}
                                    <div className="d-flex">
                                        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ height: '100px', width: '100px' }}>
                                            {chiTiet?.productDetail?.images?.map((anh, subIndex) => (
                                                <div key={`${index}-${subIndex}`} className="image-container">
                                                    <img src={anh.url} alt="images" className="object-fit-cover" />
                                                    {chiTiet?.productDetail?.discountPercentage ? (
                                                        <p className="discount-badge">
                                                            {-chiTiet?.productDetail?.discountPercentage}%
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </Carousel>

                                        <div className="mx-4">
                                            <Text strong style={{ fontSize: '18px' }}>
                                                {chiTiet?.productDetail?.product?.name}{" "}
                                                {chiTiet?.productDetail?.brand?.name}{" "}
                                                "{chiTiet?.productDetail?.collar?.name}"{" "}
                                                "{chiTiet?.productDetail?.sleeve?.name}"
                                            </Text>
                                            <br />
                                            <Text style={{ fontSize: '14px' }}>
                                                Phân loại hàng: {chiTiet?.productDetail?.color?.name}{", "}
                                                {chiTiet?.productDetail?.size?.name}{" "}
                                            </Text>
                                            <br />
                                            <Text style={{ fontSize: '14px' }}>
                                                Số lượng: {chiTiet?.quantity}
                                            </Text>
                                        </div>
                                    </div>

                                    <div>
                                        <Text style={{ fontSize: '14px', color: 'red' }}>
                                            <FormatCurrency value={chiTiet?.productDetail?.discountPrice === 0
                                                ? chiTiet?.productDetail?.price * chiTiet?.quantity
                                                : chiTiet?.productDetail?.discountPrice * chiTiet?.quantity} />
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}

                    <hr />

                    <div className="text-end my-5">
                        <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>Thông tin đơn hàng</Title>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Tổng tiền hàng:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong><FormatCurrency value={hoaDonDetail?.totalMoney} /></Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Phí Ship:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong><FormatCurrency value={hoaDonDetail?.shippingFee} /></Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Giảm giá:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong><FormatCurrency value={hoaDonDetail?.discountAmount} /></Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ fontSize: '20px', textAlign: 'right' }}>
                                <Text>Tổng thanh toán:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong style={{ fontSize: '20px', color: 'red' }}><FormatCurrency value={hoaDonDetail?.totalMoney + hoaDonDetail?.shippingFee - hoaDonDetail?.discountAmount} /></Text>
                            </Col>
                        </Row>
                    </div>
                </Card>



            </Card>
        </div >
    )
};

export default TrackingDetail;
