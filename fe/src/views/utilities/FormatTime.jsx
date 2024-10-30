import React from "react";

function FormatTime({ date }) {
  // Hàm formatDate để định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return date.toLocaleString("vi-VN", options);
  };

  return <span>{formatDate(date)}</span>;
}

export default FormatTime;