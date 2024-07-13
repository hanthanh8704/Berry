import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import * as request from "views/utilities/httpRequest";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IconPlus } from "@tabler/icons-react";
import AddProperties from "./AddProperties";

function AddShirtModal({ onAddSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchCate, setSearchCate] = useState(null);
    const [searchShirt, setSearchShirt] = useState(null);
    const [cateList, setCateList] = useState([]);
    const [shirtList, setShirtList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        loadShirts();
    }, [searchShirt]);

    const loadShirts = () => {
        request
            .get("/shirt", { params: { name: searchShirt, status: false, sizePage: 1_000_000 } })
            .then((response) => {
                setShirtList(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách áo:", error);
            });
    };

    const handleOk = async (data) => {
        const duplicate = shirtList.some(shirt => shirt.ten.toLowerCase() === data.ten.toLowerCase());
        if (duplicate) {
            form.setFields([
                {
                    name: 'ten',
                    errors: ['Tên áo đã tồn tại. Vui lòng chọn tên khác.'],
                },
            ]);
            return;

        }

        try {
            const response = await request.post('/shirt/create', data);
            if (response.status === 200) {
                toast.success('Thông báo thành công!', { autoClose: 3000, closeOnClick: true });
                onAddSuccess(loadShirts);

                form.resetFields();
                setIsModalOpen(false);
            }
        } catch (e) {
            console.log(e);
            toast.error(e.response.data);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const loadCate = () => {
        request
            .get("/category", { params: { name: searchCate, status: false, sizePage: 1_000_000 } })
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
            <ToastContainer autoClose={3000} closeOnClick />
            <Button type="primary" onClick={showModal}
                style={{ backgroundColor: '#5e35b1' }} size="large">
                <IconPlus />
            </Button>
            <Modal title="Thêm áo" visible={isModalOpen} onCancel={handleCancel} footer="">
                <Form form={form} onFinish={handleOk} layout="vertical">
                    <Form.Item
                        label="Tên áo"
                        name="ten"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên áo!" },
                            { whitespace: true, message: "Không được chỉ là khoảng trắng!" },
                            { pattern: /^[A-Za-zÀ-ỹ0-9\s'-]+$/, message: "Tên áo chỉ được chứa các ký tự chữ cái, số và không được là khoảng trắng!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên áo..." />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="danhMuc"
                        rules={[
                            { required: true, message: "Vui lòng chọn tên danh mục!" },
                        ]}
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
                                            name="category"
                                            onSuccess={() => loadCate()}
                                        />
                                    </Space>
                                </>
                            )}
                        >
                            <Select.Option value="">-- Chọn danh mục --</Select.Option>
                            {cateList.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#5e35b1' }}>
                            <IconPlus /> Thêm
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
}

export default AddShirtModal;
