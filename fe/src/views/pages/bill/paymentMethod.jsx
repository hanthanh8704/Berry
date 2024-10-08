import { Button, Col, Form, Input, InputNumber, Modal, Row, Table, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import formatCurrency from "views/utilities/format";
import * as request from "views/utilities/httpRequest";
import FormatDate from "views/utilities/FormatDate";
import FormatCurrency from "views/utilities/FormatCurrency";

function PaymentMethod({ bill, onSucess }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái để điều khiển việc mở/đóng Modal
  const [paymentMethod, setPaymentMethod] = useState([]); // Danh sách các phương thức thanh toán
  const [method, setMethod] = useState(0); // Phương thức thanh toán được chọn
  const [totalPayment, setTotalPayment] = useState(0); // Tổng số tiền đã thanh toán
  const [extraMoney, setExtraMoney] = useState(null); // Số tiền thừa trả lại khách (nếu có)

  const [totalBillDetail, setTotalBillDetail] = useState(0); // Tổng số tiền của chi tiết đơn hàng

  const [isRefund, setIsRefund] = useState(false); // Biến để xác định xem đang là quá trình hoàn trả hay không

  const [form] = Form.useForm(); // Form để quản lý dữ liệu đầu vào và gửi dữ liệu

  useEffect(() => {
    loadPaymentMethod(); // Load dữ liệu các phương thức thanh toán khi có sự thay đổi trong `bill`
  }, [bill]);

  const loadPaymentMethod = () => {
    // Lấy danh sách phương thức thanh toán từ API
    request.get(`/payment-method/${bill.id}`).then((response) => {
      setPaymentMethod(response); // Cập nhật danh sách phương thức thanh toán
      // Tính tổng số tiền đã thanh toán
      const caculateTotalPayment = response.reduce((total, item) => {
        return total + item.totalMoney;
      }, 0);
      setTotalPayment(caculateTotalPayment); // Cập nhật tổng số tiền đã thanh toán
    }).catch((error) => {
      console.error(error);
    });

    // Lấy chi tiết đơn hàng từ API
    request.get(`/bill-detail`, {
      params: { bill: bill.id, page: 1, sizePage: 1_000_000, }
    }).then((response) => {
      // Tính tổng số tiền của chi tiết đơn hàng
      const calculatedTotalMoney = response.data.reduce((total, item) => {
        return total + item.quantity * (item.discountPercent !== null ? item.discountValue : item.price);
      }, 0);
      setTotalBillDetail(calculatedTotalMoney); // Cập nhật tổng số tiền của chi tiết đơn hàng
    }).catch((e) => {
      console.log(e);
    });

    // Đặt giá trị mặc định cho form thanh toán
    form.setFieldsValue({
      totalMoney: bill.totalMoney + bill.moneyShip - totalPayment
    });
  }

  const handleCreatePaymentMethod = (data) => {
    data.totalMoney = bill.totalMoney + bill.moneyShip - totalPayment;
    data.type = !isRefund; // Xác định loại giao dịch là thanh toán
    data.method = method; // Xác định phương thức thanh toán
    data.bill = bill.id; // Thêm ID đơn hàng vào dữ liệu gửi đi
    // Gửi yêu cầu tạo mới phương thức thanh toán đến API
    request.post(`/payment-method`, data).then((response) => {
      loadPaymentMethod(); // Sau khi tạo mới thành công, load lại danh sách phương thức thanh toán
      onSucess(); // Gọi hàm callback khi thành công
      toast.success(`Đã thanh toán ${formatCurrency(data.totalMoney)}`); // Hiển thị thông báo thành công
      setIsModalOpen(false); // Đóng Modal
      form.resetFields(); // Đặt lại các trường trong form
    }).catch((error) => {
      console.error(error);
      toast.error(error.response.data); // Hiển thị thông báo lỗi
    });
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'maGiaoDich',
      key: 'maGiaoDich',
      render: (x, record) => (
        <>{x === null ? '---' : x}</>
      )
    },
    {
      title: 'Số tiền',
      dataIndex: 'tongTienThanhToan',
      key: 'tongTienThanhToan',
      render: (x) => (<FormatCurrency value={x} />)
    },
    {
      title: 'Thời gian',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (x) => (<FormatDate date={x} />)
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'tenHinhThuc',
      key: 'tenHinhThuc',
      render: (x, record) => (
        <Tag color={x === true ? 'green' : 'red'} style={{ width: "100px" }} className="text-center">{x === true ? 'Thanh toán' : 'Hoàn trả'}</Tag>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
    },
    {
      title: 'Nhân viên xác nhận',
      dataIndex: 'nguoiTao',
      key: 'nguoiTao',
    },
  ];

  return (
    <>
      <div className="mt-3">
        <div className="d-flex align-items-center">
        <h2 level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20', textAlign: 'left' ,background:'#c8d6e5', color:'#1e272e'}}> Lịch sử thanh toán </h2>

          <div className="p-2">
            {/* Nút xác nhận thanh toán */}
            {totalPayment < (bill.totalMoney + bill?.moneyShip) && (
              <>
                <Button type="primary" className='text-dark bg-warning' onClick={() => { setIsModalOpen(true); loadPaymentMethod() }}>Xác nhận thanh toán</Button>
              </>)}
          </div>
        </div>

        <Modal title={`Xác nhận thanh toán`} open={isModalOpen} onOk={() => { setIsModalOpen(false); }} onCancel={() => { setIsModalOpen(false); }} footer={
          <>
            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={() => form.submit()} type="primary">Thanh toán</Button>
          </>
        }>
          <Form layout="vertical" form={form} onFinish={handleCreatePaymentMethod}>
            <Form.Item label={`Tiền khách đưa`} name="totalMoney" rules={[{ required: true, message: `Tiền khách đưa không được để trống!`, },]}>
              <InputNumber className='w-100 mb-2' formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} suffix="VNĐ" placeholder="Nhập tiền khách đưa..." onChange={(e) => { setExtraMoney(e - (bill.totalMoney + bill.moneyShip - totalPayment)); }} />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note" rules={[{ required: true, message: "Ghi chú không được để trống!", },]}>
              <TextArea />
            </Form.Item>
            <Row gutter={10} className="mt-3">
              <Col xl={12} onClick={() => setMethod(0)}>
                <div className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${method === 1 ? `text-secondary border-secondary` : 'border-warning text-warning'}`}>
                  <i className="fa-solid fa-coins" style={{ fontSize: "36px" }}></i>
                  <span className="ms-2 fw-semibold text-dark">Tiền mặt</span>
                </div>
              </Col>
              <Col xl={12} onClick={() => setMethod(1)}>
                <div className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${method === 0 ? `text-secondary border-secondary` : 'border-warning text-warning'}`}>
                  <i class="fa-regular fa-credit-card" style={{ fontSize: "36px" }}></i>
                  <span className="ms-2 fw-semibold text-dark">Chuyển khoản</span>
                </div>
              </Col>
            </Row>
          </Form>
          {/* Hiển thị thông tin tiền cần thanh toán và tiền thừa khi không phải quá trình hoàn tiền */}
          <div className="mt-3 fw-semibold ">
            Số tiền cần thanh toán: <span className=" float-end fw-semibold text-danger">
              <FormatCurrency value={bill.totalMoney + bill.moneyShip - totalPayment} />
            </span>
            <br />
            Tiền thừa trả khách: <span className=" float-end text-success">
              <FormatCurrency value={extraMoney < 0 ? 0 : extraMoney} />
            </span>
          </div>
        </Modal>

        {/* Hiển thị bảng lịch sử thanh toán */}
        <Table columns={columns} pagination={false} dataSource={paymentMethod} />
      </div>
    </>
  );
}

export default PaymentMethod;

