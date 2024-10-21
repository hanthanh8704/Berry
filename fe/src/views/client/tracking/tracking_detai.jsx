
//Bản tiếng Anh

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Thêm dòng này
import { message, InputNumber, Col } from 'antd';
import { detailHoaDon } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Card, Typography, Row, Carousel } from 'antd';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import TimeLine from '../../client/account/timline.jsx'; // Import TimeLine component
const { Title, Text } = Typography;
import './tracking_detail.css';

const listStatus = [
    { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON" },
    { id: 2, name: "Chờ xác nhận", status: "CHO_XAC_NHAN" },
    { id: 3, name: "Xác nhận", status: "XAC_NHAN" },
    { id: 4, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN" },
    { id: 5, name: "Vận chuyển", status: "VAN_CHUYEN" },
    { id: 6, name: "Thanh toán", status: "DA_THANH_TOAN" },
    { id: 7, name: "Thành công", status: "THANH_CONG" },
];

const TrackingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hoaDonDetail, setHoaDonDetail] = useState();
    const [billHistory, setBillHistory] = useState([]);
    const { ma } = useParams(); // ID sản phẩm
    const totalPayment = hoaDonDetail?.totalMoney + hoaDonDetail?.shippingFee - hoaDonDetail?.discountAmount;
    const statusPresent = hoaDonDetail?.invoiceStatus;


    useEffect(() => {
        console.log("Current ma:", ma); // Log giá trị ma để kiểm tra
        DetailHoaDon();
    }, [ma]);

    const DetailHoaDon = () => {
        detailHoaDon(ma)
            .then(response => {
                console.log("API response dddddddddddddmmmmmm:", response.data); // Log toàn bộ response để kiểm tra
                setHoaDonDetail(response.data); // Set product 
                setBillHistory(response.data.billHistory); // Set product data
            })
            .catch(error => {
                console.error('Error fetching Hoa Don Detail:', error);
            });
    };
    console.log("statusPresent",statusPresent); 
    return (
        <div style={{ padding: '20px' }}>
            <Card style={{ backgroundColor: 'whitesmoke' }}>
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
                <Card style={{ marginTop: '20px', backgroundColor: 'white' }}>
                    <Title level={5}>Lịch sử đơn hàng</Title>

                    {/* Kiểm tra hoaDonDetail trước khi truyền props cho TimeLine */}
                    <TimeLine
                        style={{ width: "100%" }}
                        listStatus={listStatus}
                        data={billHistory}
                        statusPresent={statusPresent}
                    />
                </Card>

                <Card style={{ marginTop: '20px', backgroundColor: 'white' }}>
                    <Title level={5}>ĐỊA CHỈ NHẬN HÀNG</Title>
                    <Text>Địa chỉ : {hoaDonDetail?.recipientName}</Text>
                    <br />
                    <Text>Số điện thoại: {hoaDonDetail?.recipientPhone}</Text>
                    <br />
                    <Text>{hoaDonDetail?.address}</Text>
                </Card>

                <Card style={{ marginTop: '20px', backgroundColor: 'white' }}>
                    {hoaDonDetail ? (
                        <div>
                            {hoaDonDetail?.billDetails?.map((chiTiet, index) => (
                                <div key={index} className="d-flex align-items-center justify-content-between" style={{ marginBottom: '20px' }}>
                                    <div className="d-flex">
                                        {/* Carousel cho hình ảnh sản phẩm */}
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
                                            </Text> <br />
                                            <Text style={{ fontSize: '14px', color: 'red' }}>
                                                <FormatCurrency value={chiTiet.price} />
                                            </Text>
                                            <br />
                                            <Text style={{ fontSize: '14px' }}>
                                                X{chiTiet?.quantity}
                                            </Text>
                                        </div>
                                    </div>
                                    <div>
                                        <Col>
                                            <InputNumber
                                                min={chiTiet.quantity}
                                                max={chiTiet.quantity} // Sử dụng số lượng từ sản phẩm hiện tại
                                                defaultValue={chiTiet.quantity} // Giá trị mặc định là số lượng sản phẩm
                                            />
                                        </Col>
                                    </div>
                                    <div>
                                        <Text style={{ fontSize: '14px', color: 'red' }}>
                                            <FormatCurrency value={chiTiet.price} />
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
                                <Text strong> <FormatCurrency value={hoaDonDetail?.discountAmount} /></Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '10px' }}>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Tổng thanh toán:</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'left' }}>
                                <Text strong style={{ color: 'red' }}><FormatCurrency value={totalPayment} /></Text>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Card>
        </div>
    );
};

export default TrackingDetail;
