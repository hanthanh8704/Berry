import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'antd';
import { SketchPicker } from 'react-color';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from 'views/utilities/httpRequest';
import namer from 'color-namer';

function AddColorCode({ name, placeholder, onSuccess, visible, onCancel }) {
  const [form] = Form.useForm();
  const [existingItems, setExistingItems] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [colorName, setColorName] = useState('');

  useEffect(() => {
    if (visible) {
      const successMessage = sessionStorage.getItem('colorAddSuccess') || sessionStorage.getItem('colorUpdateSuccess');
      if (successMessage) {
        toast.success(successMessage);
        sessionStorage.removeItem('colorAddSuccess');
        sessionStorage.removeItem('colorUpdateSuccess');
      }
    }
  }, [visible]);

  useEffect(() => {
    const loadExistingItems = async () => {
      try {
        const response = await request.get(`/${name}`);
        setExistingItems(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadExistingItems();
  }, [name]);

  const handleColorChange = (color) => {
    setNewColor(color.hex);
    const names = namer(color.hex).basic;
    setColorName(names[0].name);
  };

  const handleSubmit = async (data) => {
    const duplicate = existingItems.some((item) => item.ten.toLowerCase() === data.ten.toLowerCase());
    if (duplicate) {
      toast.error(`Tên ${placeholder} này đã tồn tại!`, { autoClose: 3000, closeOnClick: true });
      return;
    }

    try {
      const response = await request.post(`/${name}/create`, data);
      if (response.status === 200) {
        form.resetFields();
        toast.success('Thêm thành công!', { autoClose: 3000, closeOnClick: true });
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding data:', error);
      toast.error(`Tên ${placeholder} này đã tồn tại!`, { autoClose: 3000, closeOnClick: true });
    }
  };

  const handleOk = () => {
    const data = { ten: colorName, code: newColor };
    handleSubmit(data);
  };

  return (
    <Modal
      title="Thêm màu sắc"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm mới
        </Button>,
      ]}
    >
      <ToastContainer autoClose={3000} closeOnClick />
      <Form form={form} layout="vertical">
        <Form.Item label="Mã màu">
          <SketchPicker color={newColor} onChange={handleColorChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddColorCode;
