import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message } from 'antd';
import * as request from "views/utilities/httpRequest";

function AddProperties({ name, placeholder, onSuccess }) {
    const [form] = Form.useForm();
    const [existingItems, setExistingItems] = useState([]);

    useEffect(() => {
        // Load existing items to check for duplicates
        const loadExistingItems = async () => {
            try {
                const response = await request.get(`/${name}`);
                setExistingItems(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadExistingItems();
    }, [name]);

    const handleSubmit = async (data) => {
        const duplicate = existingItems.some(item => item.name.toLowerCase() === data.name.toLowerCase());
        if (duplicate) {
            message.error(`Tên ${placeholder} này đã tồn tại!`, 3); // Thông báo lỗi
            return;
        }

        try {
            const response = await request.post(`/${name}/create`, data);
            if (response.status === 200) {
                form.resetFields();
                message.success('Thêm thành công!', 3); // Thông báo thành công
                onSuccess();
            }
        } catch (error) {
            console.error("Error adding data:", error);
            message.error(`Thêm thất bại: ${error.response?.data || "Lỗi không xác định"}`, 3); // Thông báo lỗi nếu thất bại
        }
    };

    return (
        <Form className='d-flex' onFinish={handleSubmit} form={form}>
            <Form.Item
                name="name"
                rules={[
                    { required: true, message: `Vui lòng nhập ${placeholder}!` },
                    { whitespace: true, message: "Không được chỉ là khoảng trắng!" },
                    { pattern: /^[A-Za-zÀ-ỹ0-9\s'-]+$/, message: `Tên chỉ được chứa các ký tự chữ cái, số và không được là khoảng trắng!` },
                ]}
                className='me-1 p-0 m-0'
            >
                <Input placeholder={`Thêm ${placeholder}`} />
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#5e35b1' }} icon={<i className="fas fa-plus"></i>}>Thêm</Button>
        </Form>
    );
}

export default AddProperties;
