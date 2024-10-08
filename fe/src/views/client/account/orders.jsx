//Bản Việt
// import React, { useState, useEffect } from 'react';
// import { Card, Button, Typography, Input, Tabs } from 'antd';
// import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
// import { findByMaAndSDT, getAllDonMuaByIdKh } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import FormatDate from '../../utilities/FormatDate.jsx';
// import { useNavigate } from 'react-router-dom';
// import FormatCurrency from '../../utilities/FormatCurrency.jsx';
// const { Text } = Typography;
// const { TabPane } = Tabs;
// const Orders = () => {
//     const [searchValueMa, setSearchValueMa] = useState(''); // Input value for searching by invoice ID
//     const [searchValueSDT, setSearchValueSDT] = useState(''); // Input value for searching by phone number
//     const [hoaDon, setHoaDon] = useState([]); // Danh sách hóa đơn
//     const [filteredHoaDon, setFilteredHoaDon] = useState([]); // Danh sách hóa đơn đã lọc
//     const navigate = useNavigate();
//     const [activeTab, setActiveTab] = useState('all');
//     const idKH = 2; // Biến idKH được định nghĩa

//     const handleTabChange = (key) => {
//         setActiveTab(key);
//         // Lọc hóa đơn theo trạng thái của tab
//         let filtered = hoaDon;

//         if (key === 'cancelled') {
//             filtered = hoaDon.filter(order => order.trangThaiHoaDon === 'Đã hủy');
//         } else if (key === 'waiting') {
//             filtered = hoaDon.filter(order => order.trangThaiHoaDon === 'Chờ xác nhận');
//         } else if (key === 'confirmed') {
//             filtered = hoaDon.filter(order => order.trangThaiHoaDon === 'Đã xác nhận');
//         } else if (key === 'shipping') {
//             filtered = hoaDon.filter(order => order.trangThaiHoaDon === 'Đang vận chuyển');
//         } else if (key === 'completed') {
//             filtered = hoaDon.filter(order => order.trangThaiHoaDon === 'Hoàn thành');
//         } else {
//             // Hiển thị tất cả nếu không chọn trạng thái cụ thể
//             filtered = hoaDon;
//         }

//         setFilteredHoaDon(filtered); // Cập nhật danh sách hóa đơn đã lọc
// };

// // Lấy tất cả hóa đơn khi idKH thay đổi
// useEffect(() => {
//     GetAllDonMuaByIdKh();
// }, [idKH]);

// const GetAllDonMuaByIdKh = () => {
//     getAllDonMuaByIdKh(idKH)
//         .then((response) => {
//             setHoaDon(response.data); // Cập nhật danh sách hóa đơn
//             setFilteredHoaDon(response.data); // Mặc định hiển thị tất cả hóa đơn
//             console.log('Hoa Don:', response.data);
//         })
//         .catch((error) => {
//             console.error('Error fetching Hoa Don:', error);
//         });
// };

// // Cập nhật giá trị tìm kiếm theo mã hóa đơn
// const onSearchMaChange = (e) => {
//     const value = e.target.value;
//     setSearchValueMa(value);
//     filterOrders(value, searchValueSDT); // Gọi hàm lọc
// };

// // Cập nhật giá trị tìm kiếm theo số điện thoại
// const onSearchSDTChange = (e) => {
//     const value = e.target.value;
//     setSearchValueSDT(value);
//     filterOrders(searchValueMa, value); // Gọi hàm lọc
// };

// // Hàm lọc hóa đơn theo mã hóa đơn và số điện thoại
// const filterOrders = (ma, sdt) => {
//     let filtered = hoaDon;

//     if (ma) {
//         filtered = filtered.filter(order => order.ma.includes(ma)); // Lọc theo mã hóa đơn
//     }
//     if (sdt) {
//         filtered = filtered.filter(order => order.soDienThoaiNguoiNhan.includes(sdt)); // Lọc theo số điện thoại
//     }

//     setFilteredHoaDon(filtered); // Cập nhật danh sách đã lọc
// };

// // Điều hướng tới trang chi tiết hóa đơn
// const handleViewHoaDonDetail = (ma) => {
//     navigate(`/tracking/${ma}`);
// };

// return (
//     <div style={{ padding: '20px' }}>
//         {/* Thanh điều hướng */}
//         <Tabs defaultActiveKey="all" onChange={handleTabChange}>
//             <TabPane tab="Tất cả" key="all" />
//             <TabPane tab="Đã hủy" key="cancelled" />
//             <TabPane tab="Chờ xác nhận" key="waiting" />
//             <TabPane tab="Đã xác nhận" key="confirmed" />
//             <TabPane tab="Đang vận chuyển" key="shipping" />
//             <TabPane tab="Hoàn thành" key="completed" />
//         </Tabs>
//         <div className='d-flex'>
//             <Input
//                 placeholder="Mời nhập mã hóa đơn"
//                 prefix={<SearchOutlined />}
//                 value={searchValueMa}
//                 onChange={onSearchMaChange}
//                 style={{ marginBottom: '20px', height: '40px', width: '100%', color: '#6A0DAD' }}
//             />
//             <Input
//                 placeholder="Mời nhập số điện thoại người nhận"
//                 prefix={<SearchOutlined />}
//                 value={searchValueSDT}
//                 onChange={onSearchSDTChange}
//                 style={{ marginLeft: '10px', marginBottom: '20px', height: '40px', width: '100%', color: '#6A0DAD' }}
//             />
//         </div>

//         {/* Hiển thị danh sách hóa đơn đã lọc */}
//         {filteredHoaDon.length > 0 ? (
//             filteredHoaDon.map((order, index) => (
//                 <Card
//                     key={index}
//                     style={{ marginBottom: '10px' }}
//                     actions={[<Button onClick={() => handleViewHoaDonDetail(order?.ma)} style={{ border: '1px solid #6A0DAD', color: '#6A0DAD' }} type="light" icon={<CheckCircleOutlined />}>Thông Tin Chi Tiết</Button>]}
//                 >
//                     <div className='d-flex justify-content-between'>
//                         <h5>Mã hóa đơn: {order.ma}</h5>
//                         <h5>{order.trangThaiHoaDon}</h5>
//                     </div>
//                     <hr />
//                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <div className='py-2'>
//                             <Text>Ngày đặt hàng: <FormatDate date={order.ngayTao} /></Text><br /><br />
//                         </div>
//                         <div className='py-2' style={{ textAlign: 'right' }}>
//                             <Text>Tiền ship: <FormatCurrency value={order.phiShip} /></Text>
//                             <br /><br />
//                             <Text>Tổng tiền: <FormatCurrency value={order.tongTien + order.phiShip - order.soTienDuocGiam} /></Text>
//                         </div>
//                     </div>
//                 </Card>
//             ))
//         ) : (
//             <Text>Không tìm thấy đơn hàng nào.</Text>
//         )}
//     </div>
// );
// };

// export default Orders;

//Bản Anh
import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Input, Tabs } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { findByMaAndSDT, getAllDonMuaByIdKh } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import FormatDate from '../../utilities/FormatDate.jsx';
import { useNavigate } from 'react-router-dom';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
const { Text } = Typography;
const { TabPane } = Tabs;
const Orders = () => {
    const [searchValueMa, setSearchValueMa] = useState(''); // Input value for searching by invoice ID
    const [searchValueSDT, setSearchValueSDT] = useState(''); // Input value for searching by phone number
    const [hoaDon, setHoaDon] = useState([]); // Danh sách hóa đơn
    const [filteredHoaDon, setFilteredHoaDon] = useState([]); // Danh sách hóa đơn đã lọc
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const idKH = 2; // Biến idKH được định nghĩa

    const handleTabChange = (key) => {
        setActiveTab(key);
        // Lọc hóa đơn theo trạng thái của tab
        let filtered = hoaDon;

        if (key === 'cancelled') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 8);
        } else if (key === 'waiting') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 1);
        } else if (key === 'confirmed') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 2);
        } else if (key === 'shipping') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 4);
        } else if (key === 'completed') {
            filtered = hoaDon.filter(order => order.invoiceStatus === 5);
        } else {
            // Hiển thị tất cả nếu không chọn trạng thái cụ thể
            filtered = hoaDon;x
        }

        setFilteredHoaDon(filtered); // Cập nhật danh sách hóa đơn đã lọc
};

// Lấy tất cả hóa đơn khi idKH thay đổi
useEffect(() => {
    GetAllDonMuaByIdKh();
}, [idKH]);

const GetAllDonMuaByIdKh = () => {
    getAllDonMuaByIdKh(idKH)
        .then((response) => {
            setHoaDon(response.data); // Cập nhật danh sách hóa đơn
            setFilteredHoaDon(response.data); // Mặc định hiển thị tất cả hóa đơn
            console.log('Hoa Don:', response.data);
        })
        .catch((error) => {
            console.error('Error fetching Hoa Don:', error);
        });
};

// Cập nhật giá trị tìm kiếm theo mã hóa đơn
const onSearchMaChange = (e) => {
    const value = e.target.value;
    setSearchValueMa(value);
    filterOrders(value, searchValueSDT); // Gọi hàm lọc
};

// Cập nhật giá trị tìm kiếm theo số điện thoại
const onSearchSDTChange = (e) => {
    const value = e.target.value;
    setSearchValueSDT(value);
    filterOrders(searchValueMa, value); // Gọi hàm lọc
};

// Hàm lọc hóa đơn theo mã hóa đơn và số điện thoại
const filterOrders = (ma, sdt) => {
    let filtered = hoaDon;

    if (ma) {
        filtered = filtered.filter(order => order.code.includes(ma)); // Lọc theo mã hóa đơn
    }
    if (sdt) {
        filtered = filtered.filter(order => order.recipientPhone.includes(sdt)); // Lọc theo số điện thoại
    }

    setFilteredHoaDon(filtered); // Cập nhật danh sách đã lọc
};

// Điều hướng tới trang chi tiết hóa đơn
const handleViewHoaDonDetail = (ma) => {
    navigate(`/tracking/${ma}`);
};

return (
    <div style={{ padding: '20px' }}>
        {/* Thanh điều hướng */}
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

        {/* Hiển thị danh sách hóa đơn đã lọc */}
        {filteredHoaDon.length > 0 ? (
            filteredHoaDon.map((order, index) => (
                <Card
                    key={index}
                    style={{ marginBottom: '10px' }}
                    actions={[<Button onClick={() => handleViewHoaDonDetail(order?.code)} style={{ border: '1px solid #6A0DAD', color: '#6A0DAD' }} type="light" icon={<CheckCircleOutlined />}>Thông Tin Chi Tiết</Button>]}
                >
                    <div className='d-flex justify-content-between'>
                        <h5>Mã hóa đơn: {order.code}</h5>
                        <h5>{order.invoiceStatus}</h5>
                    </div>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className='py-2'>
                            <Text>Ngày đặt hàng: <FormatDate date={order.createdAt} /></Text><br /><br />
                        </div>
                        <div className='py-2' style={{ textAlign: 'right' }}>
                            <Text>Tiền ship: <FormatCurrency value={order.shippingFee} /></Text>
                            <br /><br />
                            <Text>Tổng tiền: <FormatCurrency value={order.totalMoney + order.shippingFee - order.discountAmount} /></Text>
                        </div>
                    </div>
                </Card>
            ))
        ) : (
            <Text>Không tìm thấy đơn hàng nào.</Text>
        )}
    </div>
);
};

export default Orders;
