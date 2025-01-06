import React, { useState, useEffect } from "react";
import { List, Typography, Card, Row, Col, Badge, Divider } from "antd";
import FormatDate from "views/utilities/FormatDate";
import * as request from "views/utilities/httpRequest";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const BillNotification = ({ showAll }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    request.get(`/bill-history`)
      .then(response => setBillHistory(response || []))
      .catch(console.error);
  }, []);

  const visibleBillHistory = showAll ? billHistory : billHistory.slice(0, 5);

  return (
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      <Title level={4} style={{ textAlign: "center" }}>Thông báo hóa đơn</Title>
      <List
        itemLayout="horizontal"
        dataSource={visibleBillHistory}
        renderItem={item => (
          <List.Item
            key={item.id}
            onClick={() => navigate(`/bill/${item.id}`)}
            onMouseEnter={() => setHoveredItem(item.id)} 
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              padding: 20,
              cursor: "pointer",
              backgroundColor: hoveredItem === item.id ? "#7f7f7f" : "#fff",
              transition: "background-color 0.3s ease",
            }}
          >
            <Badge count={<BellOutlined />} />
            <Card bordered={false} style={{ width: "100%" }}>
              <Row>
                <Col span={24}>
                  <div><strong>{item.invoiceStatus}</strong></div>
                  <div style={{ color: "#888", fontStyle: "italic" }}>{item.recipientName}</div>
                  <div>
                    <div><strong>Thời gian:</strong> <FormatDate date={item.createdAt} /></div>
                    <div><strong>Hóa đơn:</strong> {item.billCode}</div>
                    <div><strong>Trạng thái:</strong> {item.status}</div>
                    <div><strong>Ghi chú:</strong> {item.actionDescription}</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
      <Divider />
    </div>
  );
};

export default BillNotification;
