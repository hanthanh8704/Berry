import React from 'react';
import { Tag } from 'antd';

// Component hiển thị trạng thái voucher
const VoucherStatus = ({ status }) => {
  let color;
  let icon;
  let name;

  // Xác định màu sắc, tên và biểu tượng dựa trên trạng thái
  if (status === 'SAP_DIEN_RA') {
    color = '#87d068';
    name = "Sắp diễn ra";
    icon = <i className="fas fa-clock me-1"></i>;
  } else if (status === 'DANG_DIEN_RA') {
    color = '#108ee9';
    name = "Đang diễn ra";
   icon = <i className="fas fa-times me-1"></i>;
  } else if (status === 'DA_KET_THUC') {
    color = '#f50';
    name = "Đã kết thúc";
    icon = <i className="fas fa-play me-1"></i>; 
  } else {
    color = '#3c6382';
    name = "Không xác định"; // Cung cấp tên cho trường hợp không xác định
    icon = <i className="fas fa-question-circle me-1"></i>; // Biểu tượng cho trạng thái không xác định
  }

  return (
    <Tag
      style={{ width: '120px' }}
      className="text-center"
      color={color}
    >
      {icon} {name} {/* Hiển thị biểu tượng và tên */}
    </Tag>
  );
};

export default VoucherStatus;