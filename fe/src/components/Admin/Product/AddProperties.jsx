import { Button, Form, Input } from 'antd';
import React from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";
import * as request from "views/utilities/httpRequest";

function AddProperties({ name, placeholder, onSuccess }) {
    const [form] = Form.useForm();
    const handleSubmit = (data) => {
        request.post(`/${name}/create`, data).then(response => {
            form.resetFields();
            toast.success('Thêm thành công!');

            onSuccess();
        }).catch(e => {
            form.resetFields();
            toast.error(e.response.data);
            console.log("Error: " + e.response.data);
            console.log("theem that bai!");
        })
    }
    return (
        <>
            <Form className='d-flex' onFinish={handleSubmit} form={form}>
                <Form.Item name={"ten"} rules={[{ required: true, message: "Không được để trống!" },]} className='me-1 p-0 m-0'>
                    <Input placeholder={`Thêm ${placeholder}`} />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ backgroundColor: "blue" }} icon={<i className="fas fa-plus"></i>}>Thêm</Button>
            </Form>
            <ToastContainer />
        </>
    )
}

export default AddProperties