import React from 'react';
import { Modal, Button, InputNumber } from 'antd';

const ProductSelectModal = ({ visible, onClose, product, quantity, setQuantity, onConfirm }) => {
  if (!product) return null;

  return (
    <Modal
      title={product.name}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <p>Kích cỡ: {product.size}</p>
        <p>Giá: <strike>{product.oldPrice} VND</strike> <strong>{product.price} VND</strong></p>
        <p>Số lượng: 
          <InputNumber min={1} max={100} value={quantity} onChange={setQuantity} />
        </p>
        <Button type="primary" onClick={onConfirm}>Xác nhận</Button>
      </div>
    </Modal>
  );
};

export default ProductSelectModal;
