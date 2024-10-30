import React from 'react';
import { Tag } from 'antd';

const VoucherStatus = ({ status }) => {
  let color;
  let icon;

  if (status === 'Sắp diễn ra') {
    color = '#87d068';
    icon = <i className="fas fa-clock me-1"></i>;
  } else if (status === 'Đang diễn ra') {
    color = '#f50';
    icon = <i className="fas fa-times me-1"></i>;
  } else if(status === 'Đã kết thúc'){
    color = '#108ee9';
    icon = <i className="fas fa-play me-1"></i>;
  }else {
    color = '#3c6382';
    icon = <i className="fas fa-play me-1"></i>;
  }

  return (
    <Tag
      style={{ width: '120px' }}
      className="text-center"
      color={color}
      icon={icon}
    >
      {status}
    </Tag>
  );
};

export default VoucherStatus;
