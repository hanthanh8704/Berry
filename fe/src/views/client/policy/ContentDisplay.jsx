import React from "react";
import { Content } from "antd/es/layout/layout";
import PolicyProduct from "./model/PolicyProduct";
import PolicySecurity from "./model/PolicySecurity";
import PolicyVNPay from "./model/PolicyVNPay";
import PolicyCustomer from "./model/PolicyCustomer";
import PaymentPolicy from "./model/PaymentPolicy";
import CustomerObligations from "./model/CustomerObligations";
import EmployeeObligations from "./model/EmployeeObligations";
import Giveback from "./model/GiveBack";

const contentMapping = {
  "4": <Giveback />,
  "5": <PolicyProduct />,
  "6": <PolicySecurity />,
  "7": <PolicyVNPay />,
  "8": <PolicyCustomer />,
  "9": <PaymentPolicy />,
  "10": "Content for Điều khoản dịch vụ",
  "11": "Content for Chính sách vận chuyển",
  "12": "Content for Các điều khoản khác",
  "13": "Content for Hạn chế về thời gian và pháp lý",
  "14": <CustomerObligations />,
  "15": <EmployeeObligations />,
};

function ContentDisplay({ selectedItem }) {
  // Đảm bảo có nội dung mặc định nếu không có selectedItem hợp lệ
  const content = contentMapping[selectedItem] || "Select an item from the menu";

  return (
    <Content style={{ padding: "20px", backgroundColor: "#f4f7fa", borderRadius: "10px" }}>
      {content}
    </Content>
  );
}

export default ContentDisplay;
