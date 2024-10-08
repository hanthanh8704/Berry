import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Form, Input, Button } from 'antd';
import { KeyOutlined } from '@ant-design/icons';

const Password = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='mx-3' style={{ backgroundColor: 'white' }}>
            <h2>Đổi mật khẩu</h2>
            <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
            <Form
                name="passwordChange"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                >
                    <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu hiện tại" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu mới" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu mới!' }]}
                >
                    <Input.Password prefix={<KeyOutlined />} placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>

                <Form.Item>
                    <Button  htmlType="submit" style={{ width: '100%' , color:'#6A0DAD' , border: '1px solid #6A0DAD' }}>
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Password;
