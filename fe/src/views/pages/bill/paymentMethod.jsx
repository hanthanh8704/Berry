import { Button, Form, Table, Tag, message, Alert, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentModal from "views/pages/bill/Payment.jsx";
import FormatCurrency from "views/utilities/FormatCurrency";
import FormatDate from "views/utilities/FormatDate";
const { Title, Text } = Typography;
import { Card, Typography, Carousel } from 'antd';
const listStatusPayMent = [
  { name: "Đã thanh toán", status: "DA_THANH_TOAN", color: "#024FA0" },
  { name: "Chưa thanh toán", status: "CHUA_THANH_TOAN", color: "#9C281C" },
  { name: "Trả sau", status: "TRA_SAU", color: "#7925C7" },
  { name: "Thanh toán", status: "THANH_TOAN", color: "#F2721E" },
  { name: "Hoàn tiền", status: "HOAN_TIEN", color: "#2DC255" },
];

function PaymentMethod({ bill, onSucess }) {
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [totalBillDetail, setTotalBillDetail] = useState(0);
  const [form] = Form.useForm();
  const shipFee = bill?.shippingFee || 0; // Nếu không có shippingFee, mặc định là 0

  useEffect(() => {
    loadPaymentMethod();
  }, [bill]);

  const token = localStorage.getItem('token');
    // Lấy dữ liệu từ localStorage
    const idNhanVien = localStorage.getItem('employeeId');

  const loadPaymentMethod = () => {
    // Lấy danh sách phương thức thanh toán
    axios
      .get(`http://localhost:8080/api/payment/${bill.id}`)
      .then((response) => {
        setPaymentMethod(response.data);
        console.log("paymenttttttttttttttttttt", response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Tính tổng tiền các chi tiết hóa đơn
    axios
      .get(`/bill-detail`, { params: { bill: bill.id, page: 1, sizePage: 1_000_000 } })
      .then((response) => {
        const calculatedTotalMoney = response.data.reduce((total, item) => {
          return total + item.quantity * (item.discountPercent !== null ? item.discountValue : item.price);
        }, 0);
        setTotalBillDetail(calculatedTotalMoney);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmitXacNhan = () => {
    const requestData = {
      idHD: bill.id,
      employee: idNhanVien,
      status: "DA_THANH_TOAN",
      note: "THANH_TOAN",
    };

    axios
      .put(`http://localhost:8080/api/bill/change-status`, requestData, {
        params: { idNhanVien: idNhanVien },
      })
      .then((response) => {
        onSucess();
        message.success("Thay đổi trạng thái đơn hàng thành công!");
      })
      .catch((e) => {
        console.error("Lỗi khi thay đổi trạng thái:", e);
        message.error("Không thể thay đổi trạng thái. Chi tiết lỗi: " + (e.response?.data?.message || e.message));
      });
  };

  const totalBillAmount = paymentMethod.reduce((sum, payment) => sum + payment.totalMoney, 0);

  //Hàm tính lại số tiền được trả và cần trả 
  const traSauTotal = paymentMethod
    .filter((payment) => payment.status === 'TRA_SAU')
    .reduce((sum, payment) => sum + payment.totalMoney, 0);

  const hoanTienTotal = paymentMethod
    .slice(1) // Loại bỏ khoản đầu tiên khỏi danh sách
    .filter((payment) => payment.status === 'HOAN_TIEN')
    .reduce((sum, payment) => sum + payment.totalMoney, 0);

  const chenhLech = traSauTotal - hoanTienTotal;
  const chenhLechSoSanh = traSauTotal - hoanTienTotal > 0 ? traSauTotal - hoanTienTotal : hoanTienTotal - traSauTotal;

  console.log("Lỗi khi thay đổi trạng thái:", traSauTotal);

  // const columns = [
  //   {
  //     title: "STT",
  //     dataIndex: "index",
  //     key: "index",
  //     render: (_, __, index) => index + 1,
  //   },
  //   {
  //     title: "Mã giao dịch",
  //     dataIndex: "transactionNo",
  //     key: "transactionNo",
  //     render: (x) => (x === null ? "---" : x),
  //   },
  //   {
  //     title: "Số tiền thanh toán",
  //     dataIndex: "totalMoney",
  //     key: "totalMoney",
  //     render: (money) => formatCurrency(money),
  //   },
  //   {
  //     title: 'Loại giao dịch',
  //     dataIndex: 'status', // Sử dụng status làm dataIndex
  //     key: 'status',
  //     render: (status) => {
  //       const foundStatus = listStatusPayMent.find(item => item.status === status);
  //       return (
  //         <Tag color={foundStatus ? foundStatus.color : 'default'} style={{ width: "100px" }} className="text-center">
  //           {foundStatus ? foundStatus.name : 'Không xác định'}
  //         </Tag>
  //       );
  //     },
  //   },
  //   {
  //     title: "Thời gian",
  //     dataIndex: "createdAt",
  //     key: "createdAt",
  //   },
  //   {
  //     title: "Trạng thái",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (x) => {
  //       const tagColors = {
  //         THANH_TOAN: "green",
  //         HOAN_TIEN: "red",
  //       };
  //       return (
  //         <Tag color={tagColors[x] || "blue"} style={{ width: "100px", textAlign: "center" }}>
  //           {x === "THANH_TOAN" ? "Thanh toán" : x === "HOAN_TIEN" ? "Hoàn tiền" : "Chưa xác định"}
  //         </Tag>
  //       );
  //     },
  //   },
  //   {
  //     title: "Nhân viên xác nhận",
  //     dataIndex: "employee",
  //     key: "employee",
  //   },
  // ];
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
      render: (x, record) => (
        <>{x === null ? '---' : x}</>
      )
    },
    {
      title: "Số tiền thanh toán",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (totalMoney, record) => {
        console.log("record.totalMoney:", record.totalMoney);
        return <FormatCurrency value={record.totalMoney} />;
      }

    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (x) => (<FormatDate date={x} />)
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'method',
      key: 'method',
      render: (x, record) => (
        <Tag color={x === "TIEN_MAT" ? 'green' : 'red'} style={{ width: "100px" }} className="text-center">{x === "TIEN_MAT" ? 'Tiền mặt' : 'Chuyển khoản'}</Tag>
      )
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'status', // Sử dụng status làm dataIndex
      key: 'status',
      render: (status) => {
        const foundStatus = listStatusPayMent.find(item => item.status === status);
        return (
          <Tag color={foundStatus ? foundStatus.color : 'default'} style={{ width: "100px" }} className="text-center">
            {foundStatus ? foundStatus.name : 'Không xác định'}
          </Tag>
        );
      },
    },

    // {
    //   title: "Nhân viên tiếp nhận",
    //   dataIndex: "nameEmployee",
    //   key: "nameEmployee",
    //   render: (employee, record) => {
    //     // Kiểm tra nếu không có nhân viên (null hoặc undefined)
    //     if (!employee) {
    //       return "Không có";
    //     }

    //     // Kiểm tra trạng thái và trả về giá trị phù hợp
    //     if (record.status === "HOAN_TIEN") {
    //       return `${employee}`;
    //     } else if (record.status === "TRA_SAU" || record.status === "DA_THANH_TOAN") {
    //       return `${employee}`;
    //     }

    //     // Mặc định
    //     return "Không rõ trạng thái";
    //   },
    // }


  ];

  return (
    <div className="mt-3">
      {/* Tiêu đề */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2
          className="text-uppercase"
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            background: "#f1f2f6",
            padding: "10px 20px",
            borderRadius: "5px",
            color: "#2f3542",
          }}
        >
          Lịch sử thanh toán
        </h2>
        {totalBillAmount < bill.totalMoney + shipFee && bill.invoiceStatus === "VAN_CHUYEN"&& (
          <PaymentModal
            discountValue={bill.discountAmount}
            voucher={bill.voucher}
            shipFee={bill.shippingFee}
            handleSubmitXacNhan={handleSubmitXacNhan}
            totalMoney={bill.totalMoney}
            billPayment={paymentMethod}
            props={bill}
            onClose={() => {
              loadPaymentMethod();
              onSucess();
            }}
          />
        )}
      </div>

      {/* Bảng lịch sử thanh toán */}
      <Table
        columns={columns}
        pagination={false}
        dataSource={paymentMethod.map((item, index) => ({ ...item, index }))}
        rowKey="id"
        style={{
          background: "#ffffff",
          border: "1px solid #dcdde1",
          borderRadius: "8px",
        }}
      />


      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Alert
          type="warning"
          showIcon
          message={
            <Row>
              <Col>
                <Text>
                  {paymentMethod.length === 1 && paymentMethod[0].status === 'TRA_SAU' && paymentMethod[0].method === 'TIEN_MAT' ? (
                    <>
                      Trả  sau <Text  style={{ color: "red" }} >
                        <FormatCurrency value={paymentMethod[0].totalMoney} />
                      </Text> bằng tiền mặt
                    </>
                  ) : paymentMethod.length > 1 && paymentMethod[0].status === 'TRA_SAU' && paymentMethod[0].method === 'TIEN_MAT' ? (
                    <>
                      Trả  sau<Text  style={{ color: "red" }} >
                        <FormatCurrency value={paymentMethod[0].totalMoney} />
                      </Text> bằng tiền mặt
                    </>
                  ) : paymentMethod.length > 1 && paymentMethod[0].status === 'DA_THANH_TOAN' && paymentMethod[0].method === 'CHUYEN_KHOAN' ? (
                    <>
                      <Text>
                        Khách hàng đã trả <Text  style={{ color: "red" }} >
                          <FormatCurrency value={paymentMethod[0].totalMoney} />
                        </Text> bằng phí VNPay,
                        {chenhLech > 0 && (
                          <> và khách hàng phải trả thêm <Text  style={{ color: "red" }} >
                            <FormatCurrency value={chenhLech} />
                          </Text> bằng tiền mặt </>
                        )}
                        {chenhLech < 0 && (
                          <> và được của hàng hoàn trả <Text  style={{ color: "red" }} >
                            <FormatCurrency value={Math.abs(chenhLech)} />
                          </Text> bằng phí VNPay </>
                        )}

                      </Text>
                    </>
                  ) : paymentMethod.length === 1 && paymentMethod[0].status === 'DA_THANH_TOAN' && paymentMethod[0].method === 'CHUYEN_KHOAN' ? (
                    <>
                     Khách hàng đã trả  <Text strong>
                        <FormatCurrency value={paymentMethod[0].totalMoney} />
                      </Text> bằng phí VNPay
                    </>
                  ) : null}
                </Text>
              </Col>
            </Row>
          }
          style={{
            backgroundColor: '#fff9f0', // Màu nền nhạt
            border: '1px solid #ffe58f', // Màu viền nhẹ
            borderRadius: '8px', // Bo góc
            padding: '12px',
            fontSize: '14px',
          }}
        />

      </div>

    </div>
  );
}

export default PaymentMethod;
