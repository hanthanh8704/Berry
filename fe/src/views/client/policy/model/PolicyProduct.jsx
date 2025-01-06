export default function PolicyProduct() {
  const styles = {
    container: {
      padding: "20px",
      lineHeight: "1.8",
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      color: "#333",
    },
    section: {
      marginBottom: "30px",
    },
    sectionTitle: {
      color: "#007BFF",
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    subsection: {
      marginBottom: "20px",
    },
    subsectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "10px",
    },
    list: {
      paddingLeft: "20px",
      marginBottom: "15px",
    },
    listItem: {
      marginBottom: "8px",
    },
    note: {
      fontStyle: "italic",
      color: "#d9534f",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chính sách bảo hành sản phẩm</h2>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>1. Chính sách bảo hành</h3>

        <div style={styles.subsection}>
          <h4 style={styles.subsectionTitle}>
            a) Đối với sản phẩm do Đối tác cung cấp trên Berry Store:
          </h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Đối tác có trách nhiệm tiếp nhận bảo hành sản phẩm dịch vụ cho
              Khách hàng như trong cam kết giấy bảo hành sản phẩm.
            </li>
            <li style={styles.listItem}>
              Khách hàng luôn giữ giấy bảo hành và có quyền đến tận nơi cung cấp
              sản phẩm để bảo hành hoặc yêu cầu đến tận nhà bảo trì đối với sản
              phẩm cố định sử dụng tại nhà.
            </li>
            <li style={styles.listItem}>
              Khách hàng có quyền khiếu nại, khiếu kiện Đối tác trong trường hợp
              Đối tác từ chối bảo hành bảo trì sản phẩm khi đang còn trong thời
              hạn bảo hành bảo trì ghi trên giấy bảo hành.
            </li>
            <li style={styles.listItem}>
              Berry Store khuyến cáo Khách hàng cần kiểm tra các chính sách bảo
              hành, bảo trì đối với sản phẩm có dự định mua. Berry Store không
              phải là bên chịu trách nhiệm chính trong việc bảo hành sản phẩm
              của Đối tác trên Berry Store. Bộ phận chăm sóc Khách hàng của
              Berry Store sẽ tiếp nhận thông tin và hỗ trợ trong khả năng cho
              phép để sản phẩm của Đối tác được bảo hành theo chế độ của Nhà
              sản xuất.
            </li>
          </ul>
        </div>

        <div style={styles.subsection}>
          <h4 style={styles.subsectionTitle}>
            b) Đối với các voucher khuyến mại, chính sách bảo hành/đổi trả (nếu
            có):
          </h4>
          <p style={styles.text}>
            Các chính sách được quy định rõ trên từng voucher và sẽ do Đối tác
            chịu trách nhiệm thực hiện.
          </p>
        </div>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>2. Điều kiện bảo hành</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Còn thời hạn bảo hành (dựa trên tem/phiếu bảo hành/hoặc thời điểm
            kích hoạt bảo hành điện tử).
          </li>
          <li style={styles.listItem}>Còn tem/phiếu bảo hành.</li>
          <li style={styles.listItem}>Sản phẩm bị lỗi kỹ thuật.</li>
        </ul>
        <p style={styles.text}>
          Khi có nhu cầu bảo hành sản phẩm, Khách hàng có thể liên hệ trực tiếp
          với trung tâm bảo hành của hãng tại địa phương (nếu có). Trường hợp
          Khách hàng ở quá xa trung tâm bảo hành hoặc có bất tiện khác không thể
          đến bảo hành trực tiếp, Khách hàng có thể gửi sản phẩm về Berry Store,
          Berry Store sẽ hỗ trợ gửi sản phẩm đi bảo hành.
        </p>
      </section>
    </div>
  );
}