import React, { useState, useEffect } from 'react';
import { Col, Divider, Row, Descriptions, Badge, Typography, Button, Space, Modal, Form, Input, Select, Table, Carousel } from 'antd';
import DetailAddress from 'ui-component/extended/AddressDetail';
import ChangeInfoBill from './changeBill';
import { IconPrinter, IconTrashX } from '@tabler/icons-react';
import './bill.css';
import TextArea from 'antd/es/input/TextArea';
const { Title } = Typography;
import axios from "axios"
import FormatCurrency from 'views/utilities/FormatCurrency';
import { toast } from 'react-toastify';
import moment from 'moment';

import AddressCustomerDetail from 'components/Customer/AddressCustomerDetail';
import DetailCustomer from '../customer/DetailCustomer';
const configApi = {
  headers: {
    "Content-Type": "application/json",
    Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
    ShopId: 192796,
  },
};
//Còn đổi nhân viên và phí ship của thay đổi thông tin khách hàng 

const listStatus = [
  { id: 0, name: "Tạo hóa đơn", status: "TAO_HOA_DON" },
  { id: 1, name: "Chờ xác nhận", status: "CHO_XAC_NHAN" },
  { id: 2, name: "Xác nhận", status: "XAC_NHAN" },
  { id: 3, name: "Chờ vận chuyển", status: "CHO_VAN_CHUYEN" },
  { id: 4, name: "Vận chuyển", status: "VAN_CHUYEN" },
  { id: 5, name: "Thanh toán", status: "DA_THANH_TOAN" },
  { id: 6, name: "Thành công", status: "THANH_CONG" },
  { id: 7, name: "Đã hủy", status: "DA_HUY" },
];

const listStatusType = [
  { name: "Trực tuyến", status: "TRUC_TUYEN" },
  { name: "Tại quầy", status: "TAI_QUAY" },
]

function ChangeCustom({ props, onSuccess }) {
  const [form] = Form.useForm();

  //CALL API DIA CHIR 
  const [thanhPho, setThanhPho] = useState(null);
  const [huyen, setHuyen] = useState(null);
  const [phuong, setPhuong] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceName, setSelectedProvinceName] = useState(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState(null);
  const [selectedWardName, setSelectedWardName] = useState(null);

  // Gọi API để lấy danh sách tỉnh
  const configApi = {
    headers: {
      "Content-Type": "application/json",
      Token: "693d8a79-3a3d-11ef-8e53-0a00184fe694",
      ShopId: 192796,
    },
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          configApi
        );
        console.log('Provinces Response:', response); // Log toàn bộ response từ API
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data); // Nếu API trả về dữ liệu đúng
        } else {
          console.error('Invalid provinces data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Hàm lấy quận/huyện
  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
        configApi
      );
      if (Array.isArray(response.data.data)) {
        setDistricts(response.data.data);
      } else {
        console.error('Invalid districts data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  // Hàm lấy phường/xã
  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        configApi
      );
      if (Array.isArray(response.data.data)) {
        setWards(response.data.data);
      } else {
        console.error('Invalid wards data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  // Lấy quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    if (thanhPho !== null && thanhPho !== undefined) {
      fetchDistricts(thanhPho);
    }
  }, [thanhPho]);

  useEffect(() => {
    if (huyen !== null && huyen !== undefined) {
      fetchWards(huyen);
    }
  }, [huyen]);


  const handleProvinceChange = (provinceCode) => {
    setThanhPho(provinceCode);
    setHuyen(null);
    setPhuong(null);
    fetchDistricts(provinceCode, setDistricts);
  };

  const handleDistrictChange = (districtCode) => {
    setHuyen(districtCode);
    setPhuong(null);
    fetchWards(districtCode, setWards);
  };

  const handleWardChange = (wardCode) => {
    setPhuong(wardCode);
  };

  useEffect(() => {
    // Xử lý thành phố
    if (thanhPho && provinces.length > 0) {
      const selectedProvince = provinces.find(province => province.ProvinceID === Number(thanhPho));
      if (selectedProvince) {
        setSelectedProvinceName(selectedProvince.ProvinceName);
      }
    }

    // Xử lý huyện
    if (huyen && districts.length > 0) {
      const selectedDistrict = districts.find(district => district.DistrictID === Number(huyen));
      if (selectedDistrict) {
        setSelectedDistrictName(selectedDistrict.DistrictName);
      }
    }

    // Xử lý phường
    if (phuong && wards.length > 0) {
      const selectedWard = wards.find(ward => ward.WardCode === String(phuong));
      if (selectedWard) {
        setSelectedWardName(selectedWard.WardName);
      }
    }
  }, [thanhPho, huyen, phuong, provinces, districts, wards]);


  // State to manage visibility
  const [showChangeInfo, setShowChangeInfo] = useState(false);

  //Modal của thay đổi thông tin 
  const [isModalCustomer, setIsModalCustomer] = useState(false);

  const showModalCustomer = (isCancel) => {
    setIsModalCustomer(true);
  };

  const handleCancelCustomer = () => {
    setIsModalCustomer(false);
  };
  //Modal của thay đổi Nhân viên tiếp nhân
  const [isModalEmployee, setIsModalEmployee] = useState(false);

  const showModalEmployee = (isCancel) => {
    setIsModalEmployee(true);
  };

  const handleCancelEmployee = () => {
    setIsModalEmployee(false);
  };



  const getStatusDisplay = (invoiceStatus) => {
    const statusItem = listStatus.find(status => status.status === invoiceStatus);
    if (statusItem) {
      return (
        <>
          {statusItem.icon} <span>{statusItem.name}</span>
        </>
      );
    }
    return <span>Không xác định</span>;
  };
  const getTypeDisplay = (invoiceType) => {
    const statusItem = listStatusType.find(status => status.status === invoiceType);
    if (statusItem) {
      return (
        <>
          {statusItem.icon} <span>{statusItem.name}</span>
        </>
      );
    }
    return <span>Không xác định</span>;
  };

  const [khachHang, setKhachHang] = useState(null);
  const [diaChiCuThe, setDiaChiCuThe] = useState(null);
  const [shippingFee, setShippingFee] = useState(null);
  const [note, setNote] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [tongTien, setTongTien] = useState(0);

  //Tính phí vận chuyển  call api 
  const sizeAttributes = {
    XS: { length: 18, width: 14, height: 5 },
    S: { length: 20, width: 15, height: 5 },
    M: { length: 25, width: 20, height: 5 },
    L: { length: 30, width: 25, height: 5 },
    XL: { length: 35, width: 30, height: 5 },
    XXL: { length: 40, width: 35, height: 5 },
    XXXL: { length: 45, width: 40, height: 5 },
    XXXXL: { length: 50, width: 45, height: 5 }
  };

  const [weightTong, setWeightTong] = useState(0);
  const [lengthTong, setLengthTong] = useState(0);
  const [widthTong, setWidthTong] = useState(0);
  const [heightTong, setHeightTong] = useState(0);

  // useEffect(() => {
  //   let totalWeight = 0;
  //   let totalLength = 0;
  //   let totalWidth = 0;
  //   let totalHeight = 0;

  //   // gioHang?.listCartDetails?.forEach(item => {
  //   //   const weight = item.productDetail?.weight;
  //   //   const { length, width, height } = sizeAttributes[item.productDetail?.size.name] || {};
  //   //   if (weight) {
  //   //     totalWeight += weight * item.quantity;
  //   //     totalLength = length;
  //   //     totalWidth = width;
  //   //     totalHeight = height;
  //   //   }
  //   // });

  //   setWeightTong(totalWeight);
  //   setLengthTong(totalLength);
  //   setWidthTong(totalWidth);
  //   setHeightTong(totalHeight);
  // }, [gioHang.listCartDetails]);

  // Gọi API phí vận chuyển
  useEffect(() => {
    if (tongTien >= 1000000) {
      // Đơn hàng trên 1 triệu -> free ship
      setShippingFee(0);
    } else if (huyen) {
      // Đơn hàng dưới 1 triệu -> gọi API tính phí vận chuyển
      const data = {
        service_id: 53320, // ID dịch vụ giao hàng
        insurance_value: tongTien, // Giá trị bảo hiểm
        coupon: null, // Mã giảm giá cho phí ship nếu có
        from_district_id: 1488, // Quận gửi
        to_district_id: Number(huyen), // Quận nhận
        weight: weightTong, // Trọng lượng
        length: lengthTong, // Chiều dài
        width: widthTong, // Chiều rộng
        height: heightTong // Chiều cao
      };

      console.log('Data being sent to API:', data);

      axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", data, configApi)
        .then(response => {
          if (response.data && response.data.data) {
            setShippingFee(response.data.data.total);  // Cập nhật phí vận chuyển
          } else {
            console.error('Invalid shipping fee data:', response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching shipping fee:', error);
        });
    }
  }, [huyen, tongTien, weightTong, lengthTong, widthTong, heightTong]);


  console.log("ddddddddddddKHang dddddddd dddd", props);



  //Lấy ra thông tin khách hàng detail 
  const detail = async () => {
    if (props) {
      axios.get(`http://localhost:8080/api/bill/detail-info-customer/${props.id}`)
        .then(response => {
          setKhachHang(response.data); // Set data của khách hàng
          console.log("KHang dddddddd dddd", response.data);

          // Cập nhật các trạng thái khác
          if (response.data.address) { // Kiểm tra xem address có tồn tại không
            setThanhPho(Number(response.data.address.city));
            setHuyen(Number(response.data.address.district));
            setPhuong(response.data.address.ward);
            setDiaChiCuThe(response.data.address.detailedAddress);
          }
          setShippingFee(response.data.shippingFee);
          setNote(response.data.note);
          setFullName(response.data.fullName);
          setPhoneNumber(response.data.phoneNumber);
          setTongTien(response.data.totalMoney);
        })
        .catch(error => {
          console.error('Error fetching Khách Hàng chi tiết:', error);
        });
    }
  };

  useEffect(() => {
    detail();
  }, [props]);

  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    diaChiCuThe: '',
  });
  function validateFormDC() {
    let valid = true;
    const errorsCopy = { ...errors };

    // Validate họ tên
    if (!fullName.trim()) {
      errorsCopy.fullName = 'Họ tên không được để trống!';
      valid = false;
    } else if (fullName.length > 50) {
      errorsCopy.fullName = 'Tên không được vượt quá 50 kí tự!';
      valid = false;
    } else {
      errorsCopy.fullName = '';
    }

    // Pattern kiểm tra số điện thoại bắt đầu với số 0 và có từ 9 đến 10 chữ số
    const phonePattern = /^0[1-9]\d{8,9}$/;

    // Validate số điện thoại
    if (!phoneNumber.trim()) {
      errorsCopy.phoneNumber = 'Số điện thoại không được để trống!';
      valid = false;
    } else if (!phonePattern.test(phoneNumber)) {
      errorsCopy.phoneNumber = 'Số điện thoại không đúng định dạng!';
      valid = false;
    } else {
      errorsCopy.phoneNumber = '';
    }

    // Validate địa chỉ cụ thể
    if (!diaChiCuThe.trim()) {
      errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được để trống!';
      valid = false;
    } else if (diaChiCuThe.length > 50) {
      errorsCopy.diaChiCuThe = 'Địa chỉ cụ thể không được vượt quá 50 kí tự!';
      valid = false;
    } else {
      errorsCopy.diaChiCuThe = '';
    }

    // Cập nhật state với các lỗi
    setErrors(errorsCopy);
    return valid;
  }

  //Hàm thay đổi thông tin khác hàng 
  const idNhanVien = 2;

  const handleChangeCustomer = (data) => {
    if (validateFormDC()) {
      Modal.confirm({
        title: 'Xác nhận',
        maskClosable: true,
        content: 'Bạn có chắc chắn muốn sửa thông tin khách hàng?',
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {

          const requestData = {
            recipientName: fullName, // Lấy từ state
            recipientPhone: phoneNumber, // Lấy từ state
            detailAddress: `${diaChiCuThe}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`,
            note: note, // Lấy từ state
            shippingFee: shippingFee, // Lấy từ state
          };

          // Gửi request PUT tới server với idNV là tham số của URL
          axios.put(`/bill/change-info-customer/${props.id}?idNV=${idNhanVien}`, requestData)
            .then((response) => {
              form.resetFields(); // Reset lại form sau khi gửi
              toast.success("Thay đổi thông tin khách hàng thành công!"); // Thông báo thành công
              console.log("Khách hàng sau khi đổi", response.data);

            })
            .catch((e) => {
              toast.error(`Bạn không có quyền thay đổi thông tin khách hàng`); // Hiển thị lỗi chi tiết
            });

          setIsModalCustomer(false);
        },
      });
    }
  };

  //Hàm chuyển nhân viên
  const [nhanVien, setNhanVien] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // const search = nhanVien.filter((nhanVien) => {
  //   const isNameOrCodeMatch =
  //     nhanVien.name.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     nhanVien.code.toLowerCase().includes(searchValue.toLowerCase()) ||
  //     nhanVien.phoneNumber.toString().toLowerCase().includes(searchValue.toLowerCase());
  //   return isNameOrCodeMatch;
  // });

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1); // Đặt trang hiện tại về 1 khi thay đổi kích thước trang
  };


  useEffect(() => {
    getAllEmployee();
  }, []);

  function getAllEmployee() {
    axios.get(`/bill/get-all-employee`)
      .then((response) => {
        setNhanVien(response.data || []); // Đảm bảo dữ liệu trả về là mảng
        console.log("Nhan vien dddddddd", response.data); // Log response.data chứ không phải nhanVien
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const columns = [
    {
      title: 'STT',
      dataIndex: 'indexs',
      key: 'indexs',
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'image',
      key: 'image',
      render: (item) => (
        <>
          <Carousel autoplay autoplaySpeed={500} dots={false} arrows={false} style={{ width: '100px' }}>
            {item && item.split(',').map((image, index) => (
              <div key={index} className="" style={{ height: '100px' }}>
                <img src={image} alt="images" style={{ width: '100px', height: '110px', borderRadius: '10px' }} className="object-fit-cover" />
              </div>
            ))}

          </Carousel>
        </>
      )
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => {
        return date ? moment(date).format('DD-MM-YYYY') : ''; // Định dạng ngày sinh
      },
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <>
          <Space size="middle">
            <Button onClick={() => handleSubmitEmployee(record.id)} type="primary">
              Chọn
            </Button>
          </Space>
        </>
      )
    },
  ];
  const handleSubmitEmployee = (data) => {
    if (validateFormDC()) {
      Modal.confirm({
        title: 'Xác nhận',
        maskClosable: true,
        content: 'Bạn có chắc chắn muốn chọn nhân viên này?',
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          const requestData = {
            idHD: props.id, // Lấy từ state
          };

          // Gửi request PUT tới server với idNV là tham số của URL
          axios.put(`/bill/change-employee?idNV=${idNhanVien}`, requestData)
            .then((response) => {
              form.resetFields(); // Reset lại form sau khi gửi
              toast.success("Thay đổi nhân viên thành công!"); // Thông báo thành công
              console.log("Khách hàng sau khi đổi", response.data);

            })
            .catch((e) => {
              toast.error(`Bạn không có quyền thay đổi thông tin khách hàng`); // Hiển thị lỗi chi tiết
            });

          setIsModalEmployee(false);
        },
      });
    }
  };

  console.log("bil dddddddddddddd", props);
 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
                Mã đơn hàng: <span className="float-end text-danger">{props?.code}</span>
              </li>
              <li className="mb-2">
                Trạng thái: <span className="float-end text-danger">{getStatusDisplay(props.invoiceStatus)}</span>
              </li>
              <li className="mb-2">
                Loại đơn hàng: <span className="float-end text-danger">{getTypeDisplay(props.invoiceType)}</span>
              </li>
            </ul>
          </Col>
          <Col xl={12}>
            <ul className="list-unstyled">
              <li className="mb-2">
                Phí vận chuyển:{' '}
                <span className="float-end text-danger">{props.shippingFee ? <FormatCurrency value={props.shippingFee} /> : 'Không có'}</span>
              </li>
              <li className="mb-2">
                Giảm giá:{' '}
                <span className="float-end text-danger">{<FormatCurrency value={props.voucher} />}</span>
              </li>
              <li className="mb-2">
                Tổng tiền:{' '}
                <span className="float-end text-danger">
                  <FormatCurrency value={props.totalMoney} />
                </span>
              </li>
              <li className="mb-2">
                Phải thanh toán:{' '}
                <span className="float-end text-danger">
                  <FormatCurrency value={props.totalMoney + props.shippingFee - props.voucher} />
                </span>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      <Divider />
      <div className="customer-details-container">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <Title level={5} className="text-danger text-uppercase mb-0">Thông tin khách hàng</Title>
          </div>
          <div className='d-flex '>

            <div className='mx-2'>
              {props.invoiceStatus === "CHO_XAC_NHAN" || props.invoiceStatus === "XAC_NHAN" ||
                props.invoiceStatus === "CHO_VAN_CHUYEN" ? (
                  <>
                  <Button type="primary" onClick={showModal}>
                    Xem Chi Tiết Khách Hàng
                  </Button>
                  <Modal
                    title="Chi Tiết Khách Hàng"
                    visible={isModalOpen}
                    onCancel={closeModal}
                    footer={null} // Loại bỏ footer nếu không cần
                    width={1000}   // Tùy chỉnh kích thước modal
                  >
                    <DetailCustomer idKhachHang={props.id}/> {/* Component chi tiết khách hàng */}
                  </Modal>
                </>
              ) : null}
                     {/* <> */}
                  {/* <Button type="primary" onClick={() => showModalCustomer(true) || detail()}>Thay đổi thông tin</Button> */}
                  {/* Conditionally show the ChangeInfoBill component */}
                  {/* {showChangeInfo && ( */}
                     {/* <ChangeInfoBill bill={props} onSuccess={() => onSuccess()} /> */}
                   {/* )} */}
                {/* </> */}

            </div>

            <div>
              {props.invoiceStatus === "CHO_XAC_NHAN" || props.invoiceStatus === "XAC_NHAN" ||
                props.invoiceStatus === "CHO_VAN_CHUYEN" ? (
                <>
                  <Button style={{ backgroundColor: 'yellow' }} onClick={() => showModalEmployee(true)}>Chuyển nhân viên</Button>
                  {/* Conditionally show the ChangeInfoBill component */}
                  {showChangeInfo && (
                    <ChangeInfoBill bill={props} onSuccess={() => onSuccess()} />
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
        {/* Modal của thay đổi thông tin khách hàng   */}
        <Modal
          title={"Thay đổi hóa đơn"}
          open={isModalCustomer}
          onCancel={handleCancelCustomer}
          footer={
            <Button form="formCustomerInfo" type="primary" htmlType="submit">
              Xác nhận
            </Button>
          }
        >
          <Form
            id="formCustomerInfo"
            onFinish={handleChangeCustomer}
            form={form}
            layout="vertical"
          // Thay đổi kích thước tổng thể của form
          >
            <Form.Item
              label="Tên khách hàng"
              validateStatus={errors.fullName ? 'error' : ''}
              help={errors.fullName}
              rules={[{ required: true, message: "Tên khách hàng không được để trống!" }]}
            >
              <Input name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} placeholder="Nhập tên khách hàng" style={{ height: '32px' }} /> {/* Thay đổi chiều cao input */}

            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              validateStatus={errors.phoneNumber ? 'error' : ''}
              help={errors.phoneNumber}
              rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}
            >
              <Input value={phoneNumber}
                name="phoneNumber"
                onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Nhập số điện thoại" style={{ height: '32px' }} />
            </Form.Item>

            <Row gutter={16}>
              {/* Thành phố */}
              <Col span={8}>
                <Form.Item
                  label="Thành phố"
                  rules={[{ required: true, message: 'Thành phố không được để trống!' }]}
                >
                  <Select
                    name="thanhPho"
                    showSearch
                    placeholder="Chọn thành phố"
                    value={thanhPho || undefined}
                    onChange={handleProvinceChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Huyện */}
              <Col span={8}>
                <Form.Item
                  label="Huyện"
                  rules={[{ required: true, message: "Huyện không được để trống!" }]}
                >
                  <Select
                    name="huyen"
                    showSearch
                    placeholder="Chọn huyện"
                    value={huyen || undefined}
                    onChange={handleDistrictChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {districts.map((district) => (
                      <Select.Option key={district.DistrictID} value={district.DistrictID}>
                        {district.DistrictName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Phường */}
              <Col span={8}>
                <Form.Item
                  label="Phường"
                  rules={[{ required: true, message: "Phường không được để trống!" }]}
                >
                  <Select
                    name="phuong"
                    showSearch
                    placeholder="Chọn phường"
                    value={phuong || undefined}
                    onChange={handleWardChange}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {wards.map((ward) => (
                      <Select.Option key={ward.WardCode} value={ward.WardCode}>
                        {ward.WardName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Địa chỉ cụ thể"
              validateStatus={errors.diaChiCuThe ? 'error' : ''}
              help={errors.diaChiCuThe}
              rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
            >
              <Input name="diaChiCuThe"
                value={diaChiCuThe}
                onChange={(e) => setDiaChiCuThe(e.target.value)} placeholder="Nhập địa chỉ cụ thể" style={{ height: '32px' }} />
            </Form.Item>


            <Form.Item label="Phí vận chuyển">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  name="shippingFee"
                  value={shippingFee === 0 ? "Miễn phí vận chuyển" : FormatCurrency({ value: shippingFee })} // Gọi hàm và truyền giá trị
                  onChange={(e) => setShippingFee(e.target.value)} // Lưu giá trị số trong state
                  disabled
                  style={{ height: '32px' }}
                />
              </div>
            </Form.Item>


            <Form.Item
              name="note"
              label="Ghi chú"
            >
              <TextArea name="note"
                value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập mô tả" rows={2} style={{ height: '50px' }} /> {/* Giảm chiều cao TextArea */}
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal của thay đổi nhân viên  */}
        <Modal
          title={
            "Chuyển nhân viên tiếp nhận"
          }
          open={isModalEmployee}
          style={{ width: '1', top: '100px', left: '80px' }}

          onCancel={handleCancelEmployee}
          width="900px" // Thay đổi kích thước modal tại đây

          footer={
            <Button form="formNote" type="primary" htmlType="submit">
              Xác nhận
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={nhanVien}
            pagination={{
              pageSize: pageSize,
              current: currentPage,
              pageSizeOptions: [5, 10, 20, 50, 100],
              onChange: handleChangePage,
              showSizeChanger: true,
              onShowSizeChange: handlePageSizeChange,
            }}
            rowKey="id" // Đảm bảo có khóa duy nhất cho mỗi dòng
          />
        </Modal>

        <ul className="list-unstyled fw-semibold">
          <Row gutter={12}>
            <Col xl={12}>
              <li className="mb-2">Tên khách hàng: <span className="float-end text-danger">{props.recipientName === null ? "Khách hàng lẻ" : props.recipientName}</span></li>
              <li className="mb-2">Số điện thoại: <span className="float-end text-danger">{props.recipientPhone === null ? "Không có" : props.recipientPhone}</span></li>
            </Col>
            <Col xl={12}>
              <li className="mb-2">Email: <span className="float-end text-danger">{props.recipientEmail === null | props.recipientEmail === undefined ? "Không có" : props.recipientEmail}</span></li>
              <li className="mb-2">Địa chỉ: <span className="float-end text-danger text-end" style={{ width: "24rem" }}>{props.address !== null ? (
                <>
                  {props.address?.split("##")[0]} ,
                  {/* <DetailAddress war={props.huyen?.split("##")[1]}
                    distr={props.thanhPho?.split("##")[2]}
                    prov={props.phuong?.split("##")[3]} /> */}
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
