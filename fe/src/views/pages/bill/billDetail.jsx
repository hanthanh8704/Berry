import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Modal, Divider,Radio,Space,Button, Table, Tooltip, Form, Input, Carousel } from "antd";
import { IconBrandOpenai,IconPrinter, IconFileInvoice, IconCircleXFilled, IconCheck, IconTruckDelivery, IconCalendarClock, IconCreditCardPay } from "@tabler/icons-react";
import FormatDate from "views/utilities/FormatDate";
import FormatCurrency from "views/utilities/FormatCurrency";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { toast } from "react-toastify";
import Loading from "ui-component/Loading";
import ChangeCustom from "./changeCustomer";
import BillHistory from "./billHistory";
import PaymentMethod from "./paymentMethod";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import InfoBill from "./changeCustomer";
import changeBill from "./changeBill";
import { FaRegFileAlt, FaTruck, FaEdit } from 'react-icons/fa';
import { MdOutlineConfirmationNumber, MdPayment, MdOutlineCancelPresentation, MdOutlineChangeCircle } from 'react-icons/md';
import { GiConfirmed } from 'react-icons/gi';
import * as request from "views/utilities/httpRequest";

import "./bill.css";
import { margin, style } from "@mui/system";

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formGiveback] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [cancelBill, setCancelBill] = useState(false);

  const loadBill = async () => {
    await request.get(`/bill/${id}`).then((response) => {
      setBill(response);
    }).catch((error) => {
      console.error(error);
    });
    setLoading(false);
  };
  const loadBillDetail = async () => {
    await request.get(`/bill-detail`, {
      params: {
        bill: id,
        page: currentPage,
        sizePage: pageSize,
      }
    }).then((response) => {
      setListBillDetail(response.data);
      setTotalPages(response.totalPages);
    }).catch((e) => {
      console.log(e);
    });
  };

  const loadBillHistory = () => {
    request
      .get(`/bill-history/${id}`)
      .then((response) => {
        setBillHistory(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadBill();
    loadBillDetail();
    loadBillHistory();
  }, [id]);

  useEffect(() => {
    loadBillDetail();
  }, [currentPage, pageSize])

  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa khỏi giỏ hàng ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        request.remove(`/bill-detail/${id}`).then(response => {
          toast.success("Xóa thành công!");
          loadBillDetail();
          loadBill();
          loadBillHistory();
        }).catch(e => {
          console.log(e);
          toast.error(e.response.data);
        })
      },
    });
  }

  const handleChangeQuantity = (record, quantity) => {
    request.get(`/bill-detail/update-quantity/${record.id}`, {
      params: {
        newQuantity: quantity,
        price: record.trangThai === true ? record.donGia : (record.discountValue === null ? record.shoePrice : record.discountValue)
      }
    }).then(response => {
      loadBillDetail();
      loadBill();
      loadBillHistory();
      toast.success("Cập nhật thành công!");
    }).catch(e => {
      console.log(e);
      toast.error(e.response.data);
    })
  }

  const handleGiveBack = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: (
        <>
          <Form layout="vertical" form={formGiveback} onFinish={async (data) => {
            data.billDetail = id;
            await request.post(`/bill/give-back`, data).then(response => {
              loadBillDetail();
              loadBill();
              loadBillHistory();
              toast.success("Trả hàng thành công!");
            }).catch(e => {
              console.log(e);
              toast.error(e.response.data);
            })
          }}>
            <Form.Item label="Số lượng" name={"quantity"} rules={[{ required: true, message: "Số lượng không được để trống!", },]}>
              <InputNumber placeholder="Nhập số lượng muốn trả hàng..." className="w-100" />
            </Form.Item>
            <Form.Item label="Lý do trả hàng" name={"note"} rules={[{ required: true, message: "Lý do trả hàng không được để trống!", },]}>
              <TextArea placeholder="Nhập lý do trả hàng..." />
            </Form.Item>
          </Form>
        </>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        formGiveback.submit()
      },
    });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (isCancel) => {
    setCancelBill(isCancel);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCancelBill(false);
  };

  const handleSubmit = (data) => {
    request.get(`/bill/change-status/${bill.id}`, {
      params: {
        note: data.ghiChu,
        isCancel: cancelBill
      }
    }).then((response) => {
      loadBill();
      loadBillDetail();
      loadBillHistory();
      form.resetFields();
      toast.success("Đã cập nhật trạng thái đơn hàng!");
    }).catch((e) => {
      console.log(e);
      toast.error(e.response.data);
    });
    setIsModalOpen(false);
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'anh',
      key: 'anh',
      render: (item) => (
        <>
          <Carousel autoplay autoplaySpeed={500} dots={false} arrows={false} style={{ width: "100px" }}>
            {item !== undefined && item.split(',').map((anh, index) => (
              <div className="" style={{ height: "100px" }}>
                <img src={anh} alt="images" style={{ width: "100px", height: "100px" }} className="object-fit-cover" />
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
            </li>
            <li>Đơn giá : 
               <span className="text-danger"><FormatCurrency value={record.gia} /></span>
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
        <>
          {bill.trangThai <= 4 ? (
            <Form key={record.id}>
              <Form.Item initialValue={soLuong} name={"soLuong"} className="m-0 p-0">
                <Input className="text-center" min={1} type="number" style={{ width: "64px" }} onPressEnter={(e) => handleChangeQuantity(record, e.target.value)} />
              </Form.Item>
            </Form>
          ) : (
            soLuong
          )}
        </>
      )
    },
    {
      title: "Tổng tiền",
      dataIndex: "soLuong",
      key: "total",
      render: (quantity, record) => (
        <div className="text-center text-danger fw-semibold">
          <FormatCurrency value={record.gia * record.soLuong} />
        </div>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          {bill.trangThai <= "Chờ giao" ? (
            <>
              {
                listBillDetail.length > 1 && (
                  <>
                    <Button onClick={() => handleDeleteBillDetail(id)} type="text" className="text-danger me-1"><IconTrashFilled/>Xóa</Button>
                  </>
                )
              }
            </>
          ) : bill.trangThai === 6 ? (
            record.trangThai === false ? (
              <>
                {bill.trangThai === 7 || bill.trangThai === 8 ? "" : (
                  <Tooltip placement="top" title="Trả hàng">
                    <Button onClick={() => handleGiveBack(id)} type="primary" danger icon={<i class="fa-solid fa-rotate-left"></i>}></Button>
                  </Tooltip>
                )}
              </>
            ) : ""
          ) : ""}
        </>
      )
    },
  ]

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <nav className="breadcrumb fw-semibold">
        <Link
          className="breadcrumb-item __bee-text text-decoration-none"
          to={"/admin/bill"}
        >
          Danh sách hóa đơn
        </Link>
        <h3 className="breadcrumb-item">Mã đơn hàng : {bill.ma}</h3>
      </nav>
      <div className="container overflow-x-auto mb-3">
        <Timeline minEvents={8} placeholder maxEvents={billHistory.length} style={{ height: "400px" }}>
          {billHistory.map((item, index) => (
            <TimelineEvent
              key={index}
              icon={
                item.trangThai === "Chờ thanh toán" ? FaRegFileAlt
                  : item.trangThai === "Tạo đơn hàng" ? FaRegFileAlt
                    : item.trangThai === "Chờ xác nhận" ? MdOutlineConfirmationNumber
                      : item.trangThai === "Xác nhận thanh toán" ? MdPayment
                        : item.trangThai === "Chờ giao" ? FaTruck
                          : item.trangThai === "Đang giao" ? FaTruck
                            : item.trangThai === "Hoàn thành" ? GiConfirmed
                              : item.trangThai === "Hủy" ? MdOutlineCancelPresentation : ""
              }
              color={
                item.trangThai === "Chờ xác nhận" ? '#024FA0' :
                  item.trangThai === "Chờ giao" ? "#F2721E" :
                    item.trangThai === "Đang giao" ? "#50B846" :
                      item.trangThai === "Trả 1 phần" ? "#FFBC05" :
                        item.trangThai === "Hủy" ? "#9C281C" : '#2DC255'
              }
              title={
                <h4 className="mt-2">
                  {item.trangThai === "Tạo đơn hàng" ? "Tạo đơn hàng"
                    : item.trangThai === "Chờ thanh toán" ? "Chờ thanh toán"
                      : item.trangThai === "Chờ xác nhận" ? "Chờ xác nhận"
                        : item.trangThai === "Xác nhận thanh toán" ? "Xác nhận thanh toán"
                          : item.trangThai === "Chờ giao" ? "Chờ giao"
                            : item.trangThai === "Đang giao" ? "Đang giao"
                              : item.trangThai === "Hoàn thành" ? "Hoàn thành"
                                : item.trangThai === "Hủy" ? "Hủy" : ""}
                </h4>
              }
              subtitle={
                <>
                  {item.ghiChu}
                  <br />
                  <FormatDate date={item.ngayTao} />
                </>
              }
            />
          ))}
        </Timeline>
      </div>
      <div className="d-flex justify-content-between align-items-center">
  <div style={{ float: 'left',marginBottom:'20px', marginTop:'20px'}}>
    {bill.trangThai !== "Hoàn thành" && (
      <>
        {bill.trangThai <= "Giao hàng" && (
          <Button type="primary" danger className="me-1" onClick={() => showModal(true)}>
            Hủy
          </Button>
        )}
        {bill.trangThai === "Hủy" || bill.trangThai === "Hoàn 1 phần" ? '' : (
          <Button type="primary" onClick={() => showModal(false)}>
            {bill.trangThai === "Giao hàng" ? "Giao hàng" : bill.trangThai === "Hoàn thành" ? "Hoàn thành" : "Xác nhận"}
          </Button>
        )}
      </>
    )}
  </div>
  <div className="mt-3">
  <div style={{ float: 'right',marginBottom:'20px', marginTop:'20px', marginLeft: '50px'}}>
    <BillHistory props={billHistory} />
  </div>
</div>
  <div className="ml-auto" style={{ float: 'right',marginBottom:'20px', marginTop:'20px'}}>
    {bill.trangThai !== "Tạo đơn hàng" && bill.trangThai !== "Chờ xác nhận" && (
      <Tooltip title="In hóa đơn">
        <Link className="px-2" target="blank" to={`/export-pdf/${bill.id}`}>
          <Button type="primary" icon={<IconPrinter />} />
        </Link>
      </Tooltip>
    )}
  </div>
</div>
      <Divider />
      {/* Thông tin đơn hàng */}
      <InfoBill props={bill} onSuccess={() => { loadBill(); loadBillHistory() }} />
      {/* Lịch sử thanh toán */}
      <PaymentMethod bill={bill} onSucess={() => { loadBillHistory() }} />
      {/* Thông tin đơn hàng */}
      <div className="d-flex align-items-center mt-5 align-middle">
        <Title level={5} className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2">Danh sách sản phẩm</Title>
        {bill.trangThai <= 4 ? (
          <ShowProductModal idBill={bill.id} onClose={() => { loadBillDetail(); loadBill(); loadBillHistory() }} />
        ) : bill.trangThai === 6 ? (
          <>
            {bill.trangThai === 7 || bill.trangThai === 8 ? "" : (
              <GivebackAll bill={bill} onSuccess={() => { loadBillDetail(); loadBill(); loadBillHistory() }} />
            )}
          </>
        ) : ""}
      </div>
      <Table dataSource={listBillDetail} columns={columns}
        showHeader={true}
        rowClassName={(record) => (record.trangThai === true ? "bg-danger-subtle" : "")}
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [3, 5, 10, 20,],
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }} />

      <Modal title="Nhập ghi chú" open={isModalOpen} onCancel={handleCancel} footer={<Button form="formNote" type="primary" htmlType="submit">Xác nhận</Button>}>
        <p><span className="text-danger">*</span>Chọn mẫu tin nhắn:</p>
        <Radio.Group className="mb-3" onChange={(e) => { form.setFieldsValue({ note: e.target.value }) }}>
          <Space direction="vertical">
            <Radio value={'Đã xác nhận đơn hàng'}>Đã xác nhận đơn hàng</Radio>
            <Radio value={'Đã bàn giao cho đơn vị vận chuyển'}>Đã bàn giao cho đơn vị vận chuyển</Radio>
            <Radio value={'Đã xác nhận thông tin thanh toán'}>Đã xác nhận thông tin thanh toán</Radio>
            <Radio value={'Đơn hàng đã được giao thành công'}>Đơn hàng đã được giao thành công</Radio>
            <Radio value={'Đã hủy đơn hàng'}>Đã hủy đơn hàng</Radio>
            <Radio value={''}>Khác</Radio>
          </Space>
        </Radio.Group>
        <Form id="formNote" onFinish={(data) => handleSubmit(data)} form={form}>
          <Form.Item name={"note"} rules={[{ required: true, message: "Ghi chú không được để trống!" }]}>
            <TextArea placeholder="Nhập ghi chú..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default BillDetail;