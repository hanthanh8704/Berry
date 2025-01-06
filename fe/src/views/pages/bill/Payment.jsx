// PaymentModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Button, Table, Input, message } from "antd";
import { NumericFormat } from 'react-number-format';
import * as request from 'views/utilities/httpRequest';
import { IconTrashX, IconCreditCard } from "@tabler/icons-react";
import { formatCurrency } from "views/utilities/format";

import axios from 'axios';
import FormatCurrency from 'views/utilities/FormatCurrency';

const PaymentModal = ({
  handleSubmitXacNhan,
  totalMoney,
  discountValue,
  shipFee,
  voucher = { discountPrice: 0 },
  props,
  onClose
}) => {

  const [transactionNo, setTransactionNo] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [extraMoney, setExtraMoney] = useState();
  const [form] = Form.useForm();


  const [billPayment, setBillPayment] = useState([]);

  const loadBillHistory = () => {
    axios.get(`http://localhost:8080/api/payment/${props.id}`)
      .then((response) => {
        console.log("Data received from API1:", response);
        console.log("Data received from API2:", response.data);
        console.log("Data received from API3:", response.data.data);
        console.log("ID passed to API call:", props.id);
        setBillPayment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    loadBillHistory();// Tính tổng tiền cần thanh toán
  }, []);

  const totalBillAmount = billPayment.reduce((sum, payment) => sum + payment.totalMoney, 0);
  // Define the calculated total amount in a variable
  const finalAmount = Math.max(0, totalMoney - discountValue +  shipFee );
  const calculateExtraMoney = (value) => {
    // Sử dụng `tienKhachDua` đã cập nhật để tính toán `extraMoney`
    setExtraMoney(value - totalMoney+ shipFee - discountValue + totalBillAmount);
  };
  
  console.log("tong tien", totalMoney - discountValue +  shipFee - totalBillAmount);
  console.log("tong tien1", finalAmount);

  const [tienKhachDua, setTienKhachDua] = useState(finalAmount);

  useEffect(() => {
    setTienKhachDua(finalAmount); // Recalculate 'tienKhachDua' whenever finalAmount changes
  }, [finalAmount]);

  const showModal = () => {
    setIsModalOpen(true);
    loadBillHistory();
    setTienKhachDua(finalAmount);
    form.resetFields();
  };


  const closeModal = () => {
    onClose();
    setIsModalOpen(false);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method); // Thay đổi phương thức thanh toán
    setTienKhachDua(0); // Reset giá trị nhập vào số tiền
    form.resetFields();
  };

  const token = localStorage.getItem('token');
  // Lấy dữ liệu từ localStorage
  const idNhanVien = localStorage.getItem('employeeId');


  const updateBillWhenSavePayMent = async (dataPaymentRequest) => {
    try {
      // const totalBill = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
      // const addressUser = checkNotEmptyAddress() ? 
      //   `${address.detail}, ${address.wards}, ${address.district}, ${address.city}` : "";
      // const idAccount = accountuser ? accountuser.idAccount : "";
      // const itemDiscount = voucher.discountPrice + exchangeRateMoney;
      console.log(props.id);
      const data = {
        id: props.id,
        invoiceType: "TAI_QUAY",
        totalMoney: totalMoney,
        shippingFee: shipFee,
        paymentStatus: "THANH_TOAN",
        vouchers: voucher ? [voucher] : [],
        paymentsMethodRequests: dataPaymentRequest,
        employeeId:idNhanVien
      };



      const response = await request.put('/bill/update-bill-wait', data);
      if (response.status === 200) {
        loadBillHistory();
        closeModal();
        console.log("Cập nhật hóa đơn thành công");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
    }
  };

  const addPayMent = () => {
    
    const newPayment = {
      method: paymentMethod,
      totalMoney: tienKhachDua,
      status: "DA_THANH_TOAN",
      transactionNo: transactionNo,
    };

        console.log(newPayment);
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có xác nhận không?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: () => {
        // setDataPayMent([...billPayment, newPayment]);
        updateBillWhenSavePayMent([newPayment]);
        setTransactionNo("");
        
        message.success('Thanh toán ' + tienKhachDua + ' VNĐ thành công!');
        if (handleSubmitXacNhan) handleSubmitXacNhan();
      },
    });
  };



  const columnsPayments = [
    {
      title: <div className="title-product">STT</div>,
      dataIndex: "indexs",
      key: "indexs",
    },
    {
      title: <div className="title-product">Mã giao dịch</div>,
      dataIndex: "transactionNo",
      key: "transactionNo",
    },
    {
      title: <div className="title-product">Phương thức</div>,
      dataIndex: "method",
      key: "method",
    },
    {
      title: <div className="title-product">Số tiền</div>,
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney, record) => (
        <>
          <span className="text-danger">
            <FormatCurrency value={record.totalMoney} />
          </span>
        </>
      )
    },
    {
      title: <div className="title-product">Trạng thái</div>,
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? ( // Kiểm tra nếu có giá trị trong status
          <Button
            style={{
              pointerEvents: "none",
              width: "120px",
              backgroundColor: status === "THANH_TOAN" ? "#4CAF50" : "", // đổi màu theo trạng thái
              borderColor: status === "THANH_TOAN" ? "#4CAF50" : "",
            }}
          >
            {status === "THANH_TOAN" ? "Đã thanh toán" : ''}
          </Button>
        ) : null, // Không render gì nếu status không có giá trị
    }

    // {
    //   title: <div className="title-product">Hành động</div>,
    //   dataIndex: "id",
    //   key: "action",
    //   render: (id, record, index) => (
    //     <Button
    //       title="Xóa"
    //       style={{ border: "none" }}
    //       onClick={(e) => deletePayMent(e, index)}
    //     >
    //       <IconTrashX style={{ fontSize: "20px", color: "red" }} />
    //     </Button>
    //   ),
    // },
  ];


  return (
    <>
      <Button onClick={showModal}>
        <IconCreditCard style={{ margin: '2px', marginRight: '5px', marginLeft: '5px' }} />
      </Button>
      <Modal
        title="Thanh toán"
        style={{ fontWeight: "bold" }}
        open={isModalOpen}
        onOk={() => {
          // form.validateFields()
          //   .then(() => {
          if (finalAmount > 0) {
            if (tienKhachDua > 0) {
              addPayMent();
            } else {
              message.error("Bạn chưa thanh toán đủ tiền");
            }
          } else {
            message.error("Thanh toán không hợp lệ, số tiền đã vượt quá yêu cầu");
          }
          // })
          // .catch((errorInfo) => {
          //   // message.error(errorInfo);
          //   message.error("Vui lòng kiểm tra lại các thông tin và nhập đúng yêu cầu");
          // });
        }}
        onCancel={() => {
          closeModal();
          onClose();
        }}
        okText="Xác nhận"
        width={650}
      >
        <Form form={form} initialValues={{ totalMoney: finalAmount, transactionNo: "" }} >
          {/* Số tiền */}
          <li className="mb-2">
            Tổng tiền cần thanh toán:
            <span className="float-end fw-semibold text-danger">
              <FormatCurrency value={finalAmount} />
            </span>
          </li>
          <Row style={{ width: "100%", marginTop: "10px" }}>


            {/* Mã giao dịch - chỉ hiển thị khi chọn Chuyển khoản */}
            {paymentMethod === "CHUYEN_KHOAN" && (
              <Col span={24} style={{ marginTop: "10px" }}>
              <Row align="middle" gutter={[16, 16]} style={{ width: "100%" }}>
                {/* Số tiền */}
                <Col span={4}>
                  <div style={{ fontWeight: "bold", color: "#333", fontSize: "13px" }}>
                    Số tiền:
                  </div>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="totalMoney"
                    style={{ marginBottom: "10px" }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số tiền",
                      },
                      {
                        validator(_, value) {
                          if (
                            !value ||
                            isNaN(value) ||
                            parseInt(value) <= 1 ||
                            !Number.isInteger(parseFloat(value))
                          ) {
                            return Promise.reject(new Error("Số tiền phải là số nguyên lớn hơn 1"));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <NumericFormat
                      thousandSeparator={true} // Bật phân cách hàng nghìn
                      placeholder="Nhập số tiền"
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "5px 12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        transition: "border-color 0.3s",
                      }}
                      customInput={Input}
                      value={tienKhachDua} // Hiển thị giá trị gốc
                      onValueChange={(values) => {
                        const value = values.floatValue; // Lấy giá trị số gốc (không có dấu phẩy)
                        setTienKhachDua(value); // Cập nhật giá trị gốc
                        calculateExtraMoney(value); // Tính lại số tiền thừa/thiếu
                      }}
                    />
                  </Form.Item>
                </Col>
            
                {/* Mã giao dịch */}
                <Col span={4}>
                  <div style={{ fontWeight: "bold", color: "#333", fontSize: "13px" }}>
                    Mã giao dịch:
                  </div>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="transactionNo"
                    style={{ marginBottom: "20px" }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã giao dịch",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập mã giao dịch"
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "5px 12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        transition: "border-color 0.3s",
                      }}
                      value={transactionNo}
                      onChange={(e) => {
                        setTransactionNo(e.target.value);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            
            )}
            {paymentMethod === "TIEN_MAT" && (
              <Col span={24} style={{ marginTop: "10px" }}>
                <Row align="middle" style={{ width: "100%" }}>
                  <Col
                    span={4}
                    style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
                  >
                    Số tiền:
                  </Col>
                  <Col span={24}>
  <Form.Item
    name="totalMoney"
    style={{ marginBottom: "10px" }}
    rules={[
      {
        required: true,
        message: "Vui lòng nhập số tiền",
      },
      {
        validator(_, value) {
          if (!value || isNaN(value) || parseInt(value) <= 1 || !Number.isInteger(parseFloat(value))) {
            return Promise.reject(new Error("Số tiền phải là số nguyên lớn hơn 1"));
          }
          return Promise.resolve();
        },
      },
    ]}
  >
    <NumericFormat
      thousandSeparator={true} // Bật phân cách hàng nghìn
      placeholder="Nhập số tiền"
      style={{
        width: "100%",
        height: "40px",
        padding: "5px 12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        transition: "border-color 0.3s",
      }}
      customInput={Input}
      value={tienKhachDua} // Hiển thị giá trị gốc
      onValueChange={(values) => {
        const value = values.floatValue; // Lấy giá trị số gốc (không có dấu phẩy)
        setTienKhachDua(value); // Cập nhật giá trị gốc
        calculateExtraMoney(value); // Tính lại số tiền thừa/thiếu
      }}
    />
  </Form.Item>
</Col>

                </Row>
              </Col>
            )}
            <li className="mb-2">
              {extraMoney >= 0 ? "Tiền thừa:   " : "Tiền thiếu:   "}
              <span className="float-end fw-semibold text-danger ms-2">
                <FormatCurrency value={Math.abs(extraMoney)} />
              </span>
            </li>
          </Row>

          {/* Nút lựa chọn phương thức thanh toán */}
          <Row style={{ width: "100%", marginTop: "20px" }} justify="center">
            <Col span={10} style={{ textAlign: "center" }}>
              <Button
                type="primary"
                onClick={() => { handlePaymentMethodChange("TIEN_MAT"); }}
                style={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor: paymentMethod === "TIEN_MAT" ? "#4CAF50" : "#ccc", // đổi màu khi được chọn
                  borderColor: paymentMethod === "TIEN_MAT" ? "#4CAF50" : "#ccc",
                  transition: "background-color 0.3s, border-color 0.3s",
                }}
              >
                Tiền mặt
              </Button>
            </Col>
            <Col span={10} style={{ textAlign: "center" }}>
              <Button
                type="primary"
                // onClick={() => setPaymentMethod("CHUYEN_KHOAN")}
                onClick={(e) => { handlePaymentMethodChange("CHUYEN_KHOAN"); }}
                style={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  backgroundColor:
                    paymentMethod === "CHUYEN_KHOAN" ? "#1E90FF" : "#ccc", // đổi màu khi được chọn
                  borderColor:
                    paymentMethod === "CHUYEN_KHOAN" ? "#1E90FF" : "#ccc",
                  transition: "background-color 0.3s, border-color 0.3s",
                }}
              >
                Chuyển khoản
              </Button>
            </Col>
          </Row>

          {/* Table và các phần khác */}
          <Row style={{ width: "100%", marginTop: "10px" }}>
            <Table
              style={{ width: "100%" }}
              dataSource={billPayment} // Đảm bảo dataSource là mảng
              columns={columnsPayments}
              pagination={{ pageSize: 3 }}
              className="customer-table"
            />


          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default PaymentModal;

