import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EmployeeObligations() {
  const sectionStyle = {
    padding: "30px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "900px",
    margin: "20px auto",
    fontFamily: "'Roboto', sans-serif",
  };


  const titleStyle = {
    fontSize: "2.2rem",
    fontWeight: "600",
    marginBottom: "20px",
  };

  const subtitleStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.4rem",
    color: "#007BFF",
    marginBottom: "18px",
  };

  const iconStyle = {
    fontSize: "14px",
    color: "#007bff",
    marginRight: "12px",
  };

  const listStyle = {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  };

  const listItemStyle = {
    marginBottom: "20px",
    paddingLeft: "24px",
    position: "relative",
  };

  const paragraphStyle = {
    fontSize: "1rem",
    color: "#6c757d",
    lineHeight: "1.6",
    marginBottom: "10px",
  };

  // Added a dot to indicate each list item has an icon
  const dotStyle = {
    position: "absolute",
    left: "0",
    top: "10px",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
  };

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>Nghĩa vụ của người bán</h2>
      <div>
        <h3 style={subtitleStyle}>
          <FontAwesomeIcon icon={faCircle} style={iconStyle} />
          Quyền và nghĩa vụ của Nhà Bán Hàng
        </h3>
        <ul style={listStyle}>
          <li style={listItemStyle}>
            <div style={dotStyle}></div>
            <p style={paragraphStyle}>
              Nhằm bảo vệ quyền lợi Nhà Bán Hàng, Ban quản lý BerryStore.com
              cung cấp cho các Nhà Bán Hàng những thông tin quan trọng cần
              biết trước khi BerryStore.com tiến hành bán sản phẩm của Nhà Bán
              Hàng;
            </p>
          </li>
          <li style={listItemStyle}>
            <div style={dotStyle}></div>
            <p style={paragraphStyle}>
              Được biết những thông tin phản hồi của Khách Hàng về chất lượng
              sản phẩm mà Nhà Bán Hàng cung cấp cho Khách Hàng khi có sự đồng
              ý của Ban quản lý BerryStore.com;
            </p>
          </li>
          <li style={listItemStyle}>
            <div style={dotStyle}></div>
            <p style={paragraphStyle}>
              Nhà Bán Hàng phải hoàn toàn chịu trách nhiệm về chất lượng sản
              phẩm được đăng tải trên BerryStore.com. Trong mọi trường hợp,
              Nhà Bán Hàng phải có trách nhiệm giải quyết mọi khiếu nại của
              khách hàng liên quan tới chất lượng của dịch vụ cung cấp.
            </p>
          </li>
          <li style={listItemStyle}>
            <div style={dotStyle}></div>
            <p style={paragraphStyle}>
              Nhà Bán Hàng bắt buộc phải có trách nhiệm cung cấp các sản phẩm
              của mình đã được đăng lên trên BerryStore.com khi Khách Hàng đã
              đặt mua trực tuyến. Trong trường hợp Nhà Bán Hàng không cung cấp
              dịch vụ hoặc không cung cấp dịch vụ được như nội dung đăng tải
              trên website cho Khách Hàng mà không kịp thời thông báo lý do cho
              Ban quản lý BerryStore.com thì Ban quản lý BerryStore.com có
              trách nhiệm liên hệ với Nhà Bán Hàng để giải quyết đồng thời yêu
              cầu Nhà Bán Hàng bồi thường cho Khách Hàng và BerryStore.com nếu
              có thiệt hại do Nhà Bán Hàng gây ra.
            </p>
          </li>
          <li style={listItemStyle}>
            <div style={dotStyle}></div>
            <p style={paragraphStyle}>
              Mọi thông tin giao dịch được bảo mật và không được chuyển giao
              cho bên thứ 3 nào khác, trừ trường hợp buộc phải cung cấp khi
              Cơ quan pháp luật yêu cầu.
            </p>
          </li>
          <li style={listItemStyle}>
            <div style={dotStyle}></div>
            <p style={paragraphStyle}>
              Các quyền và trách nhiệm khác được quy định cụ thể tại Hợp đồng
              dịch vụ thương mại điện tử.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
