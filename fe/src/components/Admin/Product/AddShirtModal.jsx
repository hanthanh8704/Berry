import React, { useEffect, useState } from "react";
import * as request from "views/utilities/httpRequest";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { IconPlus } from "@tabler/icons-react";
import AddProperties from "./AddProperties";

function AddShirtModal({ onAddSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (data) => {
        console.log(data);
        request.post('/shirt/create', data).then(response => {
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
        request
            .get("/category", { params: { name: searchCate } })
            .then((response) => {
                setCateList(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh mục:", error);
            });
    };

    useEffect(() => {
        loadCate();
    }, [searchCate]);

    return (
        <>
            <ToastContainer />
            <Button type="primary" onClick={showModal} className="bg-primary" size="large">
                <IconPlus />
            </Button>
            <Modal title="Thêm áo" visible={isModalOpen} onCancel={handleCancel} footer="">
                <Form form={form} onFinish={handleOk} layout="vertical">
                    <Form.Item
                        label="Tên áo"
                        name="ten"
                        rules={[{ required: true, message: "Tên không được để trống!" }]}
                    >
                        <Input placeholder="Nhập tên áo..." />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name="danhMuc"
                        rules={[{ required: true, message: "Danh mục không được để trống!" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            onSearch={setSearchCate}
                            placeholder="Chọn danh mục..."
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Space className="my-2 ms-2">
                                        <AddProperties
                                            placeholder="danh mục"
                                            name="ten"
                                            onSuccess={() => loadCate()}
                                        />
                                    </Space>
                                </>
                            )}
                        >
                            <Option value="">-- Chọn danh mục --</Option>
                            {cateList.map((item) => (
                                <Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit">
                            <IconPlus /> Thêm
                        </Button>
                    </div>
                </Form>
            </Modal>

        </>
    );
}

export default AddShirtModal;