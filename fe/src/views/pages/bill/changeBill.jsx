import { Button, Col, Form, Input, Modal, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {useEffect} from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import GHN from 'ui-component/GHN';
import * as request from "views/utilities/httpRequest";

function changeBill({bill, onSuccess}){
    // Kiểm soát modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Địa chỉ
    const [address, setAddress] = useState([]);

    // Phí ship
    const [moneyShip, setMoneyShip] = useState(0);
    
    const [form] = Form.useForm();

    // Tổng số lượng sản phẩm trong đơn hàng
    const [totalWeight, setTotalWeight] = useState(0);


    // Hàm show modal
    const showModal = () => {
        setAddress({
            province: bill?.address?.split("##")[3],
            district: bill?.address?.split("##")[2],
            ward: bill?.address?.split("##")[1],
        });
        form.setFieldsValue({
            customerName: bill?.customerName,
            phoneNumber: bill?.phoneNumber,
            // Địa chỉ cụ thể
            specificAddress: bill?.address?.split("##")[0],
        });
        setIsModalOpen(true);
    };

    // Hàm này xử lý nút OK
    const handleOk = () => {
        setIsModalOpen(false);
    };

    // Hàm này xử lý nút Cancel
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    // Hàm này để tính phí vận chuyển
    const caculateFee = async () => {
        await request.post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
                service_id: 53320,
                service_type_id: null,
                to_district_id: parseInt(address.district),
                to_ward_code: address.ward,
                height: 50,
                length: 20,
                weight: totalWeight,
                width: 20,
                cod_failed_amount: 2000,
                insurance_value: 10000,
                coupon: null,
            },
            {
                headers: {
                    Token: "aef361b5-f26a-11ed-bc91-ba0234fcde32",
                    "Content-Type": "application/json",
                    ShopId: 124173,
                },
            }
        ).then((response) => {
            setMoneyShip(response.data.data.total);
        }).catch((e) => {
            console.log(e);
        });
    };

    
    // Hàm này tính trọng lượng các mặt hàng
    const caculateWeight = async () => {
        await request.get(`/bill-detail`, {
            params: {
                bill: bill.id,
                page: 1,
                sizePage: 1_000_000,
            }
        }).then((response) => {
            const calculateTotalWeight = response.data.reduce((total, item) => {
                return total + item.weight * item.quantity;
            }, 0);
            setTotalWeight(calculateTotalWeight);
        }).catch((e) => {
            console.log(e);
        });
    }
    
    // Khởi tạo địa chỉ và tính phí vận chuyển
    useEffect(() => {
        setAddress({
            province: bill?.address?.split("##")[3],
            district: bill?.address?.split("##")[2],
            ward: bill?.address?.split("##")[1],
        });
        form.setFieldsValue({
            customerName: bill?.customerName,
            phoneNumber: bill?.phoneNumber,
            specificAddress: bill?.address?.split("##")[0],
        });
        caculateWeight();
    }, [bill]);
    
    useEffect(() => {
        tinhPhiVC();
    }, [address]);
    
    // Hàm cập nhật
    useEffect(() => {
        caculateFee();
    }, [address])
    const handleChangeInfo = (data) => {
        const newData = { ...data };
        newData.address = `${data.specificAddress}##${data.ward}##${data.district}##${data.province}`;
        newData.moneyShip = moneyShip;
        request.put(`/bill/change-info-customer/${bill.id}`, newData).then(response => {
            toast.success("Cập nhật thành công!");
            onSuccess();
            setIsModalOpen(false);
        }).catch(e => {
            console.log(e);
        })
    }

    return (
        <>
            <Button type="primary" className='text-dark bg-warning' onClick={showModal}>Thay đổi thông tin</Button>
            <Modal
                title={"Thay đổi thông tin"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={700}
                footer={
                    <>
                        <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button onClick={() => form.submit()} type="primary">Thay đổi thông tin</Button>
                    </>
                }
            >
                <Form form={form} layout='vertical' onFinish={(data) => handleChangeInfo(data)}>
                    <Row gutter={10}>
                        <Col xl={12}>
                            <Form.Item label="Tên người nhận" name={"customerName"} rules={[{ required: true, message: "Tên người nhận không được để trống!", },]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xl={12}>
                            <Form.Item label="Số điện thoại" name={"phoneNumber"} rules={[{ required: true, message: "SĐT người nhận không được để trống!", },]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <GHNInfo distr={address.district} dataAddress={(data) => setAddress({ ...address, ...data })} prov={address.province} war={address.ward} />
                        <Col xl={24}>
                            <Form.Item label="Địa chỉ cụ thể" name={"specificAddress"} rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!", },]}>
                                <TextArea />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <small><i><span className='text-danger'>*Lưu ý: </span> Thay đổi địa chỉ nhận hàng sẽ dẫn đến sự thay đổi về phí vận chuyển</i></small>
            </Modal>
        </>
    )
}

export default changeBill