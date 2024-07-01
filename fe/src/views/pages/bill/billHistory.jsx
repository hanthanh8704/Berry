import React, { useState } from "react";
import { Button, Modal, List, Tag, Tooltip, Typography } from "antd";
import {
  IconBrandOpenai,
  IconFileInvoice,
  IconCheck,
  IconTruckDelivery,
  IconCalendarClock,
  IconCreditCardPay,
  IconCircleXFilled,
} from "@tabler/icons-react";
import FormatDate from "views/utilities/FormatDate";
import "./bill.css";

const { Title } = Typography;

const statusIconMap = {
  "Tạo đơn hàng": <IconBrandOpenai />,
  "Chờ thanh toán": <IconFileInvoice />,
  "Chờ xác nhận": <IconCheck />,
  "Xác nhận thanh toán": <IconCreditCardPay />,
  "Chờ giao": <IconCalendarClock />,
  "Đang giao": <IconTruckDelivery />,
  "Hoàn thành": <IconCheck />,
  "Hủy": <IconCircleXFilled />,
};

const statusColorMap = {
  "Tạo đơn hàng": "blue",
  "Chờ thanh toán": "orange",
  "Chờ xác nhận": "green",
  "Xác nhận thanh toán": "purple",
  "Chờ giao": "cyan",
  "Đang giao": "volcano",
  "Hoàn thành": "gold",
  "Hủy": "red",
};

function BillHistory({ props }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const renderItem = (item) => (
    <List.Item key={item.ngayTao} className="bill-history-item">
      <List.Item.Meta
        avatar={<Tooltip title={item.trangThai}>{statusIconMap[item.trangThai]}</Tooltip>}
        title={
          <span>
            <Tag color={statusColorMap[item.trangThai]}>{item.trangThai}</Tag>
            <span className="bill-history-nhanvien">{item.nhanVien}</span>
          </span>
        }
        description={
          <div className="bill-history-description">
            <div>
              <strong>Thời gian: </strong>
              <FormatDate date={item.ngayTao} />
            </div>
            <div>
              <strong>Ghi chú: </strong>
              {item.ghiChu}
            </div>
          </div>
        }
      />
    </List.Item>
  );

  return (
    <div className="bill-history">
      <Button type="primary" onClick={showModal}>
        Chi tiết
      </Button>
      <Modal
        title={<Title level={3}>Lịch sử chi tiết</Title>}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
        className="bill-history-modal"
      >
        {props.length === 0 ? (
          <p>Không có dữ liệu để hiển thị</p>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={props}
            renderItem={renderItem}
            className="bill-history-list"
          />
        )}
      </Modal>
    </div>
  );
}

export default BillHistory;
