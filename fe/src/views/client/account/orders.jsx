import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Input, Tabs } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllDonMuaByIdKh } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatDate from '../../utilities/FormatDate.jsx';
import { useNavigate } from 'react-router-dom';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import { FaRegFileAlt, FaTruck, FaTruckLoading } from 'react-icons/fa'; // FontAwesome icons
import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle ,MdCancel,MdOutlineReplayCircleFilled} from 'react-icons/md'; // Material Design icons
import { GiConfirmed } from 'react-icons/gi'; // Game Icons
const { Text, Title } = Typography;
const { TabPane } = Tabs;
import { Pagination } from 'antd';
import '../account/voucher.css';
const listStatus = [
    { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON", color: "#007BFF", title: "Tạo hóa đơn", icon: FaRegFileAlt }, // Xanh dương nhạt (thông tin)
    { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN", color: "#FFC107", title: "Chờ xác nhận", icon: FaRegFileAlt }, // Vàng (cảnh báo)
    { id: 2, name: "Xác nhận", status: "XAC_NHAN", color: "#17A2B8", title: "Xác nhận", icon: MdOutlineConfirmationNumber }, // Xanh dương lục (hành động)
    { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN", color: "#FD7E14", title: "Chờ vận chuyển", icon: MdPayment }, // Cam (tiến trình)
    { id: 4, name: "Vận chuyển", status: "VAN_CHUYEN", color: "#28A745", title: "Vận chuyển", icon: FaTruck }, // Xanh lá (thành công)
    { id: 5, name: "Thanh toán", status: "DA_THANH_TOAN", color: "#20C997", title: "Đã thanh toán", icon: FaTruckLoading }, // Xanh lục sáng (hoàn thành)
    { id: 6, name: "Thành công", status: "THANH_CONG", color: "#28A745", title: "Thành công", icon: GiConfirmed }, // Xanh lá (thành công)
    { id: 7, name: "Đã hủy", status: "DA_HUY", color: "#DC3545", title: "Đã hủy", icon: MdOutlineCancelPresentation }, // Đỏ (hủy)
    { id: 8, name: "Trả hàng", status: "TRA_HANG", color: "#17A2B8", title: "Trả hàng", icon: MdOutlineChangeCircle }, // Xanh dương lục (xử lý)
    { id: 9, name: "Yêu cầu hủy", status: "YEU_CAU_HUY", color: "#FF6347", title: "Yêu cầu hủy", icon: MdCancel }, // Đỏ cam (yêu cầu)
    { id: 10, name: "Đặt lại", status: "DAT_LAI", color: "#6A5ACD", title: "Đặt lại", icon: MdOutlineReplayCircleFilled }
  ];
  
// Function to get status name by status code
const getStatusName = (statusCode) => {
    const status = listStatus.find(item => item.status === statusCode);
    return status ? status.name : statusCode;
};

const Orders = () => {
    const [searchValueMa, setSearchValueMa] = useState('');
    const [searchValueSDT, setSearchValueSDT] = useState('');
    const [hoaDon, setHoaDon] = useState([]);
    const [filteredHoaDon, setFilteredHoaDon] = useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const [user, setUser] = useState(null);
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            const userInfo = {
                role: localStorage.getItem('userRole'),
                email: localStorage.getItem('userEmail'),
                username: localStorage.getItem('username'),
                customerId: localStorage.getItem('customerId'),
                customerName: localStorage.getItem('customerName'),
                customerEmail: localStorage.getItem('customerEmail'),
                customerPhoneNumber: localStorage.getItem('customerPhoneNumber'),
            };
            setUser(userInfo);
        }
    }, []);
    console.log("User sau khi đăng nhập ỏder:", user);

    const handleTabChange = (key) => {
        setActiveTab(key);
        let filtered = hoaDon;

        if (key === 'cancelled') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 'DA_HUY');
        } else if (key === 'waiting') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 'CHO_XAC_NHAN');
        } else if (key === 'confirmed') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 'XAC_NHAN');
        } else if (key === 'shipping') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 'VAN_CHUYEN');
        } else if (key === 'completed') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 'THANH_CONG');
        } else {
            filtered = hoaDon; // Hiển thị tất cả đơn hàng
        }

        setFilteredHoaDon(filtered);
    };

    // Kiểm tra và lấy customerId từ user
    const customerId = user ? user.customerId : null;

    // Gọi hàm lấy chi tiết hóa đơn khi customerId thay đổi
    useEffect(() => {
        if (customerId) {
            GetAllDonMuaByIdKh(customerId); // Gọi hàm với customerId
        }
    }, [customerId]); // Chạy lại khi customerId thay đổi

    const GetAllDonMuaByIdKh = async (id) => {
        try {
            const response = await getAllDonMuaByIdKh(id); // Truyền id vào hàm
            setHoaDon(response.data);
            setFilteredHoaDon(response.data);
            console.log('Don dddddddddd:', response.data); // Ghi log dữ liệu nhận được
        } catch (error) {
            console.error('Error fetching Hoa Don:', error);
            message.error('Đã xảy ra lỗi khi tải hóa đơn.');
        }
    };


    const onSearchMaChange = (e) => {
        const value = e.target.value;
        setSearchValueMa(value);
        filterOrders(value, searchValueSDT);
    };

    const onSearchSDTChange = (e) => {
        const value = e.target.value;
        setSearchValueSDT(value);
        filterOrders(searchValueMa, value);
    };

    const filterOrders = (ma, sdt) => {
        let filtered = hoaDon;
        if (ma) {
            filtered = filtered.filter(order => order.code?.includes(ma));
        }
        if (sdt) {
            filtered = filtered.filter(order => order.recipientPhone?.includes(sdt));
        }
        setFilteredHoaDon(filtered);
    };

    const handleViewHoaDonDetail = (ma) => {
        navigate(`/tracking/${ma}`);
    };

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const pageSize = 3; // Số lượng hóa đơn mỗi trang

    // Tính toán các hóa đơn cho trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOrders = filteredHoaDon.slice(startIndex, endIndex);


    return (
        <div style={{ padding: '20px' }}>
            <Tabs defaultActiveKey="all" onChange={handleTabChange}>
                <TabPane tab="Tất cả" key="all" />
                <TabPane tab="Đã hủy" key="cancelled" />
                <TabPane tab="Chờ xác nhận" key="waiting" />
                <TabPane tab="Đã xác nhận" key="confirmed" />
                <TabPane tab="Đang vận chuyển" key="shipping" />
                <TabPane tab="Hoàn thành" key="completed" />
            </Tabs>
            <div className='d-flex'>
                <Input
                    placeholder="Mời nhập mã hóa đơn"
                    prefix={<SearchOutlined />}
                    value={searchValueMa}
                    onChange={onSearchMaChange}
                    style={{ marginBottom: '20px', height: '40px', width: '100%', color: '#6A0DAD' }}
                />
                <Input
                    placeholder="Mời nhập số điện thoại người nhận"
                    prefix={<SearchOutlined />}
                    value={searchValueSDT}
                    onChange={onSearchSDTChange}
                    style={{ marginLeft: '10px', marginBottom: '20px', height: '40px', width: '100%', color: '#6A0DAD' }}
                />
            </div>

            {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                    <Card
                        key={index}
                        style={{ marginBottom: '10px' }}
                        actions={[
                            <Button
                                onClick={() => handleViewHoaDonDetail(order?.code)}
                                className="voucher-button"
                                icon={<CheckCircleOutlined />}
                            >
                                Thông Tin Chi Tiết
                            </Button>
                        ]}
                    >
                        <div className='d-flex justify-content-between'>
                            <Title level={5}>Mã hóa đơn: {order?.code}</Title>
                            <h5>{getStatusName(order?.invoiceStatus)}</h5>
                        </div>
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='py-2'>
                                <Text>Ngày đặt hàng: <FormatDate date={order?.createdAt} /></Text><br /><br />
                            </div>
                            <div className='py-2' style={{ textAlign: 'right' }}>
                                <Text>Tiền ship: <FormatCurrency value={order?.shippingFee} /></Text>
                                <br /><br />
                                <Text>Tổng tiền: <FormatCurrency value={order?.totalMoney + order?.shippingFee - order?.discountAmount} /></Text>
                            </div>
                        </div>
                    </Card>
                ))
            ) : (
                <Text>Không tìm thấy đơn hàng nào.</Text>
            )}
            

            {/* Phân trang */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredHoaDon.length}
                onChange={(page) => setCurrentPage(page)}
                style={{ marginTop: '20px', textAlign: 'center' }}
            />
        </div>
    );
};

export default Orders;
