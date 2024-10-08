import React from "react";

function FormatDate({ date }) {
  // Hàm formatDate để định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return date.toLocaleString("vi-VN", options);
  };

  return <span>{formatDate(date)}</span>;
}

export default FormatDate;