import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { faLandmark, faLayerGroup, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Menu, Row } from "antd";
import ContentDisplay from "./ContentDisplay";

export default function Policy() {
  const { policyId } = useParams(); // Lấy policyId từ URL
  const [selectedItem, setSelectedItem] = useState(policyId || "5"); // Dùng policyId làm mặc định nếu có

  useEffect(() => {
    setSelectedItem(policyId);  // Cập nhật selectedItem khi policyId thay đổi
  }, [policyId]);

  function getItem(label, key, icon, children, type) {
    return { key, icon, children, label, type };
  }

  const items = [
    getItem("Chính sách và điều khoản", "sub1", <FontAwesomeIcon icon={faLandmark} style={{ fontSize: "25px" }} />, [
      getItem("Chính sách bảo hành sản phẩm", "5"),
      getItem("Chính sách bảo mật", "6"),
      getItem("Chính sách bảo mật thông tin thanh toán", "7"),
      getItem("Chính sách dành cho khách hàng", "8"),
      getItem("Chính sách thanh toán", "9"),
      getItem("Điều khoản dịch vụ", "10"),
      getItem("Chính sách trả hàng", "4"),
    ]),
    getItem("Các điều khoản khác", "sub2", <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: "25px" }} />, [
      getItem("Chính sách vận chuyển", "11"),
      getItem("Các điều khoản khác", "12"),
      getItem("Hạn chế về thời gian và pháp lý", "13"),
      getItem("Nghĩa vụ của khách hàng", "14"),
      getItem("Nghĩa vụ của người bán", "15"),
    ]),
  ];

  // Chỉ mở sub1 mặc định
  const defaultOpenKeys = ["sub1"];

  const handleMenuSelect = ({ key }) => {
    setSelectedItem(key);  // Cập nhật selectedItem khi chọn mục mới
  };

  return (
    <>
      <Row justify={"center"} style={{ marginTop: "30px", marginBottom: "30px" }}>
        <Col span={8}>
          <Card style={{ maxHeight: "750px", overflowY: "auto" }}>
            <h2>Thông tin bạn cần biết</h2>
            <hr />
            <Menu mode="inline" defaultOpenKeys={defaultOpenKeys} onSelect={handleMenuSelect}>
              {items.map((item) => (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map((childItem) => (
                    <Menu.Item key={childItem.key}>
                      <FontAwesomeIcon icon={faCircle} style={{ fontSize: "10px", marginRight: "5px" }} />
                      {childItem.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ))}
            </Menu>
          </Card>
        </Col>
        <Col span={12} style={{ marginLeft: "20px" }}>
          <Card style={{ maxHeight: "670px", overflowY: "auto" }}>
            <ContentDisplay selectedItem={selectedItem} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
