import { AutoComplete, Badge, Button, Col, Divider, Empty, Input, Modal, Radio, Tag } from 'antd'
import React from 'react'
import { useState,useEffect } from 'react';
import FormatCurrency from 'views/utilities/FormatCurrency';
import FormatDate from 'views/utilities/FormatDate';
import * as request from 'views/utilities/httpRequest';

function VoucherOrder({ onSelectVoucher, customerId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [privateVoucher, setPrivateVoucher] = useState([]);
    const [publicVoucher, setPublicVoucher] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const [selectedVoucher, setSelectedVoucher] = useState({});

    const loadVoucher = (searchValue) => {
        request.get('/voucher/public', {
            params: {
                ten: searchValue,
                trangThai: "Đang diễn ra"
            }   
        }).then(response => {
            setPublicVoucher(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        })
        request.get(`/voucher/private/${customerId}`, {
            params: {
                ten: searchValue,
                trangThai: "Đang diễn ra"
            }
        }).then(response => {
            setPrivateVoucher(response.data);
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        })
    }

    useEffect(() => {
        loadVoucher(searchValue)
    }, [searchValue])

    const handleSearch = (value) => {
        setSearchValue(value);
        loadVoucher(value);
    };

    return (
        <>
            <Col xl={24}>
                <div className="border border-1 p-2 d-flex rounded-2" style={{ cursor: "pointer" }}>
                    <div className="flex-grow-1 fw-semibold">
                        <i className='fas fa-ticket'></i> Phiếu giảm giá
                    </div>
                    <div className="text-secondary" onClick={() => { setIsModalOpen(true); loadVoucher() }}>
                        Chọn hoặc nhập mã
                    </div>
                </div>
            </Col>

            <Modal title="Chọn phiếu giảm giá" 
                open={isModalOpen} onOk={() => 
                setIsModalOpen(false)} onCancel={() => 
                setIsModalOpen(false)} footer={""} width={500}>
                <div className="" style={{ maxHeight: '64vh', 
                    overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="container">
                        <Input placeholder='Tìm kiếm phiếu giảm giá theo mã, tên...'
                         onChange={(e) => setSearchValue(e.target.value)} />
                         {/* Phiếu giảm giá cho cá nhân  */}
                        <h6 className='mt-2'>Phiếu giảm giá dành riêng cho bạn</h6>
                        {privateVoucher.length === 0 ? 
                        <Empty description="Danh sách phiếu giảm giá trống" /> :
                         privateVoucher.map((item, index) => (
                            <div onClick={() => { setSelectedVoucher(item);
                             onSelectVoucher(item) }}
                              className={`d-flex align-items-center 
                              position-relative pt-2 mt-3 border border-2 px-2 ${selectedVoucher === item && 'border-warning'}`}>
                                <div className="flex-grow-1">
                                    <ul className='list-unstyled'>
                                        <li className='fw-semibold'><span className='text-warning'>[{item.ma}]</span> {item.ten} <Tag color="gold">{item.giaTriHoaDonDuocGiam} <span>{item.hinhThucGiam}</span> </Tag></li>
                                        <li className='small'>Đơn tối thiểu: <FormatCurrency value={item.giaTriHoaDonDuocApDung} /></li>
                                        <li className='small'>Ngày kết thúc: <FormatDate date={item.ngayKetThuc} /></li>
                                    </ul>
                                </div>
                                <div className="">
                                    <input type="radio" className="form-check-input" name='voucher' checked={selectedVoucher === item ? true : false} />
                                </div>
                                <span className="position-absolute top-0 start-100 translate-middle badge bg-warning">
                                    x {item.soLuong}
                                </span>
                            </div>
                        ))}
                        <hr className='' />
                        {/* Phiếu giảm giá công khai */}
                        <h6 >Các phiếu giảm giá khác</h6>
                        {publicVoucher.length === 0 ? <Empty description="Danh sách phiếu giảm giá trống" /> : publicVoucher.map((item, index) => (
                            <div onClick={() => { setSelectedVoucher(item); onSelectVoucher(item) }} className={`d-flex align-items-center position-relative pt-2 mt-3 border border-2 rounded-2 px-2 ${selectedVoucher === item && 'border-warning'}`}>
                                <div className="flex-grow-1">
                                <ul className='list-unstyled'>
                                        <li className='fw-semibold'><span className='text-warning'>[{item.ma}]</span> {item.ten} <Tag color="gold">{item.giaTriHoaDonDuocGiam} <span>{item.hinhThucGiam}</span> </Tag></li>
                                        <li className='small'>Đơn tối thiểu: <FormatCurrency value={item.giaTriHoaDonDuocApDung} /></li>
                                        <li className='small'>Ngày kết thúc: <FormatDate date={item.ngayKetThuc} /></li>
                                    </ul>
                                </div>
                                <div className="">
                                    <input type="radio" className="form-check-input" name='voucher' checked={selectedVoucher === item ? true : false} />
                                </div>
                                <span className="position-absolute top-0 start-100 translate-middle badge bg-warning">
                                    x {item.soLuong}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default VoucherOrder;