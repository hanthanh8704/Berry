import { Col, Row, Typography, Divider } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function Giveback() {
  return (
    <div style={{ padding: "40px 20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
        Chính sách trả hàng
      </Title>

      <Divider orientation="left" plain style={{ marginBottom: "20px" }}>
        <Title level={4} style={{ color: "#555", fontWeight: 600 }}>
          Chính sách trả dành cho khách hàng tại Berry Store
        </Title>
      </Divider>

      <Row justify="center" style={{ textAlign: "center", backgroundColor: "#ffffff", padding: "15px 0", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
        <Col span={6} style={{ borderRight: "1px solid #ddd", padding: "10px 0", fontWeight: 600 }}>Thời gian</Col>
        <Col span={10} style={{ borderRight: "1px solid #ddd", padding: "10px 0", fontWeight: 600 }}>Sản phẩm lỗi (từ phía nhà cung cấp)</Col>
        <Col span={8} style={{ padding: "10px 0", fontWeight: 600 }}>Sản phẩm không lỗi</Col>
      </Row>

      <Row justify="center" style={{ textAlign: "center", backgroundColor: "#fff", padding: "10px 0", borderBottom: "1px solid #ddd" }}>
        <Col span={6} style={{ borderRight: "1px solid #ddd" }}>02 ngày kể từ ngày nhận hàng</Col>
        <Col span={10} style={{ borderRight: "1px solid #ddd" }}>Hỗ trợ trả, Berry Store chịu phí vận chuyển</Col>
        <Col span={8}>Hỗ trợ trả, khách hàng chịu phí vận chuyển</Col>
      </Row>

      <Row justify="center" style={{ textAlign: "center", backgroundColor: "#fff", padding: "10px 0" }}>
        <Col span={6} style={{ borderRight: "1px solid #ddd" }}>Quá 02 ngày</Col>
        <Col span={10} style={{ borderRight: "1px solid #ddd" }}>Không hỗ trợ đổi trả</Col>
        <Col span={8}>-</Col>
      </Row>

      <Divider orientation="left" plain style={{ marginTop: "40px", marginBottom: "20px" }}>
        <Title level={4} style={{ color: "#555", fontWeight: 600 }}>Các trường hợp chấp nhận trả</Title>
      </Divider>

      <Paragraph style={{ paddingLeft: "20px", fontSize: "16px", lineHeight: "1.6" }}>
        <ul>
          <li>Sản phẩm bị lỗi do phía nhà cung cấp (sản phẩm hỏng, rách, dơ).</li>
          <li>Mỗi hóa đơn được đổi trả duy nhất 1 lần.</li>
          <li>Sản phẩm bị hư hại trong quá trình vận chuyển.</li>
          <li>Sản phẩm không áp dụng đợt giảm giá.</li>
          <li>Sản phẩm không đúng với thông tin đơn hàng đã đặt (sai màu, sai mẫu, sai size,...).</li>
          <li>Sản phẩm vẫn còn nguyên nhãn, tag, box.</li>
          <li>Sản phẩm chấp nhận trả phải thỏa các điều kiện trả trong vòng 02 ngày kể từ ngày nhận hàng.</li>
          <li>Khách hàng cần liên hệ trực tiếp với Berry Store để được hỗ trợ.</li>
        </ul>
      </Paragraph>

      <Divider orientation="left" plain style={{ marginTop: "40px", marginBottom: "20px" }}>
        <Title level={4} style={{ color: "#555", fontWeight: 600 }}>Thời gian hoàn trả sản phẩm và hoàn tiền</Title>
      </Divider>

      <Title level={5}>Thời gian hoàn trả sản phẩm:</Title>
      <Paragraph style={{ paddingLeft: "20px", fontSize: "16px", lineHeight: "1.6" }}>
        <ul>
          <li>Berry Store sẽ cho đơn vị vận chuyển thu hồi sản phẩm (đối với các đơn lỗi từ nhà cung cấp) hoặc khách hàng tự gửi sản phẩm về (đối với các đơn không lỗi) trong vòng 03 ngày kể từ ngày yêu cầu được xác nhận.</li>
          <li>Sản phẩm phải trở về kho Berry Store trong vòng 07 ngày.</li>
          <li>Sau khi kiểm tra và xác nhận thông tin sản phẩm, sẽ tiến hành xử lý.</li>
        </ul>
      </Paragraph>

      <Title level={5}>Thời gian hoàn tiền:</Title>
      <Paragraph style={{ paddingLeft: "20px", fontSize: "16px", lineHeight: "1.6" }}>
        <ul>
          <li>Hoàn tiền trong vòng 3-5 ngày kể từ khi xác nhận thông tin sản phẩm, trực tiếp vào tài khoản ngân hàng của khách hàng.</li>
        </ul>
      </Paragraph>

      <Divider dashed style={{ margin: "20px 0" }} />

      <Text type="danger" style={{ fontWeight: "bold", display: "block", textAlign: "center", fontSize: "16px" }}>
        * Lưu ý: Đơn hàng chỉ được phép trả 1 lần , sản phẩm được áp dụng đợt giảm giá không được phép trả , chỉ được trả kể từ 2 ngày đơn hàng được thanh toán 
      </Text>
        
    </div>
  );
}
