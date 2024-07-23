import React from 'react';
import { Modal, Button, InputNumber } from 'antd';

const ProductSelectModal = ({ visible, onClose, product, quantity, setQuantity, onConfirm }) => {
  if (!product) return null;

  return (
    <Modal
      title={product.ten}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <p>Loại giày: {product.loaiGiay}</p>
        <p>Thương hiệu: {product.thuongHieu}</p>
        <p>Kích cỡ: {product.size}</p>
        <p>Giá: <strike>{product.oldPrice} VND</strike> <strong>{product.newPrice} VND</strong></p>
        <p>Số lượng: 
          <InputNumber min={1} max={100} value={quantity} onChange={setQuantity} />
        </p>
        <Button type="primary" onClick={onConfirm}>Xác nhận</Button>
      </div>
    </Modal>
  );
};

export default ProductSelectModal;
