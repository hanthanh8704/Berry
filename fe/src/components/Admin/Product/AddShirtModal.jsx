import React, { useEffect, useState } from "react";
import * as request from "views/utilities/httpRequest";
import { Button, Form, Input, Modal, Select, Space, Tooltip, message } from "antd";
import { IconPlus } from "@tabler/icons-react";
import AddProperties from "./AddProperties";

function AddShirtModal({ onAddSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchCate, setSearchCate] = useState(null);
    const [cateList, setCateList] = useState([]);
    const [searchShirt, setSearchShirt] = useState(null);
    const [shirtList, setShirtList] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = (data) => {
        const duplicate = shirtList.some(shirt => shirt.name.toLowerCase() === data.name.toLowerCase());
        if (duplicate) {
            form.setFields([{ name: "name", errors: ["Tên áo đã tồn tại. Vui lòng chọn tên khác."] }]);
            message.error("Tên áo đã tồn tại. Vui lòng chọn tên khác.", 2); // 2 giây
            return;
        }

        // Gửi yêu cầu POST thêm áo
        request.post("/shirt/create", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    message.success("Thêm thành công!", 2); // Thông báo thành công
                    onAddSuccess();
                    form.resetFields();
                    setIsModalOpen(false);
                }
            })
            .catch((e) => {
                console.error("Lỗi khi thêm áo:", e);
                message.error(e.response ? e.response.data : "Lỗi không xác định", 2); // Thông báo lỗi
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
            });
    };

    const loadShirts = () => {
        request.get("/shirt", { params: { name: searchShirt } })
            .then((response) => {
                setShirtList(response.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách áo:", error);
            });
    };

    useEffect(() => {
        loadShirts();
    }, [searchShirt]);

    useEffect(() => {
        loadCate();
    }, [searchCate]);

    return (
        <>
            <Tooltip placement="bottom" title="Thêm mới sản phẩm">
                <Button title="Thêm sản phẩm" type="primary" onClick={showModal} style={{ backgroundColor: "#5e35b1" }} size="large">
                    <IconPlus />
                </Button>
            </Tooltip>

            <Modal title="Thêm áo" open={isModalOpen} onCancel={handleCancel} footer="">
                <Form form={form} onFinish={handleOk} layout="vertical">
                    <Form.Item
                        label="Tên áo"
                        name="name"
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
                        name="category"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
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
                                        <AddProperties placeholder="danh mục" name="category" onSuccess={loadCate} />
                                    </Space>
                                </>
                            )}
                        >
                            <Select.Option value="">-- Chọn danh mục --</Select.Option>
                            {cateList.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="d-flex justify-content-end">
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#5e35b1" }}>
                            <IconPlus /> Thêm
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
}

export default AddShirtModal;
