import { Alert, Button, Carousel, Col, Divider, Empty, Form, Input, InputNumber, Modal, Row, Switch, Table, Tooltip, message } from 'antd';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QrCodeScanner from 'components/QrCode';
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
import { IconPhotoStar, IconTrashFilled, IconX, IconScan } from '@tabler/icons-react';
import PaymentModal from 'views/pages/bill/Payment.jsx';
import { useReactToPrint } from 'react-to-print';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { DisabledByDefault } from '@mui/icons-material';

function OrderItem({ index, props, onSuccess, onQrScanSuccess }) {
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
  const [waitPay, setWaitPay] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('THANH_TOAN'); // Hình thức thanh toán
  const [extraMoney, setExtraMoney] = useState(null); // tiền thừa
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formRef = React.useRef(null);

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
  }, []);

  useEffect(() => {
    loadListOrderDetail();
  }, [props, currentPage, pageSize]);

  // const [isModalVisible1, setIsModalVisible1] = useState(false); // Kiểm soát hiển thị modal
  // const [quantity, setQuantity] = useState(1); // Giá trị số lượng nhập
  // const [selectedValue, setSelectedValue] = useState(null); // Lưu giá trị mã QR hoặc detailCode

  // Khi quét QR hoặc chọn mã
  const [isModalVisible1, setIsModalVisible1] = useState(false); // Kiểm soát hiển thị modal
  const [quantity, setQuantity] = useState(1); // Giá trị số lượng nhập
  const [selectedValue, setSelectedValue] = useState(null); // Lưu giá trị mã QR hoặc detailCode

  // Khi quét QR hoặc chọn mã
  const handleQRCodeScan = (value) => {
    setSelectedValue(value);
    setIsModalVisible1(true);
    console.log('QR Code Scanned:', value);
  };

  // Gửi request sau khi nhập số lượng
  const handleModalOk = () => {
    request
      .post('/bill-detail', {
        idBill: props.id,
        detailCode: selectedValue,
        quantity: quantity // Gửi số lượng người dùng đã nhập
      })
      .then(() => {
        message.success('Thêm thành công!');
        setIsModalVisible1(false); // Đóng modal sau khi thêm thành công
        setQuantity(1); // Reset lại số lượng
        setSelectedValue(null); // Reset giá trị mã
        loadListOrderDetail(); // Load lại danh sách nếu cần
      })
      .catch((e) => {
        console.log(e);
        message.error('Thêm thất bại!');
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible1(false); // Đóng modal nếu người dùng hủy
    setQuantity(1); // Reset lại số lượng
    setSelectedValue(null); // Reset giá trị mã
  };

  // const generatePDF = useReactToPrint({
  //   content: () => document.getElementById("pdfContent"),
  //   documentTitle: "Userdata",
  //   onAfterPrint: () => {},
  // });
  // const getHtmlByIdBill2 = (id, totalExcessMoney) => {
  //   request.get(`/bill/invoice-pdf/${id}/${totalExcessMoney}`).then((res) => {
  //     document.getElementById("pdfContent").innerHTML = res.data.data;
  //     generatePDF();
  //   });
  // };

  const pdfRef = useRef(null);

  // Cấu hình in với useReactToPrint
  const generatePDF = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: 'Invoice',
    onAfterPrint: () => {
      console.log('PDF đã được in xong');
    }
  });

  // Hàm gọi API để lấy nội dung HTML và in
  const getHtmlByIdBill2 = async (id, totalExcessMoney) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bill/invoice-pdf/${id}/${totalExcessMoney}`);
      if (pdfRef.current) {
        // Cập nhật nội dung HTML vào pdfRef
        pdfRef.current.innerHTML = response.data.data;
        setTimeout(() => {
          generatePDF(); // Gọi hàm in sau khi cập nhật nội dung
        }, 0);
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
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
          return total + item.quantity * item.priceHDCT;
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

  useEffect(() => {
    onSuccess();
    if (props.customer?.id) {
      getCustomer(props.customer.id);
    }
  }, [props.customer?.id]); // Theo dõi sự thay đổi của customer.id để gọi lại getCustomer

  const handleSelectCustomer = (value) => {
    getCustomer(value.id);
  };

  const getCustomer = async (customerId) => {
    try {
      // Gọi API để lấy dữ liệu khách hàng
      const customerData = await request.get(`/customer/${customerId}`);
      setCustomer(customerData);

      // Gọi API để lấy địa chỉ mặc định
      const dataAddress = await request.get(`/address/default/${customerId}`);
      setListAddress(dataAddress);
      setAutoFillAddress(dataAddress);

      console.log('Danh sách địa chỉ:', dataAddress.content || []);
      console.log('Danh sách địa chỉ:', dataAddress);

      // Gọi onSuccess sau khi dữ liệu đã cập nhật
      onSuccess();
    } catch (error) {
      console.error('Lỗi khi tải thông tin khách hàng:', error);
    }
  };

  const addCustomer = (value) => {
    request
      .put('/bill/change-info-customer/' + idBill.id, value, {})
      .then((response) => {})
      .catch((error) => {
        console.error('Error fetching customer data:', error);
      });
  };

  // Hàm này dùng để xóa khách hàng
  const handleDeleteCustomer = () => {
    setCustomer(null);
    addCustomer(null);
    setAutoFillAddress([]);
    setInvoiceType('CHO_THANH_TOAN');
    onSuccess(); // Gọi onSuccess sau khi trạng thái được làm trống
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
          service_type_id: 2,
          insurance_value: '',
          from_district_id: 3290,
          to_district_id: parseInt(autoFillAddress.district), // ID của quận/huyện nhận hàng
          to_ward_code: autoFillAddress.ward,
          height: 50,
          length: 20,
          weight: 300,
          width: 20,
          cod_failed_amount: 2000,
          insurance_value: 10000,
          coupon: null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694', //693d8a79-3a3d-11ef-8e53-0a00184fe694
            ShopId: '192796' //192796
          }
        }
      )
      .then((response) => {
        setShippingFee(response.data.data.total);
        console.log('Phi van chuyen', shippingFee);
      })
      .catch((e) => {
        console.log('Bug nè hiih :', e);
      });
  };

  // const addressFull = (provinceId, toDistrictId, wardCode) => {
  //   if (totalBill < 2000000) {
  //     AddressApi.fetchAllMoneyShip(toDistrictId, wardCode).then((res) => {
  //       setShipFee(res.data.data.total);
  //     });
  //   } else {
  //     setShipFee(0);
  //   }
  //   AddressApi.fetchAllDayShip(toDistrictId, wardCode).then((res) => {
  //     const leadtimeInSeconds = res.data.data.leadtime;
  //     const formattedDate = moment.unix(leadtimeInSeconds).format("DD/MM/YYYY");
  //     setDayShip(formattedDate);
  //   });
  //   AddressApi.fetchAllProvinceDistricts(provinceId).then((res) => {
  //     setListDistricts(res.data.data);
  //   });
  //   AddressApi.fetchAllProvinceWard(toDistrictId).then((res) => {
  //     setListWard(res.data.data);
  //   });
  // };

  useEffect(() => {
    if (voucher !== null) {
      if (totalMoney < voucher?.minOrderValue) {
        message.error('Không thể áp dụng phiếu giảm giá do không đủ điều kiện!');
        setVoucher(null);
        setDiscountValue(0);
      } else if (voucher?.maxDiscountValue !== null && totalMoney > voucher?.maxDiscountValue) {
        message.error('Không thể áp dụng phiếu giảm giá do tổng tiền vượt quá giới hạn!');
        setVoucher(null);
        setDiscountValue(0);
      } else {
        if (voucher.discountMethod === 'PHAN_TRAM') {
          setDiscountValue((totalMoney / 100) * voucher?.discountValue);
        } else {
          setDiscountValue(voucher?.discountValue);
        }
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
        message.success('Cập nhật số lượng thành công!'); // Thêm thông báo thành công
      })
      .catch((e) => {
        console.log(e.response.data.message);
        // toast.error(e.response.data.message);
        message.error(e.response.data.message);
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
            message.success('Xóa thành công!');
            loadListOrderDetail();
          })
          .catch((e) => {
            console.log(e);
            message.error(e.response.data);
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
                Đơn giá <FormatCurrency value={record.priceHDCT} />
              </span>
            )}
            {record.priceHDCT && record.price && record.priceHDCT !== record.price ? (
              <h6>
                Đơn giá được cập nhật từ giá cũ{' '}
                <span className="text-decoration-line-through text-muted">
                  <FormatCurrency value={record.priceHDCT} />
                </span>{' '}
                thành giá mới{' '}
                <span className="text-danger fw-bold">
                  <FormatCurrency value={record.price} />
                </span>
              </h6>
            ) : null}
          </div>
        </div>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px' // Tạo khoảng cách giữa các nút và input
          }}
        >
          <button
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: record.price !== record.priceHDCT || quantity <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              color: record.price !== record.priceHDCT || quantity <= 1 ? '#ccc' : '#000'
            }}
            onClick={() => {
              const newValue = quantity - 1;
              if (record.price === record.priceHDCT) {
                // Chỉ cho phép cập nhật khi giá không thay đổi
                if (newValue >= 1) {
                  handleChangeQuantity(record, newValue);
                }
              } else {
                alert('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
            disabled={record.price !== record.priceHDCT || quantity <= 1} // Vô hiệu hóa nút nếu giá thay đổi hoặc số lượng <= 1
          >
            -
          </button>

          <InputNumber
            className="text-center"
            value={quantity}
            style={{
              width: '64px',
              textAlign: 'center',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: record.price !== record.priceHDCT ? '#f5f5f5' : '#fff',
              color: record.price !== record.priceHDCT ? '#aaa' : '#000',
              cursor: record.price !== record.priceHDCT ? 'not-allowed' : 'text'
            }}
            min={1}
            inputMode="numeric"
            disabled={record.price !== record.priceHDCT} // Vô hiệu hóa input nếu giá thay đổi
            onPressEnter={(e) => {
              const value = Number(e.target.value);
              if (record.price === record.priceHDCT) {
                if (!isNaN(value) && value > 0) {
                  handleChangeQuantity(record, value);
                } else {
                  message.error('Vui lòng chỉ nhập số và phải lớn hơn hoặc bằng 1!');
                }
              } else {
                message.warning('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (record.price === record.priceHDCT) {
                if (!isNaN(value) && value > 0) {
                  handleChangeQuantity(record, value);
                } else {
                  message.error('Vui lòng chỉ nhập số và phải lớn hơn hoặc bằng 1!');
                }
              } else {
                message.warning('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
          />

          <button
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: record.price !== record.priceHDCT ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              color: record.price !== record.priceHDCT ? '#ccc' : '#000'
            }}
            onClick={() => {
              if (record.price === record.priceHDCT) {
                handleChangeQuantity(record, quantity + 1);
              } else {
                alert('Không thể thay đổi số lượng vì giá đã thay đổi!');
              }
            }}
            disabled={record.price !== record.priceHDCT} // Nút bị vô hiệu hóa nếu giá thay đổi
          >
            +
          </button>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'quantity',
      key: 'total',
      render: (quantity, record) => (
        <div className="text-danger fw-bold">
          <FormatCurrency value={(record.discountPrice || record.priceHDCT) * quantity} />
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

  const [billPayment, setBillPayment] = useState([]);

  const loadBillHistory = () => {
    axios
      .get(`http://localhost:8080/api/payment/${props.id}`)
      .then((response) => {
        console.log('Data received from API1:', response);
        console.log('Data received from API2:', response.data);
        console.log('Data received from API3:', response.data.data);
        console.log('Data received from API4:', response.data.totalMoney);
        console.log('ID passed to API call:', props.id);
        setBillPayment(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    loadBillHistory(); // Tính tổng tiền cần thanh toán
  }, []);

  const totalBillAmount = billPayment.reduce((sum, payment) => sum + payment.totalMoney, 0);
  const totalBill = totalMoney - discountValue + (invoiceType === 'GIAO_HANG' ? shippingFee : 0);

  // Tạo đơn hàng
  const handleCreate = async () => {
    const data = {};
    data.voucherId = voucher !== null ? voucher.id : null;
    data.typeVoucher = voucher !== null ? voucher.type : null;
    data.customerId = customer !== null ? customer.id : null;
    data.invoiceType = invoiceType;
    data.recipientName = invoiceType === 'TAI_QUAY' ? (customer !== null ? customer?.fullName : 'Khách hàng lẻ') : autoFillAddress.fullName;
    data.totalMoney = totalMoney;
    data.discountAmount = discountValue !== null ? discountValue : 0;
    data.note = note;
    data.paymentStatus = invoiceType === 'GIAO_HANG' ? 'TRA_SAU' : 'THANH_TOAN';
    data.tienMat = tienMat;
    data.tienChuyenKhoan = tienChuyenKhoan;
    data.recipientEmail = customer !== null ? customer.email : null;

    data.recipientPhone = autoFillAddress.phoneNumber;
    data.address =
      invoiceType === 'TAI_QUAY'
        ? null
        : `${autoFillAddress.detailedAddress}##${autoFillAddress.ward}##${autoFillAddress.district}##${autoFillAddress.city}`;
    data.shippingFee = invoiceType === 'GIAO_HANG' ? shippingFee : 0;
    data.choThanhToan = invoiceType === 'GIAO_HANG' ? true : false;
    data.waitPay = waitPay;
    if (listOrderDetail.length === 0) {
      message.error('Hãy thêm gì đó vào giỏ hàng!');
    } else {
      // if (invoiceType === 'TAI_QUAY' && !choThanhToan) {
      //   if (tienKhachDua <= 0 || tienKhachDua === null) {
      //     toast.error('Vui lòng nhập đủ tiền khách đưa!');
      //     console.log(data);
      //     return;
      //   }
      // }
      if (invoiceType === 'TAI_QUAY' && !waitPay) {
        if (totalBillAmount < totalBill || totalBillAmount === null) {
          message.error('Vui lòng thanh toán đủ tiền khách đưa!');
          console.log(totalBillAmount);
          console.log(totalMoney);
          console.log(data);
          return;
        }
      }
      console.log(' vip Ninh Hiiiiiiiiiiiiiiiiii', data);

      Modal.confirm({
        title: 'Xác nhận',
        maskClosable: true,
        content: `Xác nhận ${waitPay ? 'chuyển đơn hàng sang trạng thái chờ thanh toán' : 'tạo hóa đơn'} ?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          console.log('Hiiiiiiiiiiiiiiiiii', data);
          request
            .put(`/bill/${props.id}`, data)
            .then((response) => {
              getHtmlByIdBill2(props.code, totalBillAmount);
              console.log('Hiiiiiiiiiiiiiiiiii', data);
              message.success('Tạo đơn hàng thành công!');
              setTimeout(() => {
                navigate('/bill');
              }, 5000);
            })
            .catch((e) => {
              console.log('lỗi cái gì đây', e);
              message.error(e.response.data.message);
              console.log('Hiiiiiiiiiiiiiiiiii', data);
            });
        }
      });
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal

  // Mở modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({ shippingFee }); // Đặt giá trị hiện tại vào form
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.setFieldsValue({ shippingFee }); // Đặt giá trị hiện tại vào form
  };

  // Xử lý khi người dùng nhấn "Lưu"
  const handleSaveShippingFee = (values) => {
    const { shippingFee: newShippingFee } = values;
    const parsedValue = parseFloat(newShippingFee);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setShippingFee(parsedValue); // Cập nhật phí vận chuyển
      setIsModalOpen(false); // Đóng modal
      form.setFieldsValue({ shippingFee }); // Đặt giá trị hiện tại vào form
    } else {
      alert('Vui lòng nhập một giá trị hợp lệ!');
    }
  };
  return (
    <>
      <div>
        {/* <div ref={componentRef}> */}
        <div>
          {/* <ToastContainer /> */}
          <Modal title="Nhập số lượng" visible={isModalVisible1} onOk={handleModalOk} onCancel={handleModalCancel}>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))} // Cập nhật giá trị số lượng
              min={1} // Không cho phép nhập nhỏ hơn 1
            />
          </Modal>
          <div className="d-flex">
            <div className="flex-grow-1">
              <Title level={5}>Đơn hàng {props.code}</Title>
            </div>
            {(billPayment.totalMoney != null ? billPayment.totalMoney : 0) <
              (totalMoney - discountValue ? totalMoney - discountValue : 1) && (
              <>
                <div className="me-1">
                  <ShowProductModal
                    idBill={props}
                    onClose={() => {
                      onSuccess();
                    }}
                  />
                </div>
                <QrCodeScanner title="Quét QR" onQrSuccess={handleQRCodeScan} />
              </>
            )}
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
                <CustomerOrder
                  idBill={props}
                  handleSelect={handleSelectCustomer}
                  onClosed={() => {
                    onSuccess();
                  }}
                />
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
                        Email: <span className="ms-3 fw-semibold">{customer?.email}</span>
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
                        Ngày sinh:{' '}
                        <span className="ms-3 fw-semibold">
                          <FormatTime date={customer?.dateOfBirth} />
                        </span>
                      </li>
                      <li className="mb-2">
                        Số điện thoại: <span className="ms-3 fw-semibold">{customer?.phoneNumber}</span>
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
            </div>

            {/* Thông tin khách hàng */}

            <Divider className="m-0 mb-3" />
            <Row gutter={10}>
              <Col xl={14}>
                <div className="text-end">
                  {customer !== null && invoiceType === 'GIAO_HANG' && (
                    <AddressOrders
                      customer={customer.id}
                      onClosse={() => {
                        onSuccess();
                        getCustomer(customer.id);
                      }}
                    />
                  )}
                </div>
                {invoiceType !== 'GIAO_HANG' ? (
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
                  <li className="mb-2 text-end">
                    {customer !== null && (
                      <>
                        <Switch
                          onChange={(value) => {
                            setInvoiceType(value ? 'GIAO_HANG' : 'TAI_QUAY');
                          }}
                        />{' '}
                        Giao hàng
                      </>
                    )}
                  </li>
                  <Row gutter={20}>
                    <VoucherOrder
                      products={listOrderDetail}
                      onSelectVoucher={(voucher) => {
                        if (voucher.quantity <= 0) {
                          message.error('Phiếu giảm giá này đã hết lượt sử dụng!');
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
                  {invoiceType === 'GIAO_HANG' && (
                    <li className="mb-2">
                      Phí vận chuyển (tạm tính):{' '}
                      <span className="float-end fw-semibold">
                        <FormatCurrency value={shippingFee} />
                        {
                          <Button type="link" className="ms-2" onClick={handleOpenModal}>
                            +
                          </Button>
                        }
                        <Modal
                          title="Cập nhật phí vận chuyển"
                          open={isModalOpen}
                          onCancel={handleCloseModal}
                          footer={
                            <Button form="shippingFeeForm" type="primary" htmlType="submit">
                              Lưu
                            </Button>
                          }
                        >
                          <Form id="shippingFeeForm" form={form} onFinish={handleSaveShippingFee} layout="vertical">
                            <Form.Item
                              name="shippingFee"
                              label="Phí vận chuyển"
                              rules={[
                                { required: true, message: 'Vui lòng nhập phí vận chuyển!' },
                                {
                                  type: 'number',
                                  min: 0,
                                  message: 'Phí vận chuyển phải lớn hơn hoặc bằng 0!',
                                  transform: (value) => parseFloat(value)
                                }
                              ]}
                            >
                              <Input type="number" placeholder="Nhập phí vận chuyển" />
                            </Form.Item>
                          </Form>
                        </Modal>
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
                                Giảm{' '}
                                <span className="text-danger fw-semibold">
                                  {voucher?.discountValue} {voucher?.discountMethod == 'PHAN_TRAM' ? '%' : 'vnd'}
                                </span>{' '}
                                đơn tối thiểu{' '}
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
                      <FormatCurrency value={totalBill} />
                    </span>
                  </li>
                  <li className="mb-3">
                    Khách thanh toán:
                    {totalBillAmount < totalMoney - discountValue + shippingFee && (
                      <>
                        <PaymentModal
                          discountValue={discountValue}
                          totalMoney={totalMoney}
                          billPayment={billPayment}
                          shipFee={invoiceType === 'GIAO_HANG' ? shippingFee : 0}
                          voucher={voucher}
                          props={props}
                          onClose={() => {
                            loadListOrderDetail();
                            loadBillHistory();
                          }}
                        />
                      </>
                    )}
                    <span className="float-end fw-semibold text-danger">
                      <FormatCurrency value={totalBillAmount} />
                    </span>
                  </li>
                  {/* Đặt `onChange` cho InputNumber của "Tiền khách đưa" */}
                  <li className="mb-2">
                    {totalMoney - totalBillAmount >= 0 ? 'Tiền thiếu:' : 'Tiền thừa:'}
                    <span className="float-end fw-semibold text-danger">
                      <FormatCurrency
                        value={Math.abs(totalMoney - discountValue + (invoiceType === 'GIAO_HANG' ? shippingFee : 0) - totalBillAmount)}
                      />
                    </span>
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
        {/* <div > */}
        <div style={{ display: 'none' }}>
          <div ref={pdfRef} />
          {/* <div id="pdfContent"/> */}
        </div>
      </div>
    </>
  );
}

export default OrderItem;
