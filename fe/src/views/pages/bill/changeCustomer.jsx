import React from 'react';
import { Col, Divider, Row, Descriptions, Badge, Typography } from 'antd';
import DetailAddress from 'ui-component/extended/AddressDetail';
import FormatCurrency from 'views/utilities/FormatCurrency';
import ChangeInfoBill from './changeBill';
import './bill.css';

const { Title } = Typography;

const badgeStatus = (status) => {
  switch (status) {
    case 'Chờ thanh toán':
      return 'warning';
    case 'Tạo đơn hàng':
      return 'default';
    case 'Chờ xác nhận':
      return 'processing';
    case 'Xác nhận thông tin thanh toán':
      return 'processing';
    case 'Chờ giao':
      return 'processing';
    case 'Đang giao':
      return 'processing';
    case 'Hoàn thành':
      return 'success';
    case 'Hủy':
      return 'error';
    default:
      return 'default';
  }
};

function ChangeCustom({ props, onSuccess }) {
  return (
    <>
      <div className="order-details-container">
        <Title level={5} className="text-danger text-uppercase">
          Thông tin đơn hàng
        </Title>
        <Row gutter={24} className="fw-semibold">
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">
                Trạng thái: <span className="float-end text-danger">{props.trangThaiHoaDon}</span>
              </li>
              <li className="mb-2">
                Mã đơn hàng: <span className="float-end text-danger">{props?.ma}</span>
              </li>
              <li className="mb-2">
                Loại đơn hàng: <span className="float-end text-danger">{props.loaiDonHang === 0 ? ' Tại quầy' : ' Giao hàng'}</span>
              </li>
            </ul>
          </Col>
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">
                Phí vận chuyển:{' '}
                <span className="float-end text-danger">{props.phiShip ? <FormatCurrency value={props.phiShip} /> : 'Không có'}</span>
              </li>
              <li className="mb-2">
                Tổng tiền:{' '}
                <span className="float-end text-danger">
                  <FormatCurrency value={props.tongTien} />
                </span>
              </li>
              <li className="mb-2">
                Phải thanh toán:{' '}
                <span className="float-end text-danger">
                  <FormatCurrency value={props.tongTien + props.phiShip} />
                </span>
              </li>
            </ul>
          </Col>
          <Col xl={8}></Col>
          {props.phieuGiamGia !== null && (
            <Col xl={24}>
              <ul className="list-unstyled">
                <li className="mb-2">
                  Mã giảm giá: <span className="text-danger">({props?.phieuGiamGia?.ma})</span> {props.phieuGiamGia?.ten} - giảm{' '}
                  <span className="text-danger">{props.phieuGiamGia?.giaTriHoaDonDuocGiam} %</span> cho đơn tối thiểu từ{' '}
                  <span className="text-danger">
                    <FormatCurrency value={props.phieuGiamGia?.giaTriHoaDonDuocApDung} />
                  </span>
                  , đã giảm{' '}
                  <span className="text-success">
                    <FormatCurrency value={props.tongTienSauGiamGia} />
                  </span>
                </li>
              </ul>
            </Col>
          )}
        </Row>
      </div>
      <Divider />
      <div className="customer-details-container">
      <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5} className="text-danger text-uppercase">Thông tin khách hàng</Title>
          </div>
          <div className="">
            {props.trangThaiHoaDon === "Chờ giao hàng" ? (
              <ChangeInfoBill bill={props} onSuccess={() => {
                onSuccess()
              }} />
            ) : ""}
          </div>
        </div>
        <ul className="list-unstyled fw-semibold">
          <Row gutter={12}>
            <Col xl={12}>
              <li className="mb-2">Tên khách hàng: <span className="float-end text-danger">{props.tenNguoiNhan === null ? "Khách hàng lẻ" : props.tenNguoiNhan}</span></li>
              <li className="mb-2">Số điện thoại: <span className="float-end text-danger">{props.soDienThoaiNguoiNhan === null ? "Không có" : props.soDienThoaiNguoiNhan}</span></li>
            </Col>
            <Col xl={12}>
              <li className="mb-2">Email: <span className="float-end text-danger">{props.khachHang?.email === null | props.khachHang?.email === undefined ? "Không có" : props.khachHang?.email}</span></li>
              <li className="mb-2">Địa chỉ: <span className="float-end text-danger text-end" style={{ width: "24rem" }}>{props?.diaChi !== null ? (
                <>
                  {props.diaChi?.split("##")[0]} ,
                  <DetailAddress war={props.huyen?.split("##")[1]}
                    distr={props.thanhPho?.split("##")[2]}
                    prov={props.phuong?.split("##")[3]} />
                </>
              ) : "Tại cửa hàng"}</span></li>
            </Col>
          </Row>
        </ul>
      </div>
      <Divider />
    </>
  );
}

export default ChangeCustom;
