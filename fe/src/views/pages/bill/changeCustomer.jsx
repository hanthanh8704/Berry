//  Hàm này chứa thông tin chi tiết của đơn hàng và khách hàng

import { Col, Divider, Row } from "antd";
import Title from "antd/es/skeleton/Title";
import React from "react";
import DetailAddress from "ui-component/extended/AddressDetail";
import FormatCurrency from "views/utilities/FormatCurrency";
import changeBill from "./changeBill";

function ChangeCustom({props, onSuccess}){
    return (
        <>
          <div className="mt-3">
          <h2 level={7} className="text-danger text-uppercase" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', background:'#c8d6e5', color:'#1e272e' }}> Thông tin đơn hàng </h2>

            <Row gutter={24} className="fw-semibold">
              <Col xl={12}>
                <ul className="list-unstyled">
                <li className="mb-2">Mã đơn hàng: <span className="float-end text-danger">{props?.ma}</span></li>
                  <li className="mb-2">Trạng thái: <span className="float-end text-danger">{props.trangThai === " Chờ thanh toán" ? " Chờ thanh toán" : props.trangThai === " Tạo đơn hàng" ? " Tạo đơn hàng" : props.trangThai === " Chờ xác nhận" ? " Chờ xác nhận" : props.trangThai === " Xác nhận thông tin thanh toán" ? " Xác nhận thông tin thanh toán" : props.trangThai === " Chờ giao" ? " Chờ giao" : props.trangThai === " Đang giao" ? " Đang giao" : props.trangThai === " Hoàn thành" ? " Hoàn thành" : props.trangThai === " Hủy" ? " Hủy" : " "}</span></li>
                  <li className="mb-2">Loại đơn hàng: <span className="float-end text-danger">{props.loaiDonHang === 0 ? " Tại quầy" : " Giao hàng"}</span></li>
                </ul>
              </Col>
              <Col xl={12}>
                <ul className="list-unstyled">
                  <li className="mb-2">Phí vận chuyển: <span className="float-end text-danger">{
                    props.type === 1 ? <FormatCurrency value={props.phiShip} /> : "Không có"
                  }</span></li>
                  <li className="mb-2">Tổng tiền: <span className="float-end text-danger"><FormatCurrency value={props.tongTien} /></span></li>
                  <li className="mb-2">Phải thanh toán: <span className="float-end text-danger"><FormatCurrency value={props.tongTien + props.moneyShip} /></span></li>
                </ul>
              </Col>
              <Col xl={8}>
    
              </Col>
              {props.phieuGiamGia !== null && (
                <Col xl={24}>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      Mã giảm giá: <span className="text-danger">({props?.phieuGiamGia?.ma})</span> {props.phieuGiamGia?.ma} - giảm <span className="text-danger">{props.phieuGiamGia?.giaTriHoaDonDuocGiam} %</span> cho đơn tối thiểu từ <span className="text-danger"><FormatCurrency value={props.phieuGiamGia?.giaTriHoaDonDuocApDung} /></span>, đã giảm <span className="text-success"><FormatCurrency value={props.tongTienSauGiamGia} /></span>
                    </li>
                  </ul>
                </Col>
              )}
            </Row>
          </div>
          <Divider />
          <div>
            <div className="d-flex">
              <div className="flex-grow-1">
              <h2 level={5} className="text-danger text-uppercase" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'left', background:'#c8d6e5', color:'#1e272e' }}> Thông tin khách hàng </h2>

              </div>
              <div className="">
                {props.trangThai <= 4 ? (
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
                      <DetailAddress war={props.diaChi?.split("##")[1]}
                        distr={props.diaChi?.split("##")[2]}
                        prov={props.diaChi?.split("##")[3]} />
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