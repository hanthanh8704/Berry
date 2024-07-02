import React, { useEffect, useState } from "react";

import * as request from "views/utilities/httpRequest"

import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Select, Space } from "antd";

import { Option } from "antd/es/mentions";

import AddProperties from "./AddProperties";


function AddShirtModal({ onAddSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);
    const [searchBrand, setSearchBrand] = useState(null);
    const [brandList, setBrandList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        console.log(data);
        request.post('/shirt', data).then(response => {
            toast.success("Thêm thành công!");
            onAddSuccess();
            form.resetFields();
            setIsModalOpen(false);
        }).catch(e => {
            console.log(e);
            toast.error(e.response.data);
        })
        // setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const loadCate = () => {
        request.get('/category', { params: { name: searchCate } }).then((response) => {
            setCateList(response.data);
        });
    }

    const loadBrand = () => {
        request.get('/brand', { params: { name: searchBrand } }).then((response) => {
            setBrandList(response.data);
        });
    }
    useEffect(() => {
        loadCate();
    }, [searchCate])

    useEffect(() => {
        loadBrand();
    }, [searchBrand])

    return (
        <>
            <Button type="primary" onClick={showModal} className="bg-primary" size="large">
            </Button>
            <Modal title="Thêm giày" open={isModalOpen} onCancel={handleCancel} footer="">
                <Form onFinish={handleOk} layout="vertical" form={form}>
                    <Form.Item label={"Tên giày"} name={"shirt"} rules={[{ required: true, message: "Tên không được để trống!" }]}>
                        <Input placeholder="Nhập tên giày..." />
                    </Form.Item>
                    <Form.Item label={"Danh mục"} name={"category"} rules={[{ required: true, message: "Danh mục không được để trống!" }]}>
                        <Select className="me-2" showSearch optionFilterProp="children"
                            style={{ width: '100%' }} onSearch={setSearchCate} placeholder="Chọn danh mục..."
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space className="my-2 ms-2">
                                        <AddProperties placeholder={"danh mục"} name={"category"} onSuccess={() => loadCate()} />
                                    </Space>
                                </>
                            )}>
                            <Option value="">-- Chọn danh mục --</Option>
                            {cateList.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={"Thương hiệu"} name={"brand"} rules={[{ required: true, message: "Thương hiệu không được để trống!" }]}>
                        <Select className="me-2" showSearch optionFilterProp="children"
                            style={{ width: '100%' }} onSearch={setSearchBrand} placeholder="Chọn thương hiệu..."
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space className="my-2 ms-2">
                                        <AddProperties placeholder={"thương hiệu"} name={"brand"} onSuccess={() => loadBrand()} />
                                    </Space>
                                </>
                            )}>
                            <Option value="">-- Chọn thương hiệu --</Option>
                            {brandList.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit"><i className="fas fa-plus-circle me-1"></i> Thêm</Button>
                    </div>
                </Form>
            </Modal>

        </>
    );
}

export default AddShirtModal;
