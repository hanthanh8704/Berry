import React from 'react';

const FormatDate = ({ date }) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formattedTime = dateObj.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return (
    <span>
      {formattedDate} {formattedTime}
    </span>
  );
};

export default FormatDate;
