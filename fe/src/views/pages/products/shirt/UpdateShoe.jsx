import { Button, Col, Form, Input, Modal, Row, Select, Switch, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconEdit, IconSettings } from "@tabler/icons-react";
import * as request from "views/utilities/httpRequest";
import debounce from "lodash/debounce"; // Import debounce function

function UpdateShoe({ props, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        console.log(data);
        request.put(`/shirt/${props.id}`, data).then(response => {
            toast.success('Cập nhật thành công!');
            setIsModalOpen(false);
            onSuccess();
        }).catch(e => {
            console.log(e)
            if (e.response.status === 500) {
                toast.error(e.response.data);
            }
            toast.error(e.response.data.message);
        })
        // setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        request.get('/category', { params: { name: searchCate } }).then((response) => {
            setCateList(response.data);
        });
    }, [searchCate])


    return (
        <>
            <Tooltip placement="bottom" title="Chỉnh sửa sản phẩm">
                <Button type="primary" className="bg-primary" onClick={showModal}><i className="fas fa-edit me-1"><IconEdit /></i></Button>
            </Tooltip>
            <Modal title="Cập nhật thông tin sản phẩm" open={isModalOpen} onCancel={handleCancel} footer="">
                <Form onFinish={handleOk} layout="vertical" initialValues={{
                    ten: props.ten,
                    // danhMuc: props.danhMuc.id,
                }}>
                    <Row gutter={10}>
                        <Col xl={24}>
                            <Form.Item label={"Tên giày"} name={"ten"} rules={[{ required: true, message: "Tên không được để trống!" }]}>
                                <Input placeholder="Nhập tên giày..." />
                            </Form.Item>
                        </Col>
                        <Col xl={12}>
                            <Form.Item label={"Danh mục"} name={"danhMuc"} rules={[{ required: true, message: "Danh mục không được để trống!" }]}>
                                <Select className="me-2" showSearch optionFilterProp="children" style={{ width: 470 }} onSearch={setSearchCate} placeholder="Chọn danh mục...">
                                    <Option value="">-- Chọn danh mục --</Option>
                                    {cateList.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.ten}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                    </Row>
                    <div className="d-flex justify-content-end align-items-center">
                        <Button type="primary" htmlType="submit" className='bg-primary'><i className="fas fa-edit me-1"></i> Cập nhật</Button>
                    </div>
                </Form>
                <ToastContainer />
            </Modal>

        </>
    );
}

export default UpdateShoe;