import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
const VoucherStatus = ({ status }) => {
  if (status === 'Sắp diễn ra') {
    return <span className="badge bg-success">Sắp diễn ra</span>;
  } else if (status === 'Đã kết thúc') {
    return <span className="badge bg-danger">Đã kết thúc</span>;
  } else {
    return <span className="badge bg-primary">Đang diễn ra</span>;
  }
};

export default VoucherStatus;