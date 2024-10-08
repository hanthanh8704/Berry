//Banr Việt
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React, { useState, useEffect } from 'react';
// import { Typography, Empty, Tabs, List, Card, Button } from 'antd';
// import { getAllByPublic, getAllByCaNhan, detailVoucher } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
// const { TabPane } = Tabs;
// import FormatCurrency from '../../utilities/FormatCurrency.jsx';
// const { Text } = Typography;
// import { CheckCircleOutlined } from '@ant-design/icons';
// import { Modal } from 'react-bootstrap';

// const Vouchers = () => {
//     const [voucherPublic, setVoucherPublic] = useState([]);
//     const [voucherDetail, setVoucherDetail] = useState(null); // Holds selected voucher detail
//     const [voucherPrimary, setVoucherPrimary] = useState([]);
//     const [showModalPhieuGiamGia, setShowModalPhieuGiamGia] = useState(false); // State to control modal visibility
//     const idKH = 2;

//     // Fetch all public vouchers
//     const GetAllByPublic = () => {
//         getAllByPublic()
//             .then((response) => {
//                 setVoucherPublic(response.data); // Update public vouchers list
//                 console.log('Voucher Public:', response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching Voucher Public:', error);
//             });
//     };

//     // Fetch voucher details by ID
//     const DetailVoucher = (idP) => {
//         detailVoucher(idP)
//             .then((response) => {
//                 setVoucherDetail(response.data); // Update voucher detail
//                 console.log('Voucher Detail:', response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching Voucher Detail:', error);
//             });
//     };

//     // Fetch all personal vouchers
//     const GetAllByCaNhan = () => {
//         getAllByCaNhan(idKH)
//             .then((response) => {
//                 setVoucherPrimary(response.data); // Update personal vouchers list
//                 console.log('Voucher Primary:', response.data);
//             })
//             .catch((error) => {
//                 console.error('Error fetching Voucher Primary:', error);
//             });
//     };

//     // Trigger API call on component mount
//     useEffect(() => {
//         GetAllByPublic();
//         GetAllByCaNhan();
//     }, []);

//     // Open modal and load voucher details
//     const handleShowPhieuGiamGia = (id) => {
//         DetailVoucher(id); // Fetch voucher details by ID
//         setShowModalPhieuGiamGia(true); // Show modal
//     };

//     // Close modal
//     const handleClosePhieuGiamGia = () => setShowModalPhieuGiamGia(false);

//     return (
//         <div className="container py-3" style={{ backgroundColor: 'white', minHeight: '300px' }}>
//             <Typography.Title level={3}>Phiếu giảm giá</Typography.Title>
//             <Tabs defaultActiveKey="1">
//                 {/* Public vouchers tab */}
//                 <TabPane tab="Công khai" key="1">
//                     {voucherPublic.length > 0 ? (
//                         <List
//                             grid={{ gutter: 16, column: 2 }}
//                             dataSource={voucherPublic}
//                             renderItem={(voucher) => (
//                                 <List.Item>
//                                     <Card
//                                         title={voucher.ten}
//                                         actions={[
//                                             <Button
//                                                 onClick={() => handleShowPhieuGiamGia(voucher.id)} // Trigger modal with voucher ID
//                                                 style={{ border: '1px solid #6A0DAD', color: '#6A0DAD' }}
//                                                 type="light"
//                                                 icon={<CheckCircleOutlined />}
//                                             >
//                                                 Thông Tin Chi Tiết
//                                             </Button>
//                                         ]}
//                                     >
//                                         {/* Display voucher value */}
//                                         <Text>
//                                             Giá trị: {voucher.hinhThucGiam === 'Giảm theo phần trăm'
//                                                 ? `${voucher.giaTriHoaDonDuocGiam}%`
//                                                 : <FormatCurrency value={voucher.giaTriHoaDonDuocGiam} />
//                                             }
//                                         </Text>
//                                         <br /><br />
//                                         {/* Display max applicable value */}
//                                         <Text>
//                                             Tối đa: <FormatCurrency value={voucher.giaTriHoaDonDuocApDungToiDa} />
//                                         </Text>
//                                         <br /><br />
//                                         {/* Display minimum applicable value */}
//                                         <Text>
//                                             Tối thiểu: <FormatCurrency value={voucher.giaTriHoaDonDuocApDung} />
//                                         </Text>
//                                     </Card>
//                                 </List.Item>
//                             )}
//                         />
//                     ) : (
//                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
//                             <Empty description="No Data Found" />
//                         </div>
//                     )}
//                 </TabPane>

//                 {/* Personal vouchers tab */}
//                 <TabPane tab="Cá nhân" key="2">
//                     {voucherPrimary.length > 0 ? (
//                         <List
//                             grid={{ gutter: 16, column: 1 }}
//                             dataSource={voucherPrimary}
//                             renderItem={(voucher) => (
//                                 <List.Item>
//                                     <Card
//                                         title={voucher.ten}
//                                         actions={[
//                                             <Button
//                                                 onClick={() => handleShowPhieuGiamGia(voucher.id)} // Trigger modal with voucher ID
//                                                 style={{ border: '1px solid #6A0DAD', color: '#6A0DAD' }}
//                                                 type="light"
//                                                 icon={<CheckCircleOutlined />}
//                                             >
//                                                 Thông Tin Chi Tiết
//                                             </Button>
//                                         ]}
//                                     >
//                                         {/* Display voucher value */}
//                                         <Text>
//                                             Giá trị: {voucher.hinhThucGiam === 'Giảm theo phần trăm'
//                                                 ? `${voucher.giaTriHoaDonDuocGiam}%`
//                                                 : <FormatCurrency value={voucher.giaTriHoaDonDuocGiam} />
//                                             }
//                                         </Text>
//                                         <br /><br />
//                                         {/* Display max applicable value */}
//                                         <Text>
//                                             Tối đa: <FormatCurrency value={voucher.giaTriHoaDonDuocApDungToiDa} />
//                                         </Text>
//                                         <br /><br />
//                                         {/* Display minimum applicable value */}
//                                         <Text>
//                                             Tối thiểu: <FormatCurrency value={voucher.giaTriHoaDonDuocApDung} />
//                                         </Text>
//                                     </Card>
//                                 </List.Item>
//                             )}
//                         />
//                     ) : (
//                         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
//                             <Empty description="No Data Found" />
//                         </div>
//                     )}
//                 </TabPane>
//             </Tabs>

//             {/* Modal for voucher details */}
//             <Modal
//                 show={showModalPhieuGiamGia}
//                 onHide={handleClosePhieuGiamGia}
//                 dialogClassName="modal-90w"
//                 aria-labelledby="example-custom-modal-styling-title"
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title>Thông tin phiếu giảm giá</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {/* Kiểm tra voucherDetail có dữ liệu hay không */}
//                     {voucherDetail && (
//                         <div>
//                             {/* Thông tin logo và giá trị voucher */}
//                             <div className="d-flex align-items-center justify-content-between mb-4">
//                                 <div className="d-flex align-items-center">
//                                     <img
//                                         src="/assets/images/icons/vnpay.png"
//                                         alt="BerryStore"
//                                         style={{ width: 80, marginRight: 10 }}
//                                     />
//                                 </div>
//                                 <div className="text-end">
//                                     <p>Giá trị: {voucherDetail.hinhThucGiam === 'Giảm theo phần trăm'
//                                         ? `${voucherDetail.giaTriHoaDonDuocGiam}%`
//                                         : <FormatCurrency value={voucherDetail.giaTriHoaDonDuocGiam} />
//                                     }</p>
//                                     <p>Tối đa: <FormatCurrency value={voucherDetail.giaTriHoaDonDuocApDungToiDa} /></p>
//                                     <p>Tối thiểu: <FormatCurrency value={voucherDetail.giaTriHoaDonDuocApDung} /></p>
//                                 </div>
//                             </div>

//                             {/* Hạn sử dụng */}
//                             <div className='mb-3'>
//                                 <strong>Hạn sử dụng:</strong>
//                                 <p>{voucherDetail.ngayBatDau} -- {voucherDetail.ngayKetThuc}</p>
//                             </div>

//                             {/* Ưu đãi */}
//                             <div className='mb-3'>
//                                 <strong>Ưu đãi:</strong>
//                                 <p>Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé</p>
//                                 <p>
//                                     Giảm {voucherDetail.hinhThucGiam === 'Giảm theo phần trăm'
//                                         ? `${voucherDetail.giaTriHoaDonDuocGiam}%`
//                                         : <FormatCurrency value={voucherDetail.giaTriHoaDonDuocGiam} />
//                                     }{' '}
//                                     cho đơn từ <FormatCurrency value={voucherDetail.giaTriHoaDonDuocApDung} /> {' '}
//                                     đến <FormatCurrency value={voucherDetail.giaTriHoaDonDuocApDungToiDa} />
//                                 </p>
//                             </div>


//                             {/* Điều kiện áp dụng */}
//                             <div className='mb-3'>
//                                 <strong>Áp dụng cho đơn hàng:</strong>
//                                 {/* <p>{voucherDetail.apDungDonHang}</p> */}
//                                 <p>Áp dụng cho mọi đơn hàng</p>
//                             </div>

//                             {/* Phương thức thanh toán */}
//                             <div className='mb-3'>
//                                 <strong>Hình thức thanh toán:</strong>
//                                 <p>Tất cả hình thức thanh toán</p>
//                             </div>

//                             {/* Đơn vị vận chuyển */}
//                             <div className='mb-3'>
//                                 <strong>Đơn vị vận chuyển:</strong>
//                                 <p>Giao hàng nhanh</p>
//                             </div>
//                             {/* Mã chi tiết */}
//                             <div className='mb-3'>
//                                 <strong>Chi tiết:</strong>
//                                 <p>Mã: {voucherDetail.ma}</p>
//                                 <p>Tên: {voucherDetail.ten}</p>
//                                 <p>Kiểu: {voucherDetail.loai}</p>
//                                 <p>Loại: {voucherDetail.hinhThucGiam}</p>
//                                 <p>Số lượng: {voucherDetail.soLuong}</p>
//                             </div>
//                             {/* Đơn vị vận chuyển */}
//                             <div className='mb-3'>
//                                 <strong>Lưu ý:</strong>
//                                 <p>Đối với những phiếu giảm giá thuộc kiểu <strong>công khai</strong> phiếu giảm giá sẽ được sử dụng bởi tất cả khách hàng!</p>
//                             </div>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button
//                         style={{ backgroundColor: 'white' }}
//                         onClick={handleClosePhieuGiamGia}
//                     >
//                         Đóng
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//         </div >
//     );
// };

// export default Vouchers;


//Bản Anh
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Typography, Empty, Tabs, List, Card, Button } from 'antd';
import { getAllByPublic, getAllByCaNhan, detailVoucher } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
const { TabPane } = Tabs;
import FormatCurrency from '../../utilities/FormatCurrency.jsx';
const { Text } = Typography;
import { CheckCircleOutlined } from '@ant-design/icons';
import { Modal } from 'react-bootstrap';

const Vouchers = () => {
    const [voucherPublic, setVoucherPublic] = useState([]);
    const [voucherDetail, setVoucherDetail] = useState(null); // Holds selected voucher detail
    const [voucherPrimary, setVoucherPrimary] = useState([]);
    const [showModalPhieuGiamGia, setShowModalPhieuGiamGia] = useState(false); // State to control modal visibility
    const idKH = 2;

    // Fetch all public vouchers
    const GetAllByPublic = () => {
        getAllByPublic()
            .then((response) => {
                setVoucherPublic(response.data); // Update public vouchers list
                console.log('Voucher Public:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching Voucher Public:', error);
            });
    };

    // Fetch voucher details by ID
    const DetailVoucher = (idP) => {
        detailVoucher(idP)
            .then((response) => {
                setVoucherDetail(response.data); // Update voucher detail
                console.log('Voucher Detail:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching Voucher Detail:', error);
            });
    };

    // Fetch all personal vouchers
    const GetAllByCaNhan = () => {
        getAllByCaNhan(idKH)
            .then((response) => {
                setVoucherPrimary(response.data); // Update personal vouchers list
                console.log('Voucher Primary:', response.data);
            })
            .catch((error) => {
                console.error('Error fetching Voucher Primary:', error);
            });
    };

    // Trigger API call on component mount
    useEffect(() => {
        GetAllByPublic();
        GetAllByCaNhan();
    }, []);

    // Open modal and load voucher details
    const handleShowPhieuGiamGia = (id) => {
        DetailVoucher(id); // Fetch voucher details by ID
        setShowModalPhieuGiamGia(true); // Show modal
    };

    // Close modal
    const handleClosePhieuGiamGia = () => setShowModalPhieuGiamGia(false);

    return (
        <div className="container py-3" style={{ backgroundColor: 'white', minHeight: '300px' }}>
            <Typography.Title level={3}>Phiếu giảm giá</Typography.Title>
            <Tabs defaultActiveKey="1">
                {/* Public vouchers tab */}
                <TabPane tab="Công khai" key="1">
                    {voucherPublic.length > 0 ? (
                        <List
                            grid={{ gutter: 16, column: 2 }}
                            dataSource={voucherPublic}
                            renderItem={(voucher) => (
                                <List.Item>
                                    <Card
                                        title={voucher.name}
                                        actions={[
                                            <Button
                                                onClick={() => handleShowPhieuGiamGia(voucher.id)} // Trigger modal with voucher ID
                                                style={{ border: '1px solid #6A0DAD', color: '#6A0DAD' }}
                                                type="light"
                                                icon={<CheckCircleOutlined />}
                                            >
                                                Thông Tin Chi Tiết
                                            </Button>
                                        ]}
                                    >
                                        {/* Display voucher value */}
                                        <Text>
                                            Giá trị: {voucher.discountMethod === 'Giảm theo phần trăm'
                                                ? `${voucher.discountValue}%`
                                                : <FormatCurrency value={voucher.discountValue} />
                                            }
                                        </Text>
                                        <br /><br />
                                        {/* Display max applicable value */}
                                        <Text>
                                            Tối đa: <FormatCurrency value={voucher.maximumDiscountValue} />
                                        </Text>
                                        <br /><br />
                                        {/* Display minimum applicable value */}
                                        <Text>
                                            Tối thiểu: <FormatCurrency value={voucher.minimumOrderValue} />
                                        </Text>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <Empty description="No Data Found" />
                        </div>
                    )}
                </TabPane>

                {/* Personal vouchers tab */}
                <TabPane tab="Cá nhân" key="2">
                    {voucherPrimary.length > 0 ? (
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={voucherPrimary}
                            renderItem={(voucher) => (
                                <List.Item>
                                    <Card
                                        title={voucher.ten}
                                        actions={[
                                            <Button
                                                onClick={() => handleShowPhieuGiamGia(voucher.id)} // Trigger modal with voucher ID
                                                style={{ border: '1px solid #6A0DAD', color: '#6A0DAD' }}
                                                type="light"
                                                icon={<CheckCircleOutlined />}
                                            >
                                                Thông Tin Chi Tiết
                                            </Button>
                                        ]}
                                    >
                                        {/* Display voucher value */}
                                        <Text>
                                            Giá trị: {voucher.discountMethod === 'Giảm theo phần trăm'
                                                ? `${voucher.discountValue}%`
                                                : <FormatCurrency value={voucher.discountValue} />
                                            }
                                        </Text>
                                        <br /><br />
                                        {/* Display max applicable value */}
                                        <Text>
                                            Tối đa: <FormatCurrency value={voucher.maximumDiscountValue} />
                                        </Text>
                                        <br /><br />
                                        {/* Display minimum applicable value */}
                                        <Text>
                                            Tối thiểu: <FormatCurrency value={voucher.minimumOrderValue} />
                                        </Text>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                            <Empty description="No Data Found" />
                        </div>
                    )}
                </TabPane>
            </Tabs>

            {/* Modal for voucher details */}
            <Modal
                show={showModalPhieuGiamGia}
                onHide={handleClosePhieuGiamGia}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin phiếu giảm giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Kiểm tra voucherDetail có dữ liệu hay không */}
                    {voucherDetail && (
                        <div>
                            {/* Thông tin logo và giá trị voucher */}
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className="d-flex align-items-center">
                                    <img
                                        src="/assets/images/icons/vnpay.png"
                                        alt="BerryStore"
                                        style={{ width: 80, marginRight: 10 }}
                                    />
                                </div>
                                <div className="text-end">
                                    <p>Giá trị: {voucherDetail.discountMethod === 'Giảm theo phần trăm'
                                        ? `${voucherDetail.discountValue}%`
                                        : <FormatCurrency value={voucherDetail.discountValue} />
                                    }</p>
                                    <p>Tối đa: <FormatCurrency value={voucherDetail.maximumDiscountValue} /></p>
                                    <p>Tối thiểu: <FormatCurrency value={voucherDetail.minimumOrderValue} /></p>
                                </div>
                            </div>

                            {/* Hạn sử dụng */}
                            <div className='mb-3'>
                                <strong>Hạn sử dụng:</strong>
                                <p>{voucherDetail.startDate} -- {voucherDetail.endDate}</p>
                            </div>

                            {/* Ưu đãi */}
                            <div className='mb-3'>
                                <strong>Ưu đãi:</strong>
                                <p>Lượt sử dụng có hạn. Nhanh tay kẻo lỡ bạn nhé</p>
                                <p>
                                    Giảm {voucherDetail.discountMethod === 'Giảm theo phần trăm'
                                        ? `${voucherDetail.discountValue}%`
                                        : <FormatCurrency value={voucherDetail.discountValue} />
                                    }{' '}
                                    cho đơn từ <FormatCurrency value={voucherDetail.minimumOrderValue} /> {' '}
                                    đến <FormatCurrency value={voucherDetail.maximumDiscountValue} />
                                </p>
                            </div>


                            {/* Điều kiện áp dụng */}
                            <div className='mb-3'>
                                <strong>Áp dụng cho đơn hàng:</strong>
                                {/* <p>{voucherDetail.apDungDonHang}</p> */}
                                <p>Áp dụng cho mọi đơn hàng</p>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className='mb-3'>
                                <strong>Hình thức thanh toán:</strong>
                                <p>Tất cả hình thức thanh toán</p>
                            </div>

                            {/* Đơn vị vận chuyển */}
                            <div className='mb-3'>
                                <strong>Đơn vị vận chuyển:</strong>
                                <p>Giao hàng nhanh</p>
                            </div>
                            {/* Mã chi tiết */}
                            <div className='mb-3'>
                                <strong>Chi tiết:</strong>
                                <p>Mã: {voucherDetail.code}</p>
                                <p>Tên: {voucherDetail.name}</p>
                                <p>Kiểu: {voucherDetail.type}</p>
                                <p>Loại: {voucherDetail.discountMethod}</p>
                                <p>Số lượng: {voucherDetail.quantity}</p>
                            </div>
                            {/* Đơn vị vận chuyển */}
                            <div className='mb-3'>
                                <strong>Lưu ý:</strong>
                                <p>Đối với những phiếu giảm giá thuộc kiểu <strong>công khai</strong> phiếu giảm giá sẽ được sử dụng bởi tất cả khách hàng!</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{ backgroundColor: 'white' }}
                        onClick={handleClosePhieuGiamGia}
                    >
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
};

export default Vouchers;
