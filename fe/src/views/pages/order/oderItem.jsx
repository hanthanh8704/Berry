import {
  Alert,
  Button,
  Carousel,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Space,
  Switch,
  Table,
  Tooltip
} from 'antd';
import React from 'react';
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

function OrderItem({ index, props, onSuccess }) {
  const [form] = Form.useForm();
  const [listOrderDetail, setListOrderDetail] = useState([]);
  const [loaiHoaDon, setLoaiHoaDon] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [autoFillAddress, setAutoFillAddress] = useState([]);
  const [newAddress, setNewAddress] = useState({});
  const [phiShip, setPhiShip] = useState(0);
  const [ghiChu, setGhiChu] = useState('');
  const [choThanhToan, setChoThanhToan] = useState(false); //
  const [hinhThucThanhToan, setHinhThucThanhToan] = useState('Tiền mặt'); // Hình thức thanh toán
  const [extraMoney, setExtraMoney] = useState(null); // tiền thừa

  const [tongTien, setTongTien] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  const [tienKhachDua, setTienKhachDua] = useState(0);
  const [voucher, setVoucher] = useState(null);
  const [soTienDuocGiam, setSoTienDuocGiam] = useState(0); // Số tiền đã giảm

  const [tienMat, setTienMat] = useState(0);
  const [tienChuyenKhoan, setTienChuyenKhoan] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    setTienKhachDua(0);
    setExtraMoney(0);
  }, [hinhThucThanhToan]);

  useEffect(() => {
    loadListOrderDetail();
  }, [props, currentPage, pageSize]);

  const onSelect = (value) => {
    request
      .post('/bill-detail', {
        hoaDon: props.id,
        sanPhamChiTiet: value
        //   quantity: 1,
      })
      .then((response) => {
        toast.success('Thêm thành công!');
        loadListOrderDetail();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Hàm này dùng để load danh sách hóa đơn ct
  const loadListOrderDetail = async () => {
    await request
      .get(`/bill-detail`, {
        params: {
          hoaDon: props.id,
          page: currentPage,
          sizePage: pageSize
        }
      })
      .then((response) => {
        setListOrderDetail(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });

    await request
      .get(`/bill-detail`, {
        params: {
          hoaDon: props.id,
          page: 1,
          sizePage: 1_000_000
        }
      })
      .then((response) => {
        // Hàm tính tổng tiền của hdct
        const calculatedTotalMoney = response.data.reduce((total, item) => {
          return total + item.soLuong * (item.phanTramGiam !== null ? item.giaTriDaGiam : item.gia);
        }, 0);
        // Hàm tính tổng số lượng sp
        //   const calculateTotalWeight = response.data.reduce((total, item) => {
        //     return total + item.weight * item.quantity;
        //   }, 0);
        //   setTotalWeight(calculateTotalWeight);
        setTongTien(calculatedTotalMoney);
        //   setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
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
    setLoaiHoaDon('Chờ thanh toán');
  };

  useEffect(() => {
    if (autoFillAddress !== null) {
      caculateFee();
      form.setFieldsValue({
        hoTen: autoFillAddress.hoTen,
        soDienThoai: autoFillAddress.soDienThoai,
        diaChiCuThe: autoFillAddress.diaChiCuThe,
        thanhPho: parseInt(autoFillAddress.thanhPho),
        huyen: parseInt(autoFillAddress.huyen),
        phuong: autoFillAddress.phuong
      });
    }
  }, [autoFillAddress]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: <IconPhotoStar />,
      dataIndex: 'images',
      key: 'images',
      render: (item, record) => (
        <>
          <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} style={{ width: '150px' }}>
            {item !== undefined &&
              item.split(',').map((images, index) => (
                <div className="position-relative" style={{ height: '150px' }}>
                  <img src={images} alt="images" style={{ width: '150px', height: '150px' }} className="object-fit-contain" />
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
        <>
          <ul className="list-unstyled ">
            <li className="fw-semibold">
              {name}
              {record.phanTramGiam !== null && (
                <>
                  <span className="ms-2 badge rounded-pill bg-danger">- {record.phanTramGiam} %</span>
                </>
              )}
            </li>
            <li>
              <small>{record.maSPCT}</small>
            </li>
            <li>
              Đơn giá:
              {record.phanTramGiam !== null ? (
                <>
                  <span className="text-danger">
                    <FormatCurrency value={record.phanTramGiam} />
                  </span>{' '}
                  <span className="text-decoration-line-through text-secondary">
                    <FormatCurrency value={record.gia} />
                  </span>
                </>
              ) : (
                <span className="text-danger">
                  <FormatCurrency value={record.giaAo} />
                </span>
              )}
            </li>
          </ul>
        </>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      render: (soLuong, record) => (
        <Form key={record.id}>
          <Form.Item initialValue={soLuong} name={'soLuong'} className="m-0 p-0">
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
      dataIndex: 'soLuong',
      key: 'total',
      render: (soLuong, record) => (
        <div className="text-center text-danger fw-semibold">
          <FormatCurrency value={(record.giaTriDaGiam !== null ? record.giaTriDaGiam : record.gia) * record.soLuong} />
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          <Tooltip placement="top" title="Xóa">
            <Button onClick={() => handleDeleteBillDetail(id)} type="text" className="text-danger me-1">
              <IconTrashFilled />
            </Button>
          </Tooltip>
        </>
      )
    }
  ];

  const caculateFee = async () => {
    await request
      .post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          service_id: 53320, // ID của dịch vụ
          service_type_id: null, // Loại dịch vụ (null)
          to_district_id: parseInt(autoFillAddress.huyen), // ID của quận/huyện nhận hàng
          to_ward_code: autoFillAddress.phuong, // Mã phường/xã nhận hàng
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
            Token: '693d8a79-3a3d-11ef-8e53-0a00184fe694',
            ShopId: 192796
          }
        }
      )
      .then((response) => {
        setPhiShip(response.data.data.total); // Cập nhật phí vận chuyển vào trạng thái
      })
      .catch((e) => {
        console.log(e); // In lỗi ra console nếu yêu cầu thất bại
      });
  };

  // Kiểm tra xem có thể áp dụng được phiếu giảm khong
  useEffect(() => {
    if (voucher !== null) {
      if (tongTien < voucher.giaTriHoaDonDuocApDung) {
        toast.error('Không thể áp dụng phiếu giảm giá do không đủ điều kiện!');
        setVoucher(null);
        setSoTienDuocGiam(0);
      } else {
        setSoTienDuocGiam((tongTien / 100) * voucher?.phanTramGiam);
      }
    }
  }, [voucher, tongTien]);

  useEffect(() => {
    caculateFee();
  }, [totalWeight]);

  // Hàm này dùng để thay đổi số lượng sản phẩm trong hdct
  const handleChangeQuantity = async (record, soLuong) => {
    await request
      .get(`/bill-detail/update-quantity/${record.id}`, {
        params: {
          newQuantity: soLuong,
          giaBan: record.giaTriDaGiam === null ? record.sanPhamChiTiet : record.giaTriDaGiam
        }
      })
      .then((response) => {
        loadListOrderDetail();
        console.log(record);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data);
      });
  };

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

  function generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
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
    data.loaiHoaDon = loaiHoaDon;
    data.tenNguoiNhan = loaiHoaDon === 'Tại quầy' ? (customer !== null ? customer?.hoTen : 'Khách hàng lẻ') : autoFillAddress.hoTen;
    data.tongTien = tongTien;
    data.soTienDuocGiam = soTienDuocGiam;
    data.ghiChu = ghiChu;
    data.hinhThucThanhToan = hinhThucThanhToan;
    data.tienMat = tienMat;
    data.tienChuyenKhoan = tienChuyenKhoan;

    data.soDienThoaiNguoiNhan = autoFillAddress.soDienThoaiNguoiNhan;
    data.diaChi =
      loaiHoaDon === 'Tại quầy'
        ? null
        : `${autoFillAddress.diaChiCuThe}##${autoFillAddress.phuong}##${autoFillAddress.huyen}##${autoFillAddress.thanhPho}`;
    data.phiShip = loaiHoaDon === 'Giao hàng' ? phiShip : 0;
    data.choThanhToan = choThanhToan;

    if (listOrderDetail.length === 0) {
      toast.error('Hãy thêm gì đó vào giỏ hàng!');
    } else {
      if (hinhThucThanhToan === 'Tiền mặt') {
        if (tienMat <= 0 || tienMat === null) {
          toast.error('Vui lòng nhập số tiền mặt cần thanh toán!');
          return;
        }
        if (tienMat > tongTien) {
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
      } else if (hinhThucThanhToan === 'Chuyển khoản') {
        const bill = { ...data, idTransaction: generateUUID(), id: props.id };
        localStorage.setItem('checkout', JSON.stringify(bill));
        try {
          const response = await axios.get(
            `http://localhost:8080/api/vn-pay/payment?id=${bill.idTransaction}&total=${Math.floor(bill.tongTien - bill.soTienDuocGiam + bill.phiShip)}`
          );
          if (response.status) {
            window.location.href = response.data.data;
          }
        } catch (error) {
          console.error('Error making axios request:', error);
        }
        return;
      } else {
        if (loaiHoaDon === 'Tại quầy' && !choThanhToan) {
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
        content: `Xác nhận ${choThanhToan ? 'chuyển đơn hàng sang trạng thái chờ thanh toán' : 'tạo hóa đơn'} ?`,
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: async () => {
          console.log(data);
          request
            .put(`/bill/${props.id}`, data)
            .then((response) => {
              toast.success(choThanhToan ? 'Đơn hàng đã chuyển sang trạng thái chờ thanh toán!' : 'Tạo đơn hàng thành công!');
              onSuccess();
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="d-flex">
        <div className="flex-grow-1">
          <Title level={5}>Đơn hàng {props.ma}</Title>
        </div>
        <div className="me-1">
          <ShowProductModal
            idHoaDon={props.id}
            onClose={() => {
              loadListOrderDetail();
            }}
          />
        </div>
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
              showSizeChanger: true,
              current: currentPage,
              pageSize: pageSize,
              pageSizeOptions: [3, 5, 10, 20],
              showQuickJumper: true,
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
              {customer?.hoTen}
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
                Tên khách hàng: <span className="float-end fw-semibold">{customer === null ? 'Khách hàng lẻ' : customer?.hoTen}</span>
              </li>
              {customer !== null && (
                <>
                  <li className="mb-2">
                    Email: <span className="float-end fw-semibold">{customer?.email}</span>
                  </li>
                  <li className="mb-2">
                    Số điện thoại: <span className="float-end fw-semibold">{customer?.soDienThoai}</span>
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
                    Giới tính: <span className="float-end fw-semibold">{customer?.gioiTinh}</span>
                  </li>
                  <li className="mb-2">
                    Ngày sinh:{' '}
                    <span className="float-end fw-semibold">
                      <FormatTime date={customer?.ngaySinh} />
                    </span>
                  </li>
                </>
              )}
            </ul>
          </Col>
        </Row>
      </div>
      <div style={{ boxShadow: '2px 2px 4px 4px rgba(0, 0, 0, 0.03)' }} className="my-3 p-2 mt-4">
        <div className="d-flex">
          <div className="flex-grow-1">
            <Title level={5}>Thông tin thanh toán</Title>
          </div>
          {/*  */}
          <div className="">
            {customer !== null && loaiHoaDon === 'Đặt hàng' && (
              <AddressOrders
                idKhachHang={customer.id}
                onSuccess={(address) => {
                  setAutoFillAddress(address);
                }}
              />
            )}
          </div>
        </div>
        <Divider className="m-0 mb-3" />
        <Row gutter={10}>
          <Col xl={14}>
            {loaiHoaDon === 0 ? (
              <img
                // src="https://www.lucepictor.com/wp-content/uploads/2017/05/running-shoes-on-white-background-1920x1280.jpg.webp"
                width={'100%'}
                alt=""
              />
            ) : (
              <>
                <Form layout="vertical" form={form} onFinish={(data) => console.log(data)}>
                  <Row gutter={10}>
                    <Col xl={12}>
                      <Form.Item label="Họ và tên" required name={'hoTen'}>
                        <Input
                          placeholder="Nhập họ và tên..."
                          onChange={(e) => setAutoFillAddress({ ...autoFillAddress, hoTen: e.target.value })}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={12}>
                      <Form.Item label="Số điện thoại" required name={'soDienThoai'}>
                        <Input
                          placeholder="Nhập số điện thoại..."
                          onChange={(e) => setAutoFillAddress({ ...autoFillAddress, soDienThoai: e.target.value })}
                        />
                      </Form.Item>
                    </Col>
                    <GHNDetail
                      thanhPho={autoFillAddress.thanhPho}
                      dataAddress={(data) => setAutoFillAddress({ ...autoFillAddress, ...data })}
                      huyen={autoFillAddress.huyen}
                      phuong={autoFillAddress.phuong}
                    />
                    <Col xl={16}>
                      <Form.Item label="Địa chỉ cụ thể" name={'diaChiCuThe'}>
                        <Input
                          placeholder="Nhập địa chỉ cụ thể ..."
                          onChange={(e) => setAutoFillAddress({ ...autoFillAddress, diaChiCuThe: e.target.value })}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={8}>
                      <img src="https://donhang.ghn.vn/static/media/Giao_Hang_Nhanh_Toan_Quoc_color.b7d18fe5.png" alt="" width={'100%'} />
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
                        setLoaiHoaDon(value ? 'Giao hàng' : 'Tại quầy');
                      }}
                    />{' '}
                    Giao hàng
                  </>
                )}
              </li>
              <Row gutter={10}>
                <VoucherOrder
                  onSelectVoucher={(voucher) => {
                    if (voucher.quantity <= 0) {
                      toast.error('Phiếu giảm giá này đã hết lượt sử dụng!');
                    } else {
                      setVoucher(voucher);
                    }
                  }}
                  customerId={customer?.id}
                />
              </Row>
              <li className="mb-2">
                Tạm tính:{' '}
                <span className="float-end fw-semibold">
                  <FormatCurrency value={tongTien} />
                </span>
              </li>
              {loaiHoaDon === 'Giao hàng' && (
                <li className="mb-2">
                  Phí vận chuyển (tạm tính):{' '}
                  <span className="float-end fw-semibold">
                    <FormatCurrency value={phiShip} />
                  </span>
                </li>
              )}
              <li className="mb-2">
                Giảm giá:{' '}
                <span className="float-end fw-semibold">
                  <FormatCurrency value={soTienDuocGiam} />
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
                            Giảm <span className="text-danger fw-semibold">{voucher?.percentReduce}%</span> đơn tối thiểu{' '}
                            <span className="text-danger fw-semibold">
                              <FormatCurrency value={voucher?.minBillValue} />
                            </span>
                          </div>
                          <div className="">
                            <span
                              className="float-end text-danger"
                              onClick={() => {
                                setVoucher(null);
                                setSoTienDuocGiam(0);
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
              <li className="mb-2">
                Tổng tiền:{' '}
                <span className="float-end fw-semibold text-danger">
                  <FormatCurrency value={tongTien - soTienDuocGiam + (loaiHoaDon === 'Giao hàng' ? phiShip : 0)} />
                </span>
              </li>
              {loaiHoaDon === 'Tại quầy' && (
                <>
                  {hinhThucThanhToan === 'Tiền mặt' && (
                    <>
                      <li className="mb-2">
                        Tiền khách đưa:
                        <InputNumber
                          className="w-100 mb-2"
                          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          controls={false}
                          min={0}
                          suffix="VNĐ"
                          placeholder="Nhập tiền khách đưa..."
                          onChange={(e) => {
                            setExtraMoney(e - tongTien + soTienDuocGiam);
                            setTienKhachDua(e);
                          }}
                        />
                        {tongTien > 0 && (
                          <Alert
                            message={
                              tienKhachDua < tongTien - soTienDuocGiam ? 'Vui lòng nhập đủ tiền khách đưa!' : 'Khách đã đưa đủ tiền!'
                            }
                            type={tienKhachDua < tongTien - soTienDuocGiam ? 'error' : 'success'}
                          />
                        )}
                      </li>
                      <li className="mb-2">
                        Tiền thừa:{' '}
                        <span className="float-end fw-semibold text-danger">
                          <FormatCurrency value={extraMoney < 0 || extraMoney === null ? 0 : extraMoney} />
                        </span>
                      </li>
                    </>
                  )}
                  {hinhThucThanhToan === 'Chuyển khoản' && (
                    <>
                      <li className="mb-2">
                        Tiền khách đưa:
                        <InputNumber
                          className="w-100 mb-2"
                          formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          controls={false}
                          min={0}
                          suffix="VNĐ"
                          placeholder="Nhập tiền khách đưa..."
                          onChange={(e) => {
                            setExtraMoney(e - tongTien + soTienDuocGiam);
                            setTienKhachDua(e);
                          }}
                        />
                        {tongTien > 0 && (
                          <Alert
                            message={
                              tienKhachDua < tongTien - soTienDuocGiam ? 'Vui lòng nhập đủ tiền khách đưa!' : 'Khách đã đưa đủ tiền!'
                            }
                            type={tienKhachDua < tongTien - soTienDuocGiam ? 'error' : 'success'}
                          />
                        )}
                      </li>
                      <li className="mb-2">
                        Tiền thừa:{' '}
                        <span className="float-end fw-semibold text-danger">
                          <FormatCurrency value={extraMoney < 0 || extraMoney === null ? 0 : extraMoney} />
                        </span>
                      </li>
                    </>
                  )}
                </>
              )}
              {hinhThucThanhToan === 'Chuyển khoản' && (
                <li className="mb-2">
                  <>
                    <li className="mb-2">
                      Tiền khách đưa:
                      <InputNumber
                        className="w-100 mb-2"
                        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        controls={false}
                        min={0}
                        suffix="VNĐ"
                        placeholder="Nhập tiền khách đưa..."
                        onChange={(e) => {
                          setTienChuyenKhoan(tongTien - soTienDuocGiam + phiShip - e);
                          setTienMat(e);
                        }}
                      />
                    </li>
                    <li className="mb-2">
                      Tiền cần chuyển khoản:{' '}
                      <span className="float-end fw-semibold text-danger">
                        <FormatCurrency value={tienChuyenKhoan} />
                      </span>
                    </li>
                  </>
                </li>
              )}
              <li className="mb-2">
                <li className="mb-2">Chọn phương thức thanh toán:</li>
                <Row gutter={10}>
                  <Col xl={12} onClick={() => setHinhThucThanhToan('Tiền mặt')}>
                    <div
                      className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${hinhThucThanhToan === 'Tiền mặt' && 'border-warning text-warning'}`}
                    >
                      <i className="fa-solid fa-coins" style={{ fontSize: '36px' }}></i>
                      <span className="ms-2 fw-semibold text-dark">Tiền mặt</span>
                    </div>
                  </Col>
                  <Col xl={12} onClick={() => setHinhThucThanhToan('Chuyển khoản')}>
                    <div
                      className={`py-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${hinhThucThanhToan === 'Chuyển khoản' && 'border-warning text-warning'}`}
                    >
                      {/* <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                        alt=""
                        style={{ width: '36px' }}
                      /> */}
                      <span className="ms-2 fw-semibold text-dark">Chuyển khoản</span>
                    </div>
                  </Col>
                  <Col xl={24} onClick={() => setHinhThucThanhToan('Cả hai')}>
                    <div
                      className={`py-2 mt-2 border border-2 rounded-2 d-flex align-items-center justify-content-center ${hinhThucThanhToan === 'Cả hai' && 'border-warning text-warning'}`}
                    >
                      <i className="fa-solid fa-coins" style={{ fontSize: '36px' }}></i>
                      <span className="ms-2 fw-semibold text-dark">Tiền mặt & </span>
                      {/* <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                        alt=""
                        style={{ width: '36px' }}
                      /> */}
                      <span className="ms-2 fw-semibold text-dark">Chuyển khoản</span>
                    </div>
                  </Col>
                </Row>
              </li>
              <li className="mb-2">
                <TextArea placeholder="Nhập ghi chú..." onChange={(e) => setNote(e.target.value)} />
              </li>
              <li className="mb-2 float-end">
                <Switch onChange={(value) => setChoThanhToan(value)} /> Chờ thanh toán
              </li>
              <li>
                <Button type="primary" className="bg-warning text-dark w-100" onClick={() => handleCreate()}>
                  Thanh toán hóa đơn
                </Button>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default OrderItem;
