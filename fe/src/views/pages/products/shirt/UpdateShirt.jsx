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

function UpdateShirt({ props, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = (data) => {
        console.log(data);
        request.put(`/shirt/${props.id}`, data).then(response => {
            toast.success('Cập nhật thành công!', { autoClose: 3000, closeOnClick: true });
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
        request.get('/category', { params: { name: searchCate, status: false, sizePage: 1_000_000 } }).then((response) => {
            setCateList(response.data);
        });
    }, [searchCate])


    return (
        <>
            <ToastContainer />
            <Tooltip placement="bottom" title="Chỉnh sửa sản phẩm">
                <Button type="primary" style={{ backgroundColor: '#5e35b1' }} onClick={showModal}><i className="fas fa-edit me-1"><IconEdit /></i></Button>
            </Tooltip>
            <Modal title="Cập nhật thông tin sản phẩm" open={isModalOpen} onCancel={handleCancel} footer="">
                <Form onFinish={handleOk} layout="vertical" initialValues={{
                    ten: props.ten,


                }}>
                    <Row gutter={10}>
                        <Col xl={24}>
                            <Form.Item label={"Tên áo"} name={"ten"} rules={[
                                { required: true, message: "Vui lòng nhập tên áo!" },
                                { whitespace: true, message: "Không được chỉ là khoảng trắng!" },
                                { pattern: /^[A-Za-zÀ-ỹ0-9\s'-]+$/, message: "Tên áo chỉ được chứa các ký tự chữ cái, số và không được là khoảng trắng!" },
                            ]}>
                                <Input placeholder="Nhập tên áo..." />
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
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#5e35b1' }}><i className="fas fa-edit me-1"></i> Cập nhật</Button>
                    </div>
                </Form>

            </Modal>

        </>
    );
}

export default UpdateShirt;