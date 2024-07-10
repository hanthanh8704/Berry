import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as request from 'views/utilities/httpRequest';
import Loading from 'ui-component/Loading';
import FormatDate from 'views/utilities/FormatDate';
import FormatCurrency from 'views/utilities/FormatCurrency';
import logo from 'assets/images/logo.svg';
import './ExportTest.css';

function TemplateExportBill() {
  const { id } = useParams();
  const [hoaDonChiTiet, setHoaDonChiTiet] = useState([]);
  const [hoaDon, setHoaDon] = useState();
  const [loading, setLoading] = useState(true);

  const loadBillDetail = async () => {
    try {
      const responseChiTiet = await request.get(`/bill-detail`, {
        params: {
          bill: id,
          page: 1,
          idHoaDon : id,
          sizePage: 1_000_000,
        },
      });
      setHoaDonChiTiet(responseChiTiet.data);

      const responseHoaDon = await request.get(`/bill/${id}`);
      setHoaDon(responseHoaDon);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillDetail();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="logo-container">
          <img src={logo} className="logo" alt="Logo" />
        </div>
        <div className="store-info">
          <h1>Berry Store</h1>
          <p>Địa chỉ: Tòa nhà FPT Polytechnic, Phố Trịnh Văn Bô, Nam Từ Liêm, Hà Nội</p>
          <p>Điện thoại: 0123 456 789</p>
          <p>Email: hanthanh2k4@gmail.com</p>
        </div>
      </div>

      <div className="invoice-title">
        <h2>HÓA ĐƠN BÁN HÀNG</h2>
      </div>

      <div className="customer-info">
        <h3>Thông tin khách hàng</h3>
        {hoaDon && (
          <div className="info-box">
            <p><strong>Khách hàng:</strong> {hoaDon.tenNguoiNhan || 'Khách hàng lẻ'}</p>
            <p><strong>Địa chỉ:</strong> {hoaDon.diaChi ? hoaDon.diaChi.split('##').join(', ') : 'Tại cửa hàng'}</p>
            <p><strong>Ngày mua:</strong> <FormatDate date={hoaDon.ngayTao} /></p>
            <p><strong>Nhân viên bán hàng:</strong> {hoaDon.nguoiTao || '##'}</p>
          </div>
        )}
      </div>

      <div className="product-list">
        <h3>Danh sách sản phẩm</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {hoaDonChiTiet.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.soLuong}</td>
                <td><FormatCurrency value={item.discountValue ?? item.gia} /></td>
                <td><FormatCurrency value={item.soLuong * (item.discountValue ?? item.gia)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-info">
        <h3>Thông tin thanh toán</h3>
        {hoaDon && (
          <div className="info-box">
            <p><strong>Giảm giá : </strong> <FormatCurrency value={hoaDon.soTienDuocGiam} /></p>
            <p><strong>Phí vận chuyển : </strong> <FormatCurrency value={hoaDon.phiShip} /></p>
            <p><strong className="text-danger">Tổng tiền phải thanh toán:</strong> <FormatCurrency value={hoaDon.tongTien + hoaDon.phiShip} /></p>
            <p><strong>Trạng thái : {hoaDon.trangThaiHoaDon}</strong></p>
          </div>
        )}
      </div>

      {hoaDon && hoaDon.phieuGiamGia && (
        <div className="voucher-info">
          <h3>Thông tin giảm giá</h3>
          <div className="info-box">
            <p>
              <strong className="text-danger">*({hoaDon.phieuGiamGia.ma})</strong> {hoaDon.phieuGiamGia.ten} - giảm 
              <strong className="text-danger"> {hoaDon.phieuGiamGia.giaTriHoaDonDuocGiam}</strong> cho đơn tối thiểu từ 
              <strong className="text-danger"> <FormatCurrency value={hoaDon.phieuGiamGia.giaTriHoaDonDuocApDung} /></strong>, đã giảm 
              <strong className="text-success"> <FormatCurrency value={hoaDon.soTienDuocGiam} /></strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateExportBill;
