import { Button, Modal } from "antd";
import React, { useState } from "react";
import FormatDate from "views/utilities/FormatDate";
import {
  IconBrandOpenai,
  IconFileInvoice,
  IconCircleXFilled,
  IconCheck,
  IconTruckDelivery,
  IconCalendarClock,
  IconCreditCardPay,
} from "@tabler/icons-react";
import "./bill.css"; // Tạo file BillHistory.css để quản lý css

function BillHistory({ props }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Kiểm tra props trước khi sử dụng map
  if (!props || !Array.isArray(props) || props.length === 0) {
    return (
      <div className="bill-history">
        <Button type="primary" onClick={showModal} danger>
          Chi tiết
        </Button>
        <Modal
          title="Lịch sử chi tiết"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer=""
          width={500}
        >
          <p>Không có dữ liệu để hiển thị</p>
        </Modal>
      </div>
    );
  }

  return (
    <div className="bill-history">
      <Button type="primary" onClick={showModal} danger>
        Chi tiết
      </Button>
      <Modal
        title="Lịch sử chi tiết"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer=""
        width={600}
      >
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table className="table align-middle table-borderless">
            <thead className="table-header">
              <tr>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Nhân viên xác nhận</th>
                <th scope="col">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {props.map((item, index) => (
                <tr key={index} className="border-bottom">
                  <td>
                    <span
                      style={{
                        fontSize: "24px",
                        color:
                          item.trangThai === "Tạo đơn hàng"
                            ? "#024FA0"
                            : item.trangThai === "Xác nhận thanh toán"
                            ? "#F2721E"
                            : item.trangThai === "Chờ giao"
                            ? "#50B846"
                            : item.trangThai === "Chỉnh sửa đơn hàng"
                            ? "#FFBC05"
                            : item.trangThai === "Hủy"
                            ? "#9C281C"
                            : "#2DC255",
                      }}
                    >
                      {item.trangThai === "Tạo đơn hàng" && (
                        <IconBrandOpenai />
                      )}
                      {item.trangThai === "Chờ thanh toán" && (
                        <IconFileInvoice />
                      )}
                      {item.trangThai === "Chờ xác nhận" && <IconCheck />}
                      {item.trangThai === "Xác nhận thanh toán" && (
                        <IconCreditCardPay />
                      )}
                      {item.trangThai === "Chờ giao" && (
                        <IconCalendarClock />
                      )}
                      {item.trangThai === "Đang giao" && (
                        <IconTruckDelivery />
                      )}
                      {item.trangThai === "Hoàn thành" && <IconCheck />}
                      {item.trangThai !== "Tạo đơn hàng" &&
                        item.trangThai !== "Chờ thanh toán" &&
                        item.trangThai !== "Chờ xác nhận" &&
                        item.trangThai !== "Xác nhận thanh toán" &&
                        item.trangThai !== "Chờ giao" &&
                        item.trangThai !== "Đang giao" &&
                        item.trangThai !== "Hoàn thành" &&
                        item.trangThai !== "Hủy" && <IconBrandOpenai name="robot" />}
                    </span>
                    <span className="fw-semibold">
                      {item.trangThai === "Tạo đơn hàng"
                        ? "Tạo đơn hàng"
                        : item.trangThai === "Chờ thanh toán"
                        ? "Chờ thanh toán"
                        : item.trangThai === "Chờ xác nhận"
                        ? "Chờ xác nhận"
                        : item.trangThai === "Xác nhận thanh toán"
                        ? "Xác nhận thanh toán"
                        : item.trangThai === "Chờ giao"
                        ? "Chờ giao"
                        : item.trangThai === "Đang giao"
                        ? "Đang giao"
                        : item.trangThai === "Hoàn thành"
                        ? "Hoàn thành"
                        : item.trangThai === "Hủy"
                        ? "Hủy"
                        : "Robot"}
                    </span>
                  </td>
                  <td>
                    <FormatDate date={item.ngayTao} />
                  </td>
                  <td>{item.nhanVien}</td>
                  <td>{item.ghiChu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default BillHistory;
