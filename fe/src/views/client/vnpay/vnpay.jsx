//Bản tiếng việt
// import React from 'react';
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { message } from 'antd';
// import { thanhToan } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// import { Card, Button, Typography } from 'antd';
// import { CheckCircleOutlined } from '@ant-design/icons';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import FormatCurrency from '../../utilities/FormatCurrency.jsx';
// const { Title, Text, Link } = Typography;

// const VNPAY = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [hoaDon, setHoaDon] = useState();

//     useEffect(() => {
//         const queryParams = new URLSearchParams(location.search);
//         const paymentStatus = queryParams.get('vnp_ResponseCode'); // Mã phản hồi từ VNPAY
//         const transactionId = queryParams.get('vnp_TxnRef'); // Mã giao dịch từ VNPAY

//         if (paymentStatus === '00') { // "00" là mã thành công của VNPAY
//             // Lấy lại thông tin hóa đơn từ localStorage
//             const hoaDon = JSON.parse(localStorage.getItem('checkout'));

//             // Thêm mã giao dịch vào hóa đơn
//             const updatedHoaDon = { ...hoaDon, maGiaoDich: transactionId };  // Gắn mã giao dịch vào hóa đơn

//             // Gọi API thanh toán sau khi thanh toán VNPAY thành công
//             thanhToan(updatedHoaDon)
//                 .then(response => {
//                     if (response.status === 200) {
//                         console.log("Reponse data ddddddddddd", response.data.data)
//                         setHoaDon(response.data.data)
//                         toast.success("Thanh toán và đặt hàng thành công!");
//                         localStorage.removeItem('checkout'); // Xóa thông tin sau khi thanh toán xong
//                     } else {
//                         message.error("Có lỗi xảy ra khi xác nhận thanh toán!");
//                     }
//                 })
//                 .catch(error => {
//                     message.error("Có lỗi xảy ra khi xác nhận thanh toán!");
//                     console.error('Error during order confirmation:', error);
//                 });
//         } else {
//             message.error("Thanh toán không thành công!");
//             navigate('/home'); // Điều hướng về trang chính
//         }
//     }, [location, navigate]);

//     const handleViewHoaDonDetail = (ma) => {
//         navigate(`/tracking/${ma}`);
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <Card
//                 style={{ width: 400, textAlign: 'center', backgroundColor: 'wheat' }}
//                 bordered={false}
//             >
//                 <img
//                     src="/src/assets/images/icons/images.png" 
//                     alt="VN PAY"
//                     style={{ width: 100, marginBottom: 20 }}
//                 />
//                 <Title level={4}>Giá trị đơn hàng</Title>
//                 <Title level={2} style={{ color: 'red' }}> <FormatCurrency value={hoaDon?.tongTien + hoaDon?.phiShip - hoaDon?.soTienDuocGiam} /></Title>
//                 <CheckCircleOutlined style={{ fontSize: 50, color: 'green', margin: '20px 0' }} />
//                 <Title level={3}>Đặt hàng thành công!</Title>
//                 <Text>Mã đơn hàng: </Text>
//                 <Text onClick={() => handleViewHoaDonDetail(hoaDon?.ma)}>{hoaDon?.ma || null}</Text>
//                 <Text style={{ display: 'block', marginTop: 10 }}>
//                     Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý.
//                 </Text>
//                 <Button type="primary" style={{ marginTop: 20 }}> <Link href="/home">Tiếp tục mua sắm</Link></Button>
//             </Card>
//             <ToastContainer />
//         </div>
//     );
// };

// export default VNPAY;

//Bản tiếng Anh
import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { thanhToan } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { Card, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
const { Title, Text, Link } = Typography;

const VNPAY = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [hoaDon, setHoaDon] = useState();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('vnp_ResponseCode'); // Mã phản hồi từ VNPAY
        const transactionId = queryParams.get('vnp_TxnRef'); // Mã giao dịch từ VNPAY

        if (paymentStatus === '00') { // "00" là mã thành công của VNPAY
            // Lấy lại thông tin hóa đơn từ localStorage
            const hoaDon = JSON.parse(localStorage.getItem('checkout'));

            // Thêm mã giao dịch vào hóa đơn
            const updatedHoaDon = { ...hoaDon, transactionNo: transactionId };  // Gắn mã giao dịch vào hóa đơn

            // Gọi API thanh toán sau khi thanh toán VNPAY thành công
            thanhToan(updatedHoaDon)
                .then(response => {
                    if (response.status === 200) {
                        console.log("Reponse data ddddddddddd", response.data.data)
                        setHoaDon(response.data.data)
                        toast.success("Thanh toán và đặt hàng thành công!");
                        localStorage.removeItem('checkout'); // Xóa thông tin sau khi thanh toán xong
                    } else {
                        message.error("Có lỗi xảy ra khi xác nhận thanh toán!");
                    }
                })
                .catch(error => {
                    message.error("Có lỗi xảy ra khi xác nhận thanh toán!");
                    console.error('Error during order confirmation:', error);
                });
        } else {
            message.error("Thanh toán không thành công!");
            navigate('/home'); // Điều hướng về trang chính
        }
    }, [location, navigate]);

    const handleViewHoaDonDetail = (ma) => {
        navigate(`/tracking/${ma}`);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card
                style={{ width: 400, textAlign: 'center', backgroundColor: 'wheat' }}
                bordered={false}
            >
                <img
                    src="/src/assets/images/icons/images.png" 
                    alt="VN PAY"
                    style={{ width: 100, marginBottom: 20 }}
                />
                <Title level={4}>Giá trị đơn hàng</Title>
                <Title level={2} style={{ color: 'red' }}> <FormatCurrency value={hoaDon?.totalMoney + hoaDon?.shippingFee - hoaDon?.discountAmount} /></Title>
                <CheckCircleOutlined style={{ fontSize: 50, color: 'green', margin: '20px 0' }} />
                <Title level={3}>Đặt hàng thành công!</Title>
                <Text>Mã đơn hàng: </Text>
                <Text onClick={() => handleViewHoaDonDetail(hoaDon?.code)}>{hoaDon?.code || null}</Text>
                <Text style={{ display: 'block', marginTop: 10 }}>
                    Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đang được xử lý.
                </Text>
                <Button type="primary" style={{ marginTop: 20 }}> <Link href="/home">Tiếp tục mua sắm</Link></Button>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default VNPAY;
