import React from "react";
import { FaMoneyBillWave, FaCreditCard, FaHandHoldingUsd } from "react-icons/fa";

export default function PaymentPolicy() {
  const headerStyle = {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "20px 0",
    color: "#2c3e50",
  };

  const sectionStyle = {
    marginBottom: "40px",
    padding: "0 20px",
  };

  const sectionHeaderStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",

    color: "#007BFF",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const paragraphStyle = {
    fontSize: "16px",
    marginBottom: "12px",
    lineHeight: "1.8",
    color: "#2c3e50",
  };

  const olStyle = {
    paddingLeft: "25px",
    marginBottom: "12px",
    color: "#2c3e50",
  };

  const liStyle = {
    marginBottom: "8px",
    fontSize: "15px",
  };

  const noteStyle = {
    backgroundColor: "#fbeee0",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#e74c3c",
  };

  return (
    <div>
      <header style={headerStyle}>
        <h2>Chính sách thanh toán</h2>
      </header>

      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <FaMoneyBillWave size={20} /> Thanh toán đối với Khách Hàng
        </h3>
        <p style={paragraphStyle}>
          Khách hàng có thể lựa chọn các phương thức thanh toán trên sàn TMĐT BerryStore.com bao gồm:
        </p>

        <div>
          <h4 style={sectionHeaderStyle}>
            <FaMoneyBillWave size={20} /> Cách 1: Thanh toán sau (COD – thanh toán bằng tiền mặt)
          </h4>
          <ol style={olStyle}>
            <li style={liStyle}>Người mua tìm hiểu thông tin về sản phẩm trên BerryStore.com.</li>
            <li style={liStyle}>Người mua đặt mua sản phẩm, lựa chọn phương thức thanh toán tiền mặt khi giao hàng.</li>
            <li style={liStyle}>
              Bộ phận vận chuyển của BerryStore hoặc nhà vận chuyển do BerryStore chỉ định giao hàng.
            </li>
            <li style={liStyle}>Người mua nhận hàng và thanh toán.</li>
          </ol>
        </div>

        <div>
          <h4 style={sectionHeaderStyle}>
            <FaCreditCard size={20} /> Cách 2: Thanh toán qua chuyển khoản ngân hàng
          </h4>
          <ol style={olStyle}>
            <li style={liStyle}>Người mua tìm hiểu thông tin về sản phẩm trên BerryStore.com.</li>
            <li style={liStyle}>Người mua đặt mua sản phẩm, lựa chọn phương thức thanh toán qua thẻ.</li>
            <li style={liStyle}>
              Người mua tiến hành thanh toán thông qua ngân hàng và chuyển vào tài khoản ngân hàng của BerryStore.
            </li>
            <li style={liStyle}>Bộ phận vận chuyển của BerryStore giao hàng.</li>
            <li style={liStyle}>Người mua nhận hàng.</li>
          </ol>
        </div>

        <div style={noteStyle}>
          <strong>Lưu ý:</strong> Đối với voucher/phiếu khuyến mại, khách hàng có thể nhận E-voucher qua email hoặc
          điện thoại sau khi hoàn tất thanh toán.
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <FaHandHoldingUsd size={24} /> Thanh toán qua cổng VNPT EPAY
        </h3>
        <p style={paragraphStyle}>Hạn mức tối đa là 100.000.000 đ/giao dịch.</p>
      </section>

      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>Thanh toán giữa Nhà Bán Hàng và Ban quản lý Website</h3>
        <p style={paragraphStyle}>
          Thời gian và hình thức thanh toán giữa Nhà Bán Hàng và sàn TMĐT BerryStore sẽ được quy định cụ thể trong hợp
          đồng hợp tác.
        </p>
      </section>
    </div>
  );
}
