import { Badge, Col, Empty, Input, Modal, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import FormatCurrency from 'views/utilities/FormatCurrency';
import FormatDate from 'views/utilities/FormatDate';
import * as request from 'views/utilities/httpRequest';

function VoucherOrder({ products, onSelectVoucher, customer }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [publicVoucher, setPublicVoucher] = useState([]);
    const [privateVoucher, setPrivateVoucher] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [codeVoucher, setCodeVoucher] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    useEffect(() => {
        loadVoucher(searchValue);
        loadVoucherPrivate(searchValue);
    }, [searchValue, customer]);

    const loadVoucher = async (searchValue) => {
        try {
            const response = await request.get('/voucher/public', {
                params: {
                    name: `%${searchValue}%`,
                    code: `%${searchValue}%`,
                    status: 'DANG_DIEN_RA',
                },
            });
            setPublicVoucher(response.data);
        } catch (error) {
            console.error('Error fetching public vouchers:', error);
        }
    };
    const loadVoucherPrivate = async (searchValue) => {
        try {
            const response = await request.get(`/voucher/private/${customer}`, {
                params: {
                    name: `%${searchValue}%`,
                    code: `%${searchValue}%`,
                    status: 'DANG_DIEN_RA',
                },
            });
            console.log('khach hang', response);
            setPrivateVoucher(response.data);
        } catch (error) {
            console.error('Error fetching private vouchers:', error);
        }
    };

    useEffect(() => {
        const totalPrice = products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        );

        const filteredVouchers = [
            ...publicVoucher.filter((v) => totalPrice >= v.minOrderValue),
            ...privateVoucher.filter((v) => totalPrice >= v.minOrderValue),
        ];

        const bestVoucher = filteredVouchers.reduce((best, current) => {
            const currentDiscount = Math.min(
                current.discountValue,
                current.maxDiscountValue || Infinity
            );
            const bestDiscount = Math.min(
                best?.discountValue || 0,
                best?.maxDiscountValue || Infinity
            );
            return currentDiscount > bestDiscount ? current : best;
        }, null);

        if (bestVoucher) {
            onSelectVoucher(bestVoucher);
            setSelectedVoucher(bestVoucher.code);
            setCodeVoucher(`${bestVoucher.code} - ${bestVoucher.name}`);
        }

        setVoucher(filteredVouchers);
    }, [products, publicVoucher, privateVoucher]);

    const handleVoucherSelect = (voucher) => {
        setSelectedVoucher(voucher.code);
        onSelectVoucher(voucher);
        setCodeVoucher(`${voucher.code} - ${voucher.name}`);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
        loadVoucher(searchValue);
        loadVoucherPrivate(searchValue);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Col xl={24}>
                <div
                    className="border border-1 p-2 d-flex rounded-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleModalOpen}
                >
                    <div className="flex-grow-1 fw-semibold">
                        <i className="fas fa-ticket"></i> Mã giảm giá
                        <Input
                            style={{ width: '100%', backgroundColor: 'white' }}
                            value={products.length ? codeVoucher : ''}
                            readOnly
                        />
                    </div>
                    <div className="text-secondary">Chọn mã</div>
                </div>
            </Col>

            <Modal
                title="Chọn phiếu giảm giá"
                open={isModalOpen}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                footer={null}
                width={500}
            >
                <div className="" style={{ maxHeight: '64vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    <Input
                        placeholder="Tìm kiếm phiếu giảm giá theo mã, tên..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <h6 className="mt-2">Phiếu giảm giá dành riêng cho bạn</h6>

                    {voucher.length === 0 ? (
                        <Empty description="Danh sách phiếu giảm giá trống" />
                    ) : (
                        voucher.map((item) => (
                            <div
                                key={item.code}
                                onClick={() => handleVoucherSelect(item)}
                                className={`d-flex align-items-center position-relative pt-2 mt-3 border border-2 rounded-2 px-2 ${
                                    selectedVoucher === item.code ? 'border-primary' : ''
                                }`}
                            >
                                <div className="flex-grow-1">
                                    <ul className="list-unstyled">
                                        <li className="fw-semibold">
                                            <span className="text-warning">[{item.code}]</span>{' '}
                                            {item.name}
                                            <Tag color="gold">
                                                {item.discountValue}{' '}
                                                <span>{item.discountMethod =='PHAN_TRAM'? '%': 'đ'}</span>
                                            </Tag>
                                        </li>
                                        <li className="small">
                                            Đơn tối thiểu: <FormatCurrency value={item.minOrderValue} />
                                        </li>
                                        <li className="small">
                                            Đơn tối đa: <FormatCurrency value={item.maxDiscountValue} />
                                        </li>
                                        <li className="small">
                                            Ngày kết thúc: <FormatDate date={item.endDate} />
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="voucher"
                                        checked={selectedVoucher === item.code}
                                    />
                                </div>
                                <span className="position-absolute top-0 start-100 translate-middle badge bg-warning">
                                    x {item.quantity}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </Modal>
        </>
    );
}

export default VoucherOrder;
