import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Input } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
import { findByMaAndSDT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatDate from '../../utilities/FormatDate.jsx';
import { useNavigate } from 'react-router-dom';
import '../account/voucher.css';
const { Text } = Typography;

const Tracking = () => {
    const [searchValueMa, setSearchValueMa] = useState(''); // Input value for searching by invoice ID
    const [searchValueSDT, setSearchValueSDT] = useState(''); // Input value for searching by phone number
    const [hoaDon, setHoaDon] = useState(null); // Chỉ cần lưu một hóa đơn duy nhất
    const navigate = useNavigate();

    const onSearchMaChange = (e) => {
        const value = e.target.value;
        setSearchValueMa(value);
    };

    const onSearchSDTChange = (e) => {
        const value = e.target.value;
        setSearchValueSDT(value);
    };

    // Fetch order details by ID and phone number when both search terms are present
    useEffect(() => {
        const ma = searchValueMa; // Lấy giá trị ma từ searchValueMa
        const sdt = searchValueSDT; // Lấy giá trị sdt từ searchValueSDT

        if (ma && sdt) { // Cần cả hai giá trị
            FindByMa(ma, sdt);
        } else {
            setHoaDon(null); // Reset hoaDon nếu không có giá trị tìm kiếm
        }
    }, [searchValueMa, searchValueSDT]);

    const FindByMa = (ma, sdt) => {
        // Kiểm tra xem cả hai biến đều có giá trị
        if (!ma || !sdt) {
            alert("Bạn cần nhập cả mã hóa đơn và số điện thoại.");
            return;
        }

        findByMaAndSDT(ma, sdt)
            .then(response => {
                console.log("API response:", response.data);
                setHoaDon(response.data); // Thiết lập hoaDon là một đối tượng
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
            });
    };

    const handleViewHoaDonDetail = (ma) => {
        navigate(`/tracking/${ma}`);
    };

    return (
        <div style={{ padding: '20px' }}>
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

            {searchValueMa && searchValueSDT ? (
                hoaDon ? ( // Kiểm tra nếu hoaDon có dữ liệu
                    <Card
                        style={{ marginBottom: '10px' }}
                        actions={[<Button
                            onClick={() => handleViewHoaDonDetail(hoaDon?.code)}
                            className="voucher-button"
                            icon={<CheckCircleOutlined />}
                        >
                            Thông Tin Chi Tiết
                        </Button>]}>
                        <div>
                            <h5>Mã hóa đơn: {hoaDon.code}</h5>
                            <hr />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='py-2'>
                                <Text>Ngày đặt hàng: <FormatDate date={hoaDon.createdAt} /></Text><br /><br />
                            </div>
                            <div className='py-2' style={{ textAlign: 'right' }}>
                                <Text>Tiền ship: <FormatCurrency value={hoaDon.shippingFee} /></Text>
                                <br /><br />
                                <Text>Tổng tiền: <FormatCurrency value={hoaDon.totalMoney + hoaDon.shippingFee - hoaDon.discountAmount} /></Text>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Text>Không tìm thấy đơn hàng nào.</Text>
                )
            ) : <Text style={{ fontSize: '20px' }}>Vui lòng nhập cả mã hóa đơn và số điện thoại để tìm kiếm!</Text>}
        </div>
    );
};

export default Tracking;
