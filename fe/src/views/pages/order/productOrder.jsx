import { Button, Carousel, Col, Form, Input, Modal, Row,message } from 'antd';
import React, { useState,useEffect } from 'react'
import { toast } from 'react-toastify';
import FormatCurrency from 'views/utilities/FormatCurrency';
import * as request from 'views/utilities/httpRequest';

function ProductOrder({ sanPham, idHoaDon }) {
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [sanPhamChiTiet, setSanPhamChiTiet] = useState(null);

    const [kichCo, setKichCo] = useState(null);
    const [mauSac, setMauSac] = useState(null);

    useEffect(() => {
        setSanPhamChiTiet(null);
        setMauSac(null);
        setKichCo(null);
    }, [isModalDetailOpen])
    useEffect(() => {
        request.get('/shirt-detail', {
            params: {
                sanPham: product.id,
                mauSac: color,
                kichCo: size
            }
        }).then(response => {
            if (kichCo !== null && mauSac !== null) {
                setSanPhamChiTiet(response.data[0]);
            }
        }).catch(e => {
            console.log(e);
        })
        if (kichCo === null || mauSac === null) {
            setSanPhamChiTiet(null);
        }
    }, [kichCo, mauSac, sanPham.id]);

    const handleChoose = (data) => {
        if (mauSac === null) {
            message.error("Vui lòng chọn màu sắc!");
        } else if (kichCo === null) {
            message.error("Vui lòng chọn kích cỡ!");
        } else {
            if (sanPhamChiTiet === undefined) {
                message.error("Sản phẩm này không tồn tại!");
            } else {
                data.sanPhamChiTiet = sanPhamChiTiet?.code;
                data.bill = id;
                console.log(data);
                request.post('/bill-detail', data).then(response => {
                    message.success('Thêm thành công!');
                    setIsModalDetailOpen(false);
                }).catch(e => {
                    console.log(e);
                })
            }
        }
    }

    return (
        <>
            <i className='fas fa-cart-plus w-100' onClick={() => setIsModalDetailOpen(true)}></i>
            <Modal title={sanPham.name} 
            open={isModalDetailOpen} onCancel={() =>
             setIsModalDetailOpen(false)} footer="" width={800} key={sanPham.id}>
                <Row gutter={10}>
                    <Col xl={8}>
                        <Carousel autoplay autoplaySpeed={2700} dots={false} arrows={false} className='w-100'>
                            {sanPhamChiTiet != null | sanPhamChiTiet != undefined ?
                                sanPhamChiTiet.images.split(',').map((image, index) => (
                                    <div className="" style={{ height: "300px" }}>
                                        <img src={image} alt="images" style={{ width: "100%", height: "300px" }} className="object-fit-cover" />
                                    </div>
                                ))
                                :
                                sanPham.images.split(',').map((image, index) => (
                                    <div className="" style={{ height: "300px" }}>
                                        <img src={image} alt="images" style={{ width: "100%", height: "300px" }} className="object-fit-cover" />
                                    </div>
                                ))
                            }
                        </Carousel>
                        <Row gutter={10} className='text-center mt-3'>
                            {sanPhamChiTiet != null | sanPhamChiTiet != undefined ?
                                sanPhamChiTiet.images.split(',').map((image, index) => (
                                    <Col xl={6} style={{ height: "64px" }}>
                                        <img src={image} alt="" style={{ height: "64px" }} className='w-100 object-fit-cover' />
                                    </Col>
                                ))
                                : ""}
                        </Row>
                    </Col>
                    <Col xl={16}>
                        <ul className='list-unstyled'>
                            <li>
                                <h5>
                                    {sanPhamChiTiet != null | sanPhamChiTiet != undefined ? sanPhamChiTiet?.ten : sanPham.ten}
                                </h5>
                            </li>
                            <li className='mb-2 fw-semibold fs-5 text-danger'>
                                {sanPhamChiTiet != null | sanPhamChiTiet != undefined ? (<FormatCurrency value={sanPhamChiTiet?.gia} />) : (
                                    <>
                                        <FormatCurrency value={sanPham.minPrice} /> - <FormatCurrency value={shoe.maxPrice} />
                                    </>
                                )}
                            </li>
                            <li className='mb-2'>
                                {JSON.parse(`[${sanPham.mauSac}]`).map((item, index) => (
                                    <Button onClick={() => setMauSac(item.id)}
                                        type='text' className={`border border-warning me-2 ${mauSac === item.id && 'bg-warning'}`}>
                                        {item.ten}
                                    </Button>
                                ))}
                                {mauSac !== null &&
                                    <span className='text-secondary' style={{ cursor: "pointer" }} onClick={() => setMauSac(null)}>
                                        <i className='fas fa-xmark-circle'></i> Xóa
                                    </span>
                                }
                            </li>
                            <li className='mb-2'>
                                {JSON.parse(`[${sanPham.kichCo}]`).map((item, index) => (
                                    <Button onClick={() => setKichCo(item.id)}
                                        type='text' className={`border border-warning me-2 ${kichCo === item.id && 'bg-warning'}`}>
                                        {item.ten}
                                    </Button>
                                ))}
                                {kichCo !== null &&
                                    <span className='text-secondary' style={{ cursor: "pointer" }} onClick={() => setKichCo(null)}>
                                        <i className='fas fa-xmark-circle'></i> Xóa
                                    </span>
                                }
                            </li>
                            <li className='mb-2'>
                                {sanPhamChiTiet === undefined && <span className='text-danger'>Sản phẩm này không tồn tại!</span>}
                                {sanPhamChiTiet != null | sanPhamChiTiet != undefined ? <p className='text-secondary'>Số lượng hiện có: {sanPhamChiTiet?.soLuong}</p> : ''}
                                <Form onFinish={handleChoose}>
                                    <Row gutter={10}>
                                        <Col xl={12}>
                                            <Form.Item initialValue={1} name={"quantity"} rules={[{ validator: (rule, value) => { if (value > sanPhamChiTiet?.soLuong) { return Promise.reject(`Số lượng không được lớn hơn ${shoeDetail?.quantity}`); } return Promise.resolve(); }, },]}>
                                                <Input type='number' className='text-center' />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={12}>
                                            <Button htmlType='submit' type='primary' className='bg-warning w-100' icon={<i className='fas fa-cart-plus'></i>}>Thêm vào giỏ hàng</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}
export default ProductOrder;