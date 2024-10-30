import { Alert, Button, Carousel, Col, Divider, Empty, Form, Input, InputNumber, Modal, Row, Switch, Table, Tooltip } from 'antd';
import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Title from 'antd/es/typography/Title';
import TextArea from 'antd/es/input/TextArea';
import GHNDetail from 'ui-component/GHNDetail';
import FormatCurrency from 'views/utilities/FormatCurrency';
import * as request from 'views/utilities/httpRequest';
import CustomerOrder from './customerOrder';
import AddressOrders from './addressOrder';
import ShowProductModal from './modalProductOrder';
import VoucherOrder from './voucherOrder';
import axios from 'axios';
import FormatTime from 'views/utilities/FormatTime';
import 'react-toastify/dist/ReactToastify.css';
import { IconPhotoStar, IconTrashFilled, IconX } from '@tabler/icons-react';
import QrCode from 'components/QrCode';
import ReactToPrint from 'react-to-print';
import formatCurrency from 'views/utilities/format';
import PaymentModal from "views/pages/bill/Payment.jsx";
import moment from 'moment';
  import { useReactToPrint } from "react-to-print";

function OrderItem({ index, props, onSuccess }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [invoiceType, setInvoiceType] = useState('TAI_QUAY');
  const [customer, setCustomer] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [autoFillAddress, setAutoFillAddress] = useState([]);
  const [newAddress, setNewAddress] = useState({});
  const [shippingFee, setShippingFee] = useState(0);
  const [note, setNote] = useState('');
  const [choThanhToan, setChoThanhToan] = useState(true); //
  const [waitPay, setWaitPay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('Tiền mặt'); // Hình thức thanh toán
  const [extraMoney, setExtraMoney] = useState(null); // tiền thừa
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [totalMoney, setTotalMoney] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const [discountValue, setDiscountValue] = useState(0); // Số tiền đã giảm

  const [tienMat, setTienMat] = useState(0);
  const [tienChuyenKhoan, setTienChuyenKhoan] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);


  useEffect(() => {
    setTienKhachDua(0);
    setExtraMoney(0);
  }, [paymentStatus]);

  useEffect(() => {
    loadListOrderDetail();
  }, [props, currentPage, pageSize]);

  const onSelect = (value) => {
    request
      .post('/bill-detail', {
        idBill: props.id,
        productDetail: value,
        quantity: 1
      })
      .then((response) => {
        toast.success('Thêm thành công!');
        loadListOrderDetail();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getHtmlByIdBill2 = (valueid, totalExcessMoney) => {
    request.then((res) => {
      document.getElementById("pdfContent").innerHTML = res.data.data;
      generatePDF();
      removePane(targetKey, invoiceNumber, items);
    });
  };


  // Hàm này dùng để load danh sách hóa đơn ct
  const loadListOrderDetail = async () => {
    await request
      .get(`/bill-detail`, {
        params: {
          idBill: props.id,
          page: currentPage,
          sizePage: pageSize
        }
      })
      .then((response) => {
        setListOrderDetail(response.data);
        console.log(response.data);
        setTotalPages(response.totalPages);


        const calculatedTotalMoney = response.data.reduce((total, item) => {
          return total + item.quantity * item.price;
        }, 0);
        // Hàm tính tổng số lượng sp
          const calculateTotalWeight = response.data.reduce((total, item) => {
            return total + item.weight * item.quantity;
          }, 0);
          setTotalWeight(calculateTotalWeight);
        setTotalMoney(calculatedTotalMoney);


      })
      .catch((e) => {
        console.log(e);
      });

    // await request
    //   .get(`/bill-detail`, {
    //     params: {
    //       idBill: props.id,
    //       page: 1,
    //       sizePage: 1_000_000
    //     }
    //   })
    //   .then((response) => {
    //     // Hàm tính tổng tiền của hdct
    //     const calculatedTotalMoney = response.data.reduce((total, item) => {
    //       return total + item.quantity * (item.phanTramGiam !== null ? item.discountPrice : item.price);
    //     }, 0);
    //     // Hàm tính tổng số lượng sp
    //       const calculateTotalWeight = response.data.reduce((total, item) => {
    //         return total + item.weight * item.quantity;
    //       }, 0);
    //       setTotalWeight(calculateTotalWeight);
    //     setTotalMoney(calculatedTotalMoney);
    //     //   setLoading(false);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  // Hàm lấy khách hàng
  const getCustomer = async (id) => {
    setCustomer(await request.get(`/customer/${id}`));
    const dataAddress = await request.get(`/address/${id}`);
    setListAddress(dataAddress.content);
    console.log(dataAddress.content);
    setAutoFillAddress(dataAddress.content.find((item) => item.diaChiMacDinh === true) || dataAddress.content[0]);
  };

  // Hàm này dùng để lựa chọn khách hàng
  const handleSelectCustomer = (value) => {
    getCustomer(value);
  };

  // Hàm này dùng để xóa khách hàng
  const handleDeleteCustomer = () => {
    setCustomer(null);
    setAutoFillAddress([]);
    setInvoiceType('Chờ thanh toán');
  };

  useEffect(() => {
    if (autoFillAddress !== null) {
      caculateFee();
      form.setFieldsValue({
        fullName: autoFillAddress.fullName,
        phoneNumber: autoFillAddress.phoneNumber,
        detailedAddress: autoFillAddress.detailedAddress,
        city: parseInt(autoFillAddress.city),
        district: parseInt(autoFillAddress.district),
        ward: autoFillAddress.ward
      });
    }
  }, [autoFillAddress]);

  // Hàm tính phí vc
  const caculateFee = async () => {
    await request
      .post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          service_id: 53320, // ID của dịch vụ
          service_type_id: null, // Loại dịch vụ (null)
          to_district_id: parseInt(autoFillAddress.district), // ID của quận/huyện nhận hàng
          to_ward_code: autoFillAddress.ward, // Mã phường/xã nhận hàng
          height: 50, // Chiều cao của gói hàng
          length: 20, // Chiều dài của gói hàng
          weight: totalWeight, // Trọng lượng của gói hàng
          width: 20, // Chiều rộng của gói hàng
          cod_failed_amount: 2000, // Số tiền thu hộ nếu giao hàng thất bại
          insurance_value: 10000, // Giá trị bảo hiểm của hàng hóa
          coupon: null // Mã giảm giá (null)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '99abf4d9-459d-11ef-81ca-16811e31e571',
            ShopId: 5206612
          }
        }
      )
      .then((response) => {
        setShippingFee(response.data.data.total); // Cập nhật phí vận chuyển vào trạng thái
      })
      .catch((e) => {
        console.log(e); // In lỗi ra console nếu yêu cầu thất bại
      });
  };

  // Kiểm tra xem có thể áp dụng được phiếu giảm khong
  useEffect(() => {
    if (voucher !== null) {
      if (totalMoney < voucher?.minOrderValue) {
        toast.error('Không thể áp dụng phiếu giảm giá do không đủ điều kiện!');
        setVoucher(null);
        setDiscountValue(0);
      } else if (voucher?.maxDiscountValue !== null && totalMoney > voucher?.maxDiscountValue) {
        toast.error('Không thể áp dụng phiếu giảm giá do tổng tiền vượt quá giới hạn!');
        setVoucher(null);
        setDiscountValue(0);
      } else {
        setDiscountValue((totalMoney / 100) * voucher?.discountValue);
      }
    }
  }, [voucher, totalMoney]);

  useEffect(() => {
    caculateFee();
  }, [totalWeight]);

  // debugger
  // Hàm này dùng để thay đổi số lượng sản phẩm trong hdct
  const handleChangeQuantity = async (record, quantity) => {
    await request
      .get(`/bill-detail/update-quantity/${record.id}`, {
        params: {
          newQuantity: quantity,
          donGia: record.discountPrice === null ? record.price : record.discountPrice
        }
      })
      .then((response) => {
        loadListOrderDetail();
        console.log(record);
        toast.success('Cập nhật số lượng thành công!'); // Thêm thông báo thành công
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data);
      });
  };

  // debugger
  // Hàm này dùng để xóa sản phẩm khỏi giỏ hàng
  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: 'Xác nhận',
      maskClosable: true,
      content: 'Xác nhận xóa khỏi giỏ hàng ?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        await request
          .remove(`/bill-detail/${id}`)
          .then((response) => {
            toast.success('Xóa thành công!');
            loadListOrderDetail();
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      }
    });
  };
  
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: <IconPhotoStar />,
      dataIndex: 'image',
      key: 'image',
      render: (item, record) => (
        <>
          <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} style={{ width: '150px' }}>
            {item !== undefined &&
              item.split(',').map((images, index) => (
                <div className="position-relative" style={{ height: '150px' }}>
                  <img src={images} alt="image" style={{ width: '150px', height: '150px' }} className="object-fit-contain" />
                </div>
              ))}
          </Carousel>
        </>
      )
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="d-flex flex-column justify-content-between">
          <div className="fw-semibold">{record.name}</div>
          <div>
            <small>Mã SP: {record.detailCode}</small>
          </div>
          <div>
            <span className="text-secondary"> </span>
            {record.discountPrice && record.discountPrice !== 0 ? (
              <>
                Đơn giá :
                <span className="text-decoration-line-through text-muted ms-2">
                  <FormatCurrency value={record.price} />
                </span>
                <br />
                Giảm giá :
                <span className="ms-2 text-danger fw-bold">
                  <FormatCurrency value={record.discountPrice} />
                </span>
              </>
            ) : (
              <span className="text-danger fw-bold">
                Đơn giá <FormatCurrency value={record.price} />
              </span>
            )}
          </div>
        </div>
      )
    },    
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Form key={record.id}>
          <Form.Item initialValue={quantity} name={'quantity'} className="m-0 p-0">
            <Input
              className="text-center"
              min={1}
              type="number"
              style={{ width: '64px' }}
              onPressEnter={(e) => handleChangeQuantity(record, e.target.value)}
            />
          </Form.Item>
        </Form>
      )
    }, 
    {
      title: 'Tổng tiền',
      dataIndex: 'quantity',
      key: 'total',
      render: (quantity, record) => (
        <div className="text-danger fw-bold">
          <FormatCurrency value={(record.discountPrice || record.price) * quantity} />
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <Tooltip placement="top" title="Xóa">
          <Button onClick={() => handleDeleteBillDetail(id)} type="text" className="text-danger">
            <IconTrashFilled />
          </Button>
        </Tooltip>
      )
    }
  ];

  function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // Tạo đơn hàng
  const handleCreate = async () => {
    const data = {};
    data.voucher = voucher === null ? null : voucher.id;
    data.customer = customer === null ? null : customer.id;
    data.invoiceType = invoiceType;
    data.recipientName = invoiceType === 'TAI_QUAY' ? (customer !== null ? customer?.fullName : 'Khách hàng lẻ') : autoFillAddress.fullName;
    data.totalMoney = totalMoney;
    data.discountValue = discountValue;
    data.note = note;
    data.paymentStatus = paymentStatus;
    data.tienMat = tienMat;
    data.tienChuyenKhoan = tienChuyenKhoan;

    data.recipientPhone = autoFillAddress.phoneNumber;
    data.address =
    invoiceType === 'TAI_QUAY'
        ? null
        : `${autoFillAddress.detailedAddress}##${autoFillAddress.ward}##${autoFillAddress.district}##${autoFillAddress.city}`;
    data.shippingFee = invoiceType === 'TRUC_TUYEN' ? shippingFee : 0;
    data.choThanhToan = choThanhToan;
    data.waitPay = waitPay;
    if (listOrderDetail.length === 0) {
      toast.error('Hãy thêm gì đó vào giỏ hàng!');
    } else {
      if (paymentStatus === 'Cả hai') {
        if (tienMat <= 0 || tienMat === null) {
          toast.error('Vui lòng nhập số tiền mặt cần thanh toán!');
          return;
        }
        if (tienMat > totalMoney) {
          toast.error('Tiền khách đưa phải < tổng tiền cần thanh toán!');
        } else {
          const bill = { ...data, idTransaction: generateUUID(), id: props.id };
          localStorage.setItem('checkout', JSON.stringify(bill));
          try {
            const response = await axios.get(
              `http://localhost:8080/api/vn-pay/payment?id=${bill.idTransaction}&total=${Math.floor(tienChuyenKhoan)}`
            );
            if (response.status) {
              window.location.href = response.data.data;
            }
          } catch (error) {
            console.error('Error making axios request:', error);
          }
          return;
        }
      } else if (paymentStatus === 'Chuyển khoản') {
        const bill = { ...data, idTransaction: generateUUID(), id: props.id };
        localStorage.setItem('checkout', JSON.stringify(bill));
        try {
          const response = await axios.get(
            `http://localhost:8080/api/vn-pay/payment?id=${bill.idTransaction}&total=${Math.floor(bill.totalMoney - bill.discountValue + bill.shippingFee)}`
          );
          if (response.status) {
            window.location.href = response.data.data;
          }
        } catch (error) {
          console.error('Error making axios request:', error);
        }
        return;
      } else {
        // if (invoiceType === 'TAI_QUAY' && !choThanhToan) {
        //   if (tienKhachDua <= 0 || tienKhachDua === null) {
        //     toast.error('Vui lòng nhập đủ tiền khách đưa!');
        //     console.log(data);
        //     return;
        //   }
        // }
        if (invoiceType === 'TAI_QUAY' && !waitPay ) {
          if (tienKhachDua <= 0 || tienKhachDua === null) {
            toast.error('Vui lòng nhập đủ tiền khách đưa!');
            console.log(data);
            return;
          }
        }
      }
      Modal.confirm({
        title: 'Xác nhận',
        maskClosable: true,
        content: `Xác nhận ${waitPay ? 'chuyển đơn hàng sang trạng thái chờ thanh toán' : 'tạo hóa đơn'} ?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          console.log(data);
          request
            .put(`/bill/${props.id}`, data)
            .then((response) => {
              toast.success('Tạo đơn hàng thành công!');
              navigate('/orders'); // Điều hướng trước
              setTimeout(() => {
                window.location.reload(); // Đợi 2-3 giây rồi reload trang
              }, 3000); // 3000ms = 3s
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });      
    }
  };

  const [billPayment, setBillPayment] = useState([]);

  const loadBillHistory = () => {
     axios.get(`http://localhost:8080/api/payment/${props.id}`)
        .then((response) => {
            console.log("Data received from API:", response.data);
            console.log("Data received from API:", response.data);
            console.log("Data received from API:", response.data.totalMoney);
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

useEffect(() => {
  loadBillHistory();// Tính tổng tiền cần thanh toán
  
}, []);

  return (
    <>
      <div>
        {/* <div ref={componentRef}> */}
        <div>
          <ToastContainer />
          <div className="d-flex">
            <div className="flex-grow-1">
              <Title level={5}>Đơn hàng {props.code}</Title>
            </div>
            <div className="me-1">
              <ShowProductModal
                idBill={props.id}
                onClose={() => {
                  loadListOrderDetail();
                }}
              />
            </div>
            <div className="">
              <QrCode title={'QR Code'} onQrSuccess={onSelect} />
            </div>
            ;
          </div>

          <div style={{ boxShadow: '2px 2px 4px 4px rgba(0, 0, 0, 0.03)' }} className="my-3 p-2">
            <Title level={5}>Giỏ hàng</Title>
            {listOrderDetail.length === 0 ? (
              <Empty description={'Chưa có sản phẩm'} className="py-5" />
            ) : (
              <Table
                dataSource={listOrderDetail}
                columns={columns}
                className="mt-3"
                pagination={{
                  // showSizeChanger: true,
                  current: currentPage,
                  pageSize: pageSize,
                  pageSizeOptions: [3, 5, 10, 20],
                  // showQuickJumper: true,
                  total: totalPages * pageSize,
                  onChange: (page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  }
                }}
              />
            )}
          </div>

          <div style={{ boxShadow: '2px 2px 4px 4px rgba(0, 0, 0, 0.03)' }} className="my-3 p-2">
            <div className="d-flex mb-2">
              <div className="flex-grow-1">
                <Title level={5}>Thông tin khách hàng</Title>
              </div>
              {customer !== null && (
                <Button className="me-1 " type="text" onClick={() => handleDeleteCustomer()}>
                  {customer?.fullName}
                  <Tooltip title="Loại bỏ khách hàng">
                    <IconX color="red" />
                  </Tooltip>
                </Button>
              )}
              <div className="">
                <CustomerOrder handleSelect={handleSelectCustomer} />
              </div>
            </div>
            <Divider className="m-0 mb-3" />
            <Row gutter={10}>
              <Col xl={12}>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    Tên khách hàng:{' '}
                    <span style={{ fontWeight: 'bold' }} className="ms-3">
                      {customer === null ? 'Khách hàng lẻ' : customer?.fullName}
                    </span>
                  </li>
                  {customer !== null && (
                    <>
                      <li className="mb-2">
                        Email: <span className="float-end fw-semibold">{customer?.email}</span>
                      </li>
                      <li className="mb-2">
                        Số điện thoại: <span className="float-end fw-semibold">{customer?.phoneNumber}</span>
                      </li>
                    </>
                  )}
                </ul>
              </Col>
              <Col xl={12}>
                <ul className="list-unstyled">
                  {customer !== null && (
                    <>
                      <li className="mb-2">
                        Giới tính: <span className="float-end fw-semibold">{customer?.gender}</span>
                      </li>
                      <li className="mb-2">
                        Ngày sinh:{' '}
                        <span className="float-end fw-semibold">
                          <FormatTime date={customer?.dateOfBirth} />
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </Col>
            </Row>
          </div>

          {/* Thông tin thanh tóan */}
          <div style={{ boxShadow: '2px 2px 4px 4px rgba(0, 0, 0, 0.03)' }} className="my-3 p-2 mt-4">
            <div className="d-flex">
              <div className="flex-grow-1">
                <Title level={5}>Thông tin thanh toán</Title>
              </div>
              {/*  */}
              <div className="">
                {customer !== null && invoiceType === 'Đặt hàng' && (
                  <AddressOrders
                  customer={customer.id}
                    onSuccess={(address) => {
                      setAutoFillAddress(address);
                    }}
                  />
                )}
              </div>
            </div>


            {/* Thông tin khách hàng */}
            
            <Divider className="m-0 mb-3" />
            <Row gutter={10}>
              <Col xl={14}>
                {invoiceType !== 'TRUC_TUYEN' ? (
                  <img width={'100%'} alt="" />
                ) : (
                  <>
                    <Form layout="vertical" form={form} onFinish={(data) => console.log(data)}>
                      <Row gutter={10}>
                        <Col xl={12}>
                          <Form.Item label="Họ và tên" required name={'fullName'}>
                            <Input
                              placeholder="Nhập họ và tên..."
                              onChange={(e) => setAutoFillAddress({ ...autoFillAddress, fullName: e.target.value })}
                            />
                          </Form.Item>
                        </Col>
                        <Col xl={12}>
                          <Form.Item label="Số điện thoại" required name={'phoneNumber'}>
                            <Input
                              placeholder="Nhập số điện thoại..."
                              onChange={(e) => setAutoFillAddress({ ...autoFillAddress, recipientPhone: e.target.value })}
                            />
                          </Form.Item>
                        </Col>
                        <GHNDetail
                          city={autoFillAddress.city}
                          dataAddress={(data) => setAutoFillAddress({ ...autoFillAddress, ...data })}
                          district={autoFillAddress.district}
                          ward={autoFillAddress.ward}
                        />
                        <Col xl={16}>
                          <Form.Item label="Địa chỉ cụ thể" name={'detailedAddress'}>
                            <Input
                              placeholder="Nhập địa chỉ cụ thể ..."
                              onChange={(e) => setAutoFillAddress({ ...autoFillAddress, detailedAddress: e.target.value })}
                            />
                          </Form.Item>
                        </Col>
                        <Col xl={8}>
                          <img
                            src="https://donhang.ghn.vn/static/media/Giao_Hang_Nhanh_Toan_Quoc_color.b7d18fe5.png"
                            alt=""
                            width={'100%'}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </Col>
              <Col xl={10} md={24}>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    {customer !== null && (
                      <>
                        <Switch
                          onChange={(value) => {
                            setInvoiceType(value ? 'TRUC_TUYEN' : 'TAI_QUAY');
                          }}
                        />{' '}
                        Giao hàng
                      </>
                    )}
                  </li>
                  <Row gutter={20}>
                    <VoucherOrder
                      onSelectVoucher={(voucher) => {
                        if (voucher.quantity <= 0) {
                          toast.error('Phiếu giảm giá này đã hết lượt sử dụng!');
                        } else {
                          setVoucher(voucher);
                        }
                      }}
                      customer={customer?.id}
                    />
                  </Row>
                  <li className="mb-2">
                    Tiền hàng :{' '}
                    <span className="float-end fw-semibold">
                      <FormatCurrency value={totalMoney} />
                    </span>
                  </li>
                  {invoiceType === 'TRUC_TUYEN' && (
                    <li className="mb-2">
                      Phí vận chuyển (tạm tính):{' '}
                      <span className="float-end fw-semibold">
                        <FormatCurrency value={shippingFee} />
                      </span>
                    </li>
                  )}
                  <li className="mb-2">
                    Giảm giá:{' '}
                    <span className="float-end fw-semibold">
                      <FormatCurrency value={discountValue} />
                    </span>
                  </li>
                  {voucher !== null && (
                    <li className="mb-2">
                      <Tooltip>
                        <Alert
                          message={
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1">
                                Áp dụng thành công phiếu giảm giá <span className="fw-semibold">{voucher?.name}</span>
                                <br />
                                Giảm <span className="text-danger fw-semibold">{voucher?.discountValue} {voucher?.discountMethod}</span> đơn tối thiểu{' '}
                                <span className="text-danger fw-semibold">
                                  <FormatCurrency value={voucher?.minOrderValue} />
                                </span>
                              </div>
                              <div className="">
                                <span
                                  className="float-end text-danger"
                                  onClick={() => {
                                    setVoucher(null);
                                    setDiscountValue(0);
                                  }}
                                >
                                  <Tooltip title="Bỏ chọn phiếu giảm giá">
                                    <i className="fas fa-xmark-circle"></i>
                                  </Tooltip>
                                </span>
                              </div>
                            </div>
                          }
                          type="success"
                        />
                      </Tooltip>
                    </li>
                  )}

                  {/* Tổng tiền */}

                  <li className="mb-2">
                    Tổng tiền:
                    <span className="float-end fw-semibold text-danger">
                      <FormatCurrency value={totalMoney - discountValue + (invoiceType === 'TRUC_TUYEN' ? shippingFee : 0)} />
                    </span>
                  </li>
                          <li className="mb-2">
                            Tiền khách đưa:
                            <InputNumber
                              className="w-100 mb-2"
                              formatter={(value) => `${billPayment.totalMoney}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              controls={false}
                              min={0}
                              suffix="VNĐ"
                              placeholder="Nhập tiền khách đưa..."
                              onChange={(e) => {
                                setExtraMoney(e - totalMoney + discountValue);
                              }}
                            />
                            {totalMoney > 0 && (
                              <Alert
                                message={
                                  billPayment.totalMoney < totalMoney - discountValue ? 'Vui lòng nhập đủ tiền khách đưa!' : 'Khách đã đưa đủ tiền!'
                                }
                                type={billPayment.totalMoney < totalMoney - discountValue ? 'error' : 'success'}
                              />
                            )}
                          </li>
                  {/* Modal thanh toán */}
                  <li className="mb-2">
                    <li className="mb-2">Chọn phương thức thanh toán:</li>
                    <Row gutter={10}>

                      <PaymentModal
                        discountValue={discountValue}
                        totalMoney={totalMoney}
                        products={listOrderDetail}
                        billPayment={billPayment}
                        shipFee={shippingFee}
                        voucher={voucher}
                        props={props}
                      />

                    </Row>
                  </li>
                  <li className="mb-2">
                    <TextArea placeholder="Nhập ghi chú..." onChange={(e) => setNote(e.target.value)} />
                  </li>

                  <li>
                    <Button type="primary" className="bg-warning text-dark w-100" onClick={handleCreate}>
                      Thanh toán hóa đơn
                    </Button>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderItem;
