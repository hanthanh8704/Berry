import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

export default function CustomerObligations() {
  const sectionStyle = {
    padding: "30px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: "1000px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
    color: "#333",
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
    fontSize: "12px",
    color: "#007bff",
    marginRight: "12px",
  };

  const paragraphStyle = {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.8",
    marginBottom: "18px",
    textAlign: "justify",
  };

  const listStyle = {
    marginLeft: "30px",
    marginBottom: "18px",
    lineHeight: "1.8",
  };

  return (
    <section style={sectionStyle}>
      <Title level={2} style={titleStyle}>Nghĩa vụ của khách hàng</Title>

      <Divider />

      <div>
        <Title level={3} style={subtitleStyle}>
          <FontAwesomeIcon icon={faCircle} style={iconStyle} />
          Quyền và nghĩa vụ của Khách Hàng
        </Title>
        
        <Paragraph style={paragraphStyle}>
          – BerryStore.com sẽ không tính thêm bất kỳ phụ phí nào liên quan đến dịch vụ và cổng thanh toán ngoại trừ các khoản được nêu rõ tại trang chi tiết đơn hàng.
        </Paragraph>
        
        <Paragraph style={paragraphStyle}>
          – Việc đặt hàng xem là đã xác nhận nếu trang xác nhận đặt hàng được hiển thị cho Khách Hàng, ngay cả khi Khách Hàng không nhận được tin nhắn SMS hoặc Email vì bất cứ lý do nào.
        </Paragraph>
        
        <Paragraph style={paragraphStyle}>
          – Nếu không nhận được tin nhắn SMS/Email xác nhận hoặc hủy hàng vì bất cứ lý do nào, Khách Hàng có thể liên hệ BerryStore.com để được hỗ trợ gửi lại. Thông tin gửi qua SMS/Email có thể không được gửi hoặc đến chậm vì nhiều lý do nằm ngoài kiểm soát của BerryStore.com.
        </Paragraph>
        
        <Paragraph style={paragraphStyle}>
          – Thời gian giao hàng ghi trên đơn hàng chỉ là thời gian dự kiến, nghĩa là sẽ có thể xảy ra trường hợp các giao hàng bị trì hoãn vì sự kiện khách quan nằm ngoài kiểm soát của Dosiin.
        </Paragraph>
        
        <Paragraph style={paragraphStyle}>– Tại thời điểm đặt hàng, Khách Hàng sẽ được yêu cầu cung cấp các thông tin cơ bản sau đây:</Paragraph>
        <ul style={listStyle}>
          <li>+ Họ và tên Khách Hàng / Họ và tên người nhận hàng;</li>
          <li>+ Số điện thoại nhận hàng;</li>
          <li>+ Địa chỉ nhận hàng;</li>
          <li>+ Email.</li>
        </ul>

        <Paragraph style={paragraphStyle}>
          – Khi đặt hàng tại BerryStore.com, Khách Hàng đã đồng ý cho phép BerryStore.com gọi điện, Email, gửi tin SMS hoặc gửi thông báo để cung cấp thông tin hoặc lấy thông tin liên quan đến việc đặt hàng của Khách Hàng.
        </Paragraph>
        
        <Paragraph style={paragraphStyle}>
          – Trong trường hợp không có sản phẩm giao cho Khách Hàng mặc dù Khách Hàng đã được xác nhận đơn đặt hàng, vì bất cứ lý do nào (hết hàng, sự kiện bất khả kháng, vấn đề vận chuyển,...), Khách Hàng được quyền lựa chọn 1 trong các phương thức hỗ trợ sau:
        </Paragraph>
        <ul style={listStyle}>
          <li>+ BerryStore.com hỏi ý kiến Khách Hàng về việc hỗ trợ đổi sang sản phẩm tương tự mà không thu thêm phí nào khác ngoài giá sản phẩm đã được niêm yết trên website;</li>
          <li>+ Hoàn lại tiền mua hàng cho Khách Hàng đối với sản phẩm hết hàng và Khách Hàng không có nhu cầu mua sản phẩm cùng loại tương tự khác.</li>
        </ul>

        <Paragraph style={paragraphStyle}>
          – Khách Hàng cần phải thường xuyên đọc và tuân theo các Chính sách và Quy định của Quy Chế Hoạt Động đang được đăng trên BerryStore.com để có thể hiểu và thực hiện được các Chính sách và Quy định tại thời điểm đó.
        </Paragraph>
      </div>
    </section>
  );
}
