import React from "react";
import { Col, Divider, Row, Descriptions, Badge, Typography } from "antd";
import DetailAddress from "ui-component/extended/AddressDetail";
import FormatCurrency from "views/utilities/FormatCurrency";
import ChangeInfoBill from "./changeBill";
import "./bill.css";

const { Title } = Typography;

const badgeStatus = (status) => {
  switch (status) {
    case "Chờ thanh toán":
      return "warning";
    case "Tạo đơn hàng":
      return "default";
    case "Chờ xác nhận":
      return "processing";
    case "Xác nhận thông tin thanh toán":
      return "processing";
    case "Chờ giao":
      return "processing";
    case "Đang giao":
      return "processing";
    case "Hoàn thành":
      return "success";
    case "Hủy":
      return "error";
    default:
      return "default";
  }
};

function ChangeCustom({ props, onSuccess }) {
  return (
    <>
      <div className="order-details-container">
        <Title level={2} className="order-section-title">Thông tin đơn hàng</Title>
        <Descriptions bordered column={1} className="order-descriptions">
          <Descriptions.Item label="Mã đơn hàng">{props?.ma}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
          <Badge className="badgehihi" status={badgeStatus(props.trangThaiHoaDon)} style={{ backgroundColor: '#1890ff', color:'#fff',padding:'5px', borderRadius:'20px' }} text={props.trangThaiHoaDon} />

          </Descriptions.Item>
          <Descriptions.Item label="Loại đơn hàng">
            {props.loaiDonHang === 0 ? "Tại quầy" : "Giao hàng"}
          </Descriptions.Item>
          <Descriptions.Item label="Phí vận chuyển">
            {props.type === 1 ? <FormatCurrency value={props.phiShip} /> : "Không có"}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <FormatCurrency value={props.tongTien} />
          </Descriptions.Item>
          <Descriptions.Item label="Phải thanh toán">
            <FormatCurrency value={props.tongTien + props.phiShip} />
          </Descriptions.Item>
          {props.phieuGiamGia && (
            <Descriptions.Item label="Mã giảm giá">
              ({props?.phieuGiamGia?.ma}) {props.phieuGiamGia?.ma} - giảm {props.phieuGiamGia?.giaTriHoaDonDuocGiam}% cho đơn tối thiểu từ <FormatCurrency value={props.phieuGiamGia?.giaTriHoaDonDuocApDung} />, đã giảm <FormatCurrency value={props.tongTienSauGiamGia} />
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
      <Divider />
      <div className="customer-details-container">
        <div className="d-flex align-items-center">
          <Title level={2} className="customer-section-title flex-grow-1">Thông tin khách hàng</Title>
          {props.trangThai <= 4 && (
            <ChangeInfoBill bill={props} onSuccess={onSuccess} />
          )}
        </div>
        <Descriptions bordered column={1} className="customer-descriptions">
          <Descriptions.Item label="Tên khách hàng">
            {props.tenNguoiNhan === null ? "Khách hàng lẻ" : props.tenNguoiNhan}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {props.soDienThoaiNguoiNhan === null ? "Không có" : props.soDienThoaiNguoiNhan}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {props.khachHang?.email === null || props.khachHang?.email === undefined ? "Không có" : props.khachHang?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {props?.diaChi !== null ? (
              <>
                {props.diaChi?.split("##")[0]} ,
                <DetailAddress war={props.diaChi?.split("##")[1]} distr={props.diaChi?.split("##")[2]} prov={props.diaChi?.split("##")[3]} />
              </>
            ) : "Tại cửa hàng"}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Divider />
    </>
  );
}

export default ChangeCustom;
