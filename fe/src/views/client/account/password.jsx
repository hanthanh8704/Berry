import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Form, Input, Button, message } from 'antd'; // Thêm message để hiển thị thông báo
import { KeyOutlined } from '@ant-design/icons';
import axios from 'axios'; // Dùng axios để gửi yêu cầu tới backend

const Password = () => {
    const onFinish = (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }

        // Gọi API đổi mật khẩu
        axios.post('http://localhost:8080/api/client/auth/change-password', {
            email: localStorage.getItem('userEmail'),  // Giả sử bạn đã lưu email người dùng trong localStorage
            oldPassword: values.currentPassword,
            newPassword: values.newPassword,
        })
            .then((response) => {
                message.success('Đổi mật khẩu thành công!');
            })
            .catch((error) => {
                message.error('Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại!');
                console.error('Lỗi:', error);
            });
    };

    const passwordRules = [
        {
            required: true,
            message: 'Vui lòng nhập mật khẩu hiện tại!',
        },
        {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 
            message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa và số!' 
        },
    ];

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
                    rules={passwordRules}
                >
                    <Input.Password prefix={<KeyOutlined />} placeholder="Mật khẩu mới" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lại mật khẩu mới!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<KeyOutlined />} placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>


                <Form.Item>
                    <Button htmlType="submit" style={{ width: '100%', color: '#6A0DAD', border: '1px solid #6A0DAD' }}>
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Password;
