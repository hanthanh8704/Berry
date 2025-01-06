import React from "react";

export default function PolicyVNPay() {
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      lineHeight: "1.8",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "30px",
      color: "#2c3e50",
    },
    section: {
      marginBottom: "20px",
    },
    heading: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#007BFF",
    },
    text: {
      fontSize: "16px",
      marginBottom: "10px",
      textAlign: "justify",
    },
    list: {
      marginLeft: "20px",
      paddingLeft: "20px",
      listStyleType: "disc",
    },
    listItem: {
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chính sách bảo mật thông tin thanh toán</h2>

      <section style={styles.section}>
        <h3 style={styles.heading}>1. Cam kết bảo mật</h3>
        <p style={styles.text}>
          Hệ thống thanh toán thẻ được cung cấp bởi các đối tác cổng thanh toán (“Đối Tác Cổng Thanh Toán”) đã được
          cấp phép hoạt động hợp pháp tại Việt Nam. Theo đó, các tiêu chuẩn bảo mật thanh toán thẻ tại BerryStore.com
          đảm bảo tuân thủ theo các tiêu chuẩn bảo mật ngành.
        </p>
      </section>

      <section style={styles.section}>
        <h3 style={styles.heading}>2. Quy định bảo mật</h3>
        <p style={styles.text}>
          Chính sách giao dịch thanh toán bằng thẻ quốc tế và thẻ nội địa (internet banking) đảm bảo tuân thủ các
          tiêu chuẩn bảo mật của các Đối Tác Cổng Thanh Toán gồm:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Chứng nhận tiêu chuẩn bảo mật dữ liệu thông tin thanh toán (PCI DSS) do Trustwave cung cấp. Mật khẩu sử
            dụng một lần (OTP) được gửi qua SMS để đảm bảo việc truy cập tài khoản được xác thực.
          </li>
          <li style={styles.listItem}>Tiêu chuẩn mã hóa MD5 128 bit.</li>
          <li style={styles.listItem}>
            Các nguyên tắc và quy định bảo mật thông tin trong ngành tài chính ngân hàng theo quy định của Ngân hàng
            nhà nước Việt Nam.
          </li>
          <li style={styles.listItem}>
            Chính sách bảo mật giao dịch trong thanh toán của BerryStore.com áp dụng với Khách hàng: Berry Store cung
            cấp tiện ích lưu giữ token chỉ lưu chuỗi đã được mã hóa bởi Đối Tác Cổng Thanh Toán cung cấp cho Berry Store.
            Berry Store không trực tiếp lưu trữ thông tin thẻ khách hàng. Việc bảo mật thông tin thẻ thanh toán Khách hàng
            được thực hiện bởi Đối Tác Cổng Thanh Toán đã được cấp phép.
          </li>
          <li style={styles.listItem}>
            Đối với thẻ quốc tế: thông tin thẻ thanh toán của Khách hàng mà có khả năng sử dụng để xác lập giao dịch
            không được lưu trên hệ thống của BerryStore.com. Đối Tác Cổng Thanh Toán sẽ lưu trữ và bảo mật.
          </li>
          <li style={styles.listItem}>
            Đối với thẻ nội địa (internet banking), Berry Store chỉ lưu trữ mã đơn hàng, mã giao dịch và tên ngân hàng.
          </li>
        </ul>
      </section>

      <section style={styles.section}>
        <p style={styles.text}>
          Berry Store cam kết đảm bảo thực hiện nghiêm túc các biện pháp bảo mật cần thiết cho mọi hoạt động thanh
          toán thực hiện trên sàn giao dịch thương mại điện tử BerryStore.com.
        </p>
      </section>
    </div>
  );
}
