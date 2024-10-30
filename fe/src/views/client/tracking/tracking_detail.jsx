
//Bản tiếng Anh

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Thêm dòng này
import { message, InputNumber, Col } from 'antd';
import { detailHoaDon } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Card, Typography, Row, Carousel } from 'antd';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
const { Title, Text } = Typography;
import './tracking_detail.css';
import FormatDate from 'views/utilities/FormatDate';
import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle } from 'react-icons/md'; // Material Design icons
import { GiConfirmed } from 'react-icons/gi'; // Game Icons
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';

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
    console.log("statusPresent", statusPresent);

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
                                            {item.note}
                                            <br />
                                            <FormatDate date={item.createdAt} />
                                        </>
                                    }
                                />
                            ))}
                        </Timeline>
                    </div>
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
                                <div key={index} className="d-flex align-items-center justify-content-between" style={{ marginBottom: '60px' }}>
                                    <div className="d-flex">
                                        {/* Carousel cho hình ảnh sản phẩm */}
                                        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{  height: '100px', width: '100px' }}>
                                            {chiTiet?.productDetail?.images?.map((anh, subIndex) => (
                                                <div key={`${index}-${subIndex}`} className="image-container" >
                                                    <img src={anh.url} alt="images" className="object-fit-cover" style={{borderRadius: '10px'}} />
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
