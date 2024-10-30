import { Button, Col, Form, Input, Modal, Row, Select, Tooltip, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconEdit } from "@tabler/icons-react";
import * as request from "views/utilities/httpRequest";
import debounce from "lodash/debounce";

const { Option } = Select;

function UpdateShirt({ props, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (data) => {
        console.log(data);
        request.put(`/shirt/${props.id}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                messageApi.success({
                    content: 'Cập nhật thành công!',
                    duration: 3,
                });
                setIsModalOpen(false);
                onSuccess();
            })
            .catch(e => {
                console.log(e);
                if (e.response && e.response.status === 500) {
                    messageApi.error({
                        content: e.response.data,
                        duration: 3,
                    });
                } else if (e.response && e.response.data.message) {
                    messageApi.error({
                        content: e.response.data.message,
                        duration: 3,
                    });
                } else {
                    messageApi.error({
                        content: 'Có lỗi xảy ra!',
                        duration: 3,
                    });
                }
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const loadCate = () => {
        request.get("/category", { params: { name: searchCate } })
            .then((response) => {
                setCateList(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh mục:", error);
                messageApi.error({
                    content: 'Không thể tải danh mục',
                    duration: 3,
                });
            });
    };

    useEffect(() => {
        loadCate();
    }, [searchCate]);

    return (
        <>
            {contextHolder}
            <Tooltip placement="bottom" title="Chỉnh sửa sản phẩm">
                <Button type="primary" style={{ backgroundColor: '#5e35b1' }} onClick={showModal}>
                    <i className="fas fa-edit me-1"><IconEdit /></i>
                </Button>
            </Tooltip>
            <Modal
                title="Cập nhật thông tin sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    onFinish={handleOk}
                    layout="vertical"
                    initialValues={{
                        name: props.name,
                        category: props.category ? props.category.name : undefined,
                    }}>
                    <Row gutter={10}>
                        <Col xl={24}>
                            <Form.Item
                                label="Tên áo"
                                name="name"
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên áo!" },
                                    { whitespace: true, message: "Không được chỉ là khoảng trắng!" },
                                    { pattern: /^[A-Za-zÀ-ỹ0-9\s'-]+$/, message: "Tên áo chỉ được chứa các ký tự chữ cái, số và không được là khoảng trắng!" },
                                ]}>
                                <Input placeholder="Nhập tên áo..." />
                            </Form.Item>
                        </Col>
                        <Col xl={12}>
                            <Form.Item
                                label="Danh mục"
                                name="category"
                                rules={[{ required: true, message: "Danh mục không được để trống!" }]}>
                                <Select
                                    className="me-2"
                                    showSearch
                                    optionFilterProp="children"
                                    style={{ width: 470 }}
                                    onSearch={debounce(setSearchCate, 500)}
                                    placeholder="Chọn danh mục...">
                                    <Option value="">-- Chọn danh mục --</Option>
                                    {cateList.map(item => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end align-items-center">
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#5e35b1' }}>
                            <i className="fas fa-edit me-1"></i> Cập nhật
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
}

export default UpdateShirt;