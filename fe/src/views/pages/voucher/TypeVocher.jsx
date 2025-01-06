import React from 'react';
import { Tag } from 'antd';

// Component hiển thị trạng thái voucher
const VoucherType = ({ discountMethod }) => {
  let name;

  // Xác định tên và biểu tượng dựa trên trạng thái
  if (discountMethod === 'PHAN_TRAM') {
    name = '%';
  } else if (discountMethod === 'CO_DINH') {
    name = 'VND';
  } else {
    name = 'Không xác định';

  }

  return (
    <Tag
      style={{
        display: 'flex',
        border:'none',
        marginTop: '2px',
        backgroundColor: 'white',
      }}
    >
    {name}
    </Tag>
  );
};

export default VoucherType;
