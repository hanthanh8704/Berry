import React from "react";
import { Card, Typography, Space, Divider } from "antd";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function PolicyCustomer() {
  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px", }}>
        Chính sách dành cho khách hàng
      </Title>

      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        {/* Quy trình mua hàng */}
        <Card
          title={<Title level={3} style={{ margin: 0, fontSize : '20px',color: "#007BFF" }}>1. Quy trình mua hàng</Title>}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
        >
          <Paragraph>
            <CheckCircleOutlined style={{ color: "#52c41a" }} /> <b>Bước 1:</b> Chọn mặt hàng Quý khách quan tâm để xem các thông tin về sản phẩm, giá cả, phụ kiện, và điều kiện.
          </Paragraph>
          <Paragraph>
            <CheckCircleOutlined style={{ color: "#52c41a" }} /> <b>Bước 2:</b> Khi muốn mua sản phẩm, nhấn nút "Thêm vào giỏ hàng" để thêm vào giỏ hàng. Quý khách có thể chọn "Tiếp tục mua hàng" hoặc điều chỉnh số lượng trong giỏ.
          </Paragraph>
          <Paragraph>
            <CheckCircleOutlined style={{ color: "#52c41a" }} /> <b>Bước 3:</b> Sau khi chọn đủ, nhấn "THANH TOÁN", điền thông tin cần thiết, và gửi đơn đặt hàng.
          </Paragraph>
          <Paragraph>
            <CheckCircleOutlined style={{ color: "#52c41a" }} /> <b>Bước 4:</b> Sau khi đặt hàng, chúng tôi sẽ liên hệ qua điện thoại hoặc email để xác nhận.
          </Paragraph>
          <Paragraph>
            <InfoCircleOutlined style={{ color: "#faad14" }} /> <b>Lưu ý:</b> Quý khách vui lòng thanh toán 100% giá trị đơn hàng và phí vận chuyển (nếu có) trực tiếp hoặc online trước khi nhận hàng.
          </Paragraph>
        </Card>

        {/* Nhận hàng và kiểm tra */}
        <Card
          title={<Title level={3} style={{ margin: 0, color: "#007BFF" }}>2. Nhận hàng và kiểm tra</Title>}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
        >
          <Paragraph>
            - Berry Store không hỗ trợ đồng kiểm khi nhận hàng. Quý khách chỉ được kiểm tra các yếu tố bên ngoài trước khi thanh toán.
          </Paragraph>
          <Paragraph>
            - Nếu kiện hàng có dấu hiệu móp méo hoặc sai thông tin, Quý khách có quyền từ chối nhận.
          </Paragraph>
          <Paragraph>
            - Nếu sản phẩm có vấn đề sau khi nhận và thanh toán, Quý khách có thể khiếu nại trong vòng 7 ngày.
          </Paragraph>
        </Card>

        {/* Chương trình khuyến mãi */}
        <Card
          title={<Title level={3} style={{ margin: 0, color: "#007BFF" }}>3. Chương trình khuyến mãi</Title>}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
        >
          <Paragraph>
            - Berry Store và nhà bán hàng sẽ tổ chức các chương trình khuyến mãi. Quý khách chỉ được mua số lượng theo quy định để đảm bảo tính công bằng.
          </Paragraph>
          <Paragraph>
            - Chúng tôi có quyền từ chối đơn hàng không thỏa mãn điều kiện chương trình mà không cần thông báo.
          </Paragraph>
        </Card>

        {/* Giá cả */}
        <Card
          title={<Title level={3} style={{ margin: 0, color: "#007BFF" }}>4. Giá cả</Title>}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
        >
          <Paragraph>
            - Giá sản phẩm đã bao gồm VAT, có thể thay đổi tùy thời điểm và chương trình khuyến mãi. Phí vận chuyển (nếu có) sẽ hiển thị rõ tại trang thanh toán.
          </Paragraph>
          <Paragraph>
            - Trong trường hợp lỗi giá, hệ thống sẽ hủy đơn hàng và hoàn tiền ngay lập tức (nếu đã thanh toán trước).
          </Paragraph>
        </Card>

        {/* Phương thức vận chuyển */}
        <Card
          title={<Title level={3} style={{ margin: 0 , color: "#007BFF" }}>5. Phương thức vận chuyển</Title>}
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
        >
          <Paragraph>
            - Chúng tôi giao hàng qua đối tác vận chuyển theo địa chỉ Quý khách đã đăng ký.
          </Paragraph>
          <Paragraph>
            - Thời gian giao hàng: 3-5 ngày tùy vị trí địa lý.
          </Paragraph>
          <Paragraph>
            - Mua trên 5 sản phẩm sẽ được miễn phí vận chuyển toàn quốc.
          </Paragraph>
          <Paragraph>
            - Nếu có thắc mắc, vui lòng liên hệ qua hotline 0393977745 hoặc email ducnmph40593@fpt.edu.com.
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
}
