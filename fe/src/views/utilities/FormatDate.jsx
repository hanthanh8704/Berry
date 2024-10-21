import React from "react";

function FormatDate({ date }) {
  // Hàm formatDate để định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Định dạng cho ngày
    const dateOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    // Định dạng cho giờ
    const timeOptions = {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    // Tách ngày và giờ ra
    const formattedDate = date.toLocaleDateString("vi-VN", dateOptions);
    const formattedTime = date.toLocaleTimeString("vi-VN", timeOptions);

    // Nối ngày trước và giờ sau
    return `${formattedDate} ${formattedTime}`;
  };

  return <span>{formatDate(date)}</span>;
}

export default FormatDate;
