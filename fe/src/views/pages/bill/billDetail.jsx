import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Timeline, Modal, Button, Table, Tooltip, Radio, Space, Form, Input } from "antd";
import { IconBrandOpenai } from "@tabler/icons-react";
import FormatDate from "views/utilities/FormatDate";
import FormatCurrency from "views/utilities/FormatCurrency";
import { toast } from "react-toastify";
import Loading from "ui-component/Loading";
import BillHistory from "./billHistory";
import PaymentMethod from "./paymentMethod";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import InfoBill from "./changeCustomer";
import { Carousel } from 'antd';
import changeBill from "./changeBill";
import * as request from "views/utilities/httpRequest";
import "./bill.css";

const BillDetail = () => {
  const [bill, setBill] = useState([]);
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [cancelBill, setCancelBill] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadBill = async () => {
    try {
      const response = await request.get(`/bill/${id}`);
      setBill(response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const loadBillDetail = async () => {
    try {
      const response = await request.get(`/bill-detail`, {
        params: {
          bill: id,
          page: currentPage,
          sizePage: pageSize,
        },
      });
      setListBillDetail(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const loadBillHistory = async () => {
    try {
      const response = await request.get(`/bill-history/${id}`);
      setBillHistory(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBill();
    loadBillDetail();
    loadBillHistory();
  }, [id]);

  useEffect(() => {
    loadBillDetail();
  }, [currentPage, pageSize]);

  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa khỏi giỏ hàng ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await request.remove(`/bill-detail/${id}`);
          toast.success("Xóa thành công!");
          loadBillDetail();
          loadBill();
          loadBillHistory();
        } catch (error) {
          console.log(error);
          toast.error(error.response.data);
        }
      },
    });
  };

  const handleChangeQuantity = (record, newQuantity) => {
    // Xử lý khi thay đổi số lượng sản phẩm
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
    },
    {
      title: <i className="fas fa-image"></i>,
      dataIndex: "images",
      key: "images",
      render: (item) => (
        <>
          <Carousel autoplay autoplaySpeed={1500} dots={false} arrows={false} style={{ width: "150px" }}>
            {item !== undefined &&
              item.split(",").map((image, index) => (
                <div className="" style={{ height: "150px" }} key={index}>
                  <img src={image} alt="images" style={{ width: "150px", height: "150px" }} className="object-fit-cover" />
                </div>
              ))}
          </Carousel>
        </>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <>
          <ul className="list-unstyled ">
            <li className="fw-semibold">{name}</li>
            <li>
              <small>{record.ma}</small>
            </li>
            <li>
              Đơn giá: <span className="text-danger"><FormatCurrency value={record.price} /></span>
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <>
          {bill.status <= 4 ? (
            <Form key={record.id}>
              <Form.Item initialValue={quantity} name={"quantity"} className="m-0 p-0">
                <Input className="text-center" min={1} type="number" style={{ width: "64px" }} onPressEnter={(e) => handleChangeQuantity(record, e.target.value)} />
              </Form.Item>
            </Form>
          ) : (
            quantity
          )}
        </>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "quantity",
      key: "total",
      render: (quantity, record) => (
        <div className="text-center text-danger fw-semibold">
          <FormatCurrency value={record.price * record.quantity} />
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <>
          {bill.status <= 4 ? (
            <>
              {listBillDetail.length > 1 && (
                <>
                  <Tooltip placement="top" title="Xóa">
                    <Button onClick={() => handleDeleteBillDetail(id)} type="text" className="text-danger me-1">
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Tooltip>
                </>
              )}
            </>
          ) : bill.status === 6 ? (
            record.status === false ? (
              <>
                {bill.status === 7 || bill.status === 8 ? (
                  ""
                ) : (
                  <Tooltip placement="top" title="Trả hàng">
                    <Button onClick={() => handleGiveBack(id)} type="primary" danger icon={<i className="fa-solid fa-rotate-left"></i>}></Button>
                  </Tooltip>
                )}
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </>
      ),
    },
  ];

  const handleGiveBack = (id) => {
    // Xử lý khi cần trả hàng
  };

  const showModal = (cancelBill) => {
    setCancelBill(cancelBill);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data) => {
    // Xử lý khi submit form ghi chú
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <nav className="breadcrumb fw-semibold">
        <Link className="breadcrumb-item __bee-text text-decoration-none" to={"/admin/bill"}>
          Danh sách hóa đơn
        </Link>
        <span className="breadcrumb-item">Hóa đơn {bill.code}</span>
      </nav>
      <div className="container overflow-x-auto mb-3">
        <Timeline mode="alternate">
          {billHistory.map((item, index) => (
            <Timeline.Item key={index} label={<FormatDate date={item.createAt} />}>
              <h6>{item.status}</h6>
              <p>{item.note}</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
      <div className="d-flex">
        <div className="flex-grow-1">
          {bill.status !== "Hoàn thành" && (
            <>
              {bill.status !== "Đang giao" && bill.status !== "Chờ giao" && (
                <Button type="primary" danger className="me-1" onClick={() => showModal(true)}>
                  Hủy
                </Button>
              )}
              {(bill.status !== "Hoàn thành" &&
                bill.status !== "Chờ thanh toán" &&
                bill.status !== "Chờ xác nhận") && (
                <Button
                  type="primary"
                  onClick={() => showModal(false)}
                >
                  {bill.status === "Chờ giao" ? "Giao hàng" : bill.status === "Đang giao" ? "Hoàn thành" : "Xác nhận"}
                </Button>
              )}
            </>
          )}
        </div>
        <div>
          {bill.status !== "Tạo đơn hàng" && bill.status !== "Chờ thanh toán" && (
            <Tooltip title="In hóa đơn">
              <Link className="px-2" target="blank" to={`/export-pdf/${bill.id}`}>
                <Button type="primary" icon={<i className="fas fa-print"></i>}></Button>
              </Link>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="container-fluid">
        <Table
        dataSource={listBillDetail}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        bordered
        scroll={{ x: "max-content" }}
        className="mt-3"
      />
      </div>
      <Modal
        title={cancelBill ? "Hủy đơn hàng" : "Xác nhận đơn hàng"}
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Xác nhận
          </Button>,
        ]}
      >
        {cancelBill ? (
          <TextArea rows={4} placeholder="Lý do hủy đơn hàng..." />
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="note" label="Ghi chú">
              <TextArea rows={4} placeholder="Nhập ghi chú..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default BillDetail;
