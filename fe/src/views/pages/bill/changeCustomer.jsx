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
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();

  //CALL API DIA CHIR 
  const [thanhPho, setThanhPho] = useState(null);
  const [huyen, setHuyen] = useState(null);
  const [phuong, setPhuong] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // State to manage visibility
  const [showChangeInfo, setShowChangeInfo] = useState(false);

  const [diaChiCuThe, setDiaChiCuThe] = useState(null);
  const [shippingFee, setShippingFee] = useState(null);
  const [note, setNote] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [tongTien, setTongTien] = useState(0);

  const [shippingFeeNew, setShippingFeeNew] = useState(null);
  const [weightTong, setWeightTong] = useState(0);

  const [hoaDon, setHoaDon] = useState();
  const [hoaDonDetail, setHoaDonDetail] = useState([]);



  useEffect(() => {
    let totalWeight = 0;

    hoaDon?.billDetails?.forEach(item => {
      const weight = item.productDetail?.weight;
      if (weight) {
        totalWeight += weight * item.quantity;
      }
    });

    setWeightTong(totalWeight);
  }, [hoaDon?.billDetails]);

  console.log("ddddddddddddddddddddddddwwwwwwwwwwwwwwwwwwwww", props)

  useEffect(() => {
    const fetchShippingFee = async () => {
      try {
        if (tongTien >= 2000000) {
          // Đơn hàng trên 1 triệu -> free ship
          setShippingFee(0);
          return;
        }

        if (!huyen || !phuong) {
          console.warn("Huyện hoặc phường không được xác định");
          return;
        }

        // Dữ liệu gửi đến API
        const data = {
          service_type_id: 2,
          from_district_id: 1485, // ID quận/huyện gửi hàng
          to_district_id: Number(huyen), // ID quận/huyện nhận hàng
          to_ward_code: phuong, // Mã phường/xã nhận hàng
          height: 50, // Chiều cao gói hàng (cm)
          length: 20, // Chiều dài gói hàng (cm)
          weight: weightTong, // Cân nặng gói hàng (gram)
          width: 20, // Chiều rộng gói hàng (cm)
          cod_failed_amount: 2000, // Tiền COD nếu giao thất bại
          insurance_value: 10000, // Giá trị bảo hiểm hàng hóa
          coupon: null // Mã giảm giá (nếu có)
        };

        console.log('Data being sent to API:', data);

        // Gửi request đến API GHN
        const response = await axios.post(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',
              ShopId: '192796'
            }
          }
        );

        // Cập nhật phí vận chuyển từ response
        console.log("Phí vận chuyển chi tiết:");
        console.log("Phí dịch vụ:", response.data.data.service_fee);
        console.log("Tổng phí vận chuyển:", response.data.data.total);
        setShippingFee(response.data.data.total);

      } catch (error) {
        // setShippingFee(0);

        console.error("Lỗi khi gọi API phí vận chuyển:", error);
      }
    };

    fetchShippingFee();
  }, [huyen, tongTien, weightTong, phuong]);

  //Modal của địa chir 
  const [isModalAdress, setIsModalAdress] = useState(false);

  const showModalAdress = (isCancel) => {
    setIsModalAdress(true);
  };

  const handleCancelAdress = () => {
    setIsModalAdress(false);
  };
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

  useEffect(() => {
    const selectedProvinceId = thanhPho;
    const selectedDistrictsId = huyen;
    if (selectedProvinceId) {
      fetchDistricts(selectedProvinceId, (data) => {
        setDistricts(data);
      });
      fetchWards(selectedDistrictsId, (data) => {
        setWards(data);
      });
    }
  }, [thanhPho]);

  const handleProvinceChange = (provinceCode) => {
    setThanhPho(provinceCode);
    setHuyen(null);
    setPhuong(null);
    setSelectedDistrict(null)
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

  // const detailKH = async () => {
  //   try {
  //     const response = await detailKH(props.id);
  //     setKhachHang(response.data);
  //     if (response.data.listAddress && response.data.listAddress.length > 0) {
  //       const diaChiMacDinh = response.data.listAddress.find(diaChi => diaChi.defaultAddress === true);
  //       console.log("Dia chi mac dinh ddddddddd!", diaChiMacDinh);
  //       if (diaChiMacDinh) {
  //         setThanhPho(diaChiMacDinh.city)
  //         setPhuong(diaChiMacDinh.ward)
  //         setHuyen(diaChiMacDinh.district)

  //         setDiaChiCuThe(diaChiMacDinh.detailedAddress)
  //         setHoTen(diaChiMacDinh.fullName)
  //         setSoDienThoai(diaChiMacDinh.phoneNumber)
  //       } else {
  //         console.log("Không có địa chỉ mặc định nào!");
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching Khách Hàng chi tiết:', error);
  //   }
  // };

  // useEffect(() => {
  //   detailKH();
  // }, [props]);

  useEffect(() => {
    console.log("thanhPho state: ", thanhPho);
    console.log("huyen state: ", huyen);
    console.log("phuong state: ", phuong);
    console.log("provinces list: ", provinces);
    console.log("districts list: ", districts);
    console.log("wards list: ", wards);

    // Xử lý thành phố
    if (thanhPho && provinces.length > 0) {
      const selectedProvince = provinces.find(province => province.ProvinceID === Number(thanhPho));
      if (selectedProvince) {
        setSelectedProvince(selectedProvince.ProvinceName);
      }
    }

    // Xử lý huyện
    if (huyen && districts.length > 0) {
      const selectedDistrict = districts.find(district => district.DistrictID === Number(huyen));
      if (selectedDistrict) {
        setSelectedDistrict(selectedDistrict.DistrictName);
      }
    }

    // Xử lý phường
    if (phuong && wards.length > 0) {
      const selectedWard = wards.find(ward => ward.WardCode === String(phuong));
      if (selectedWard) {
        setSelectedWard(selectedWard.WardName);
      }
    }
  }, [thanhPho, huyen, phuong, provinces, districts, wards]);


  // // //Lấy ra thông tin khách hàng detail 
  // const detail = async () => {
  //   if (props) {
  //     axios.get(`http://localhost:8080/api/bill/detail-info-customer/${props.id}`)
  //       .then(response => {
  //         setKhachHang(response.data); // Set data của khách hàng
  //         console.log("KHang dddddddd dddd MMMMMMMMMMMM", props);

  //         // Cập nhật các trạng thái khác
  //         if (response.data.address) { // Kiểm tra xem address có tồn tại không
  //           setThanhPho(Number(response.data.address.city));
  //           setHuyen(Number(response.data.address.district));
  //           setPhuong(response.data.address.ward);
  //           setDiaChiCuThe(response.data.address.detailedAddress);
  //         }
  //         setShippingFee(response.data.shippingFee);
  //         setNote(response.data.note);
  //         setFullName(response.data.fullName);
  //         setPhoneNumber(response.data.phoneNumber);
  //         setTongTien(response.data.totalMoney);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching Khách Hàng chi tiết:', error);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   detail();
  // }, [props]);

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
  // const idNhanVien = 2;
  const token = localStorage.getItem('token');
  // Lấy dữ liệu từ localStorage
  const idNhanVien = localStorage.getItem('employeeId');

  const tienTra = shippingFee - props.shippingFee > 0 ? shippingFee - props.shippingFee : props.shippingFee - shippingFee;
  console.log('tien tra của đại ca Ninh', tienTra);

  const createPayment = (product) => {
    const newPayment = {
      bill: id,
      employee: idNhanVien,
      method: 'CHUYEN_KHOAN',
      totalMoney: tienTra,
      status: "HOAN_TRA",
      transactionNo: null,

    };
    request
      .post(`/payment`, newPayment
      )
      .then((response) => {
      })
      .catch((e) => {
        console.log(e);
        message.error(e.response.data);
      });
  };

  function validateFormCreteDC() {
    let valid = true;
    const errorsCopy = { ...errors };

    // Validate họ tên
    if (!hoTen.trim()) {
      errorsCopy.hoTen = 'Họ tên không được để trống!';
      valid = false;
    } else if (hoTen.length > 50) {
      errorsCopy.hoTen = 'Tên không được vượt quá 50 kí tự!';
      valid = false;
    } else {
      errorsCopy.hoTen = '';
    }

    // Pattern kiểm tra số điện thoại bắt đầu với số 0 và có từ 9 đến 10 chữ số
    const phonePattern = /^0[1-9]\d{8,9}$/;

    // Validate số điện thoại
    if (!soDienThoai.trim()) {
      errorsCopy.soDienThoai = 'Số điện thoại không được để trống!';
      valid = false;
    } else if (!phonePattern.test(soDienThoai)) {
      errorsCopy.soDienThoai = 'Số điện thoại không đúng định dạng!';
      valid = false;
    } else {
      errorsCopy.soDienThoai = '';
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

  const updateDiaChi = () => {
    if (validateFormCreteDC()) {
      Modal.confirm({
        title: 'Xác nhận',
        maskClosable: true,
        content: 'Bạn có chắc chắn muốn thêm địa chỉ này?',
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {

          const diaCHi = {
            id: props.id,
            recipientName: hoTen,
            recipientPhone: soDienThoai,
            shippingFee: 36500,
            detailAddress: `${diaChiCuThe}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
          };

          console.log("Shipingffffffffffffff", shippingFee)

          axios
            .post(`http://localhost:8080/api/tra-cuu/update-address`, diaCHi) // Thêm `diaCHi` làm body
            .then((response) => {
              toast.success("Thay đổi địa chỉ thành công!");
              if (onSuccess) {
                onSuccess(); // Gọi callback để báo thành công
              }
              setIsModalAdress(false)
            })
            .catch((error) => {
              console.error(
                'Sai:',
                error.response?.data || error.message
              ); // Log lỗi nếu có
            });
        },
      });
    } else {
      toast.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  return (
    <>

      <div
        style={{
          background: 'linear-gradient(to bottom right, #f9f9f9, #e0f7fa)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', textTransform: 'uppercase' }}>
            Chi Tiết Đơn Hàng
          </h2>
        </div>

        {/* Thông tin đơn hàng */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {[
            { label: 'Mã đơn hàng', value: props?.code },
            { label: 'Phí vận chuyển', value: FormatCurrency({ value: props.shippingFee }) },
            {
              label: 'Giảm giá', value: props.voucher
                ? `${props.voucher.discountValue || 0} ${props.voucher.discountMethod == 'PHAN_TRAM' ? '%' : 'đ' || 'đ'}`
                : 'Không có giảm giá'
            },
            { label: 'Tổng tiền', value: FormatCurrency({ value: props.totalMoney }) },

          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: '#fff',
                padding: '16px',
                borderRadius: '8px',
                flex: '1',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 style={{ fontSize: '1rem', color: '#555', marginBottom: '8px' }}>{item.label}</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className='mx-2 text-end'>
          {props.invoiceStatus === "CHO_XAC_NHAN" || props.invoiceStatus === "XAC_NHAN" ||
            props.invoiceStatus === "CHO_VAN_CHUYEN" ? (
            <>
              <Button type="primary" onClick={() => showModalAdress(true)}>Thay đổi thông tin</Button>
              {/* Conditionally show the ChangeInfoBill component */}
              {showChangeInfo && (
                <ChangeInfoBill bill={props} onSuccess={() => onSuccess()} />
              )}
            </>
          ) : null}
        </div>

        {/* Thông tin khách hàng */}
        <div style={{ marginBottom: '40px' }}>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
            Thông Tin Khách Hàng
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {[
              { label: 'Tên Khách Hàng', value: props.recipientName || 'Khách hàng lẻ' },
              { label: 'Số Điện Thoại', value: props.recipientPhone || 'Không có' },
              { label: 'Email', value: props.recipientEmail || 'Không có' },
              { label: 'Địa Chỉ', value: props.address || 'Tại cửa hàng' },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: '#fff',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h4 style={{ fontSize: '1rem', color: '#777', marginBottom: '8px' }}>{item.label}</h4>
                <p style={{ fontSize: '1.1rem', color: '#333' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Divider />

      {/* Modal của thay đổi địa chỉ  */}
      <Modal
        title={
          "Thông tin địa chỉ"
        }
        open={isModalAdress}
        onCancel={handleCancelAdress}
        footer={[
          <Button key="cancel" onClick={handleCancelAdress}>
            Hủy
          </Button>,
          <Button form="formNote" onClick={updateDiaChi} type="primary" htmlType="submit">
            Thay đổi
          </Button>,
        ]}
      >
        <Form

          id="formNote"
          onFinish={handleCancelAdress}
          form={form}
          layout="vertical" // Điều chỉnh layout cho đẹp hơn
        >
          <Form layout="vertical" form={form} >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Họ và Tên" required>
                  <Input
                    value={hoTen || undefined}
                    onChange={(e) => setHoTen(e.target.value)}
                    placeholder="Nhập họ tên"
                  />
                  {errors.hoTen && <div style={{ color: 'red' }}>{errors.hoTen}</div>}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Số Điện Thoại" required>
                  <Input
                    value={soDienThoai || undefined}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.soDienThoai && <div style={{ color: 'red' }}>{errors.soDienThoai}</div>}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Địa Chỉ Cụ Thể" required>
                  <Input
                    onChange={(e) => setDiaChiCuThe(e.target.value)}
                    value={diaChiCuThe || undefined}
                    placeholder="Nhập địa chỉ cụ thể"
                  />
                  {errors.diaChiCuThe && <div style={{ color: 'red' }}>{errors.diaChiCuThe}</div>}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Thành phố" rules={[{ required: true, message: 'Thành phố không được để trống!' }]}>
                  <Select
                    name="thanhPho"
                    showSearch
                    placeholder="Chọn thành phố"
                    value={selectedProvince || undefined}
                    onChange={(value) => {
                      setThanhPho(value);
                      handleProvinceChange(value);
                    }}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                        {province.ProvinceName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Huyện" rules={[{ required: true, message: "Huyện không được để trống!" }]}>
                  <Select
                    name="huyen"
                    showSearch
                    placeholder="Chọn huyện"
                    value={selectedDistrict || undefined}
                    onChange={handleDistrictChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
              <Col span={8}>
                <Form.Item label="Phường" rules={[{ required: true, message: "Phường không được để trống!" }]}>
                  <Select
                    name="phuong"
                    showSearch
                    placeholder="Chọn phường"
                    value={phuong || undefined}
                    onChange={handleWardChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
            <Form.Item label="Phí vận chuyển mới">
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

          </Form>

        </Form>

      </Modal>
    </>
  );

}
export default ChangeCustom;
