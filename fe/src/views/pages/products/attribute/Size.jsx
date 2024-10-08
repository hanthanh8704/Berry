import React, { useState, useEffect } from "react";
import { Button, Col, Input, Modal, Row, Table, Tooltip, Form,Tag } from "antd";
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { IconEdit } from "@tabler/icons-react";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import * as request from "views/utilities/httpRequest";

function Size() {
    const [sizeList, setSizeList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [pageSize, setPageSize] = useState(5);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [item, setItem] = useState(null);

    useEffect(() => {
        loadData(currentPage, pageSize, searchValue);
    }, [currentPage, pageSize, searchValue]);

    const loadData = async (page, size, search) => {
        try {
            const response = await request.get("/size", {
                params: { name: search, page, sizePage: size },
            });
            setSizeList(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const showDeleteConfirm = (item) => {
        Modal.confirm({
            title: "Xác nhận",
            icon: <EditOutlined />,
            content: "Bạn có chắc muốn xóa kích cỡ này?",
            okText: "Xác nhận",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                handleDelete(item.id);
            },
        });
    };

    const handleDelete = async (id) => {
        try {
            await request.remove(`/size/${id}`);
            loadData(currentPage, pageSize, searchValue);
            toast.success("Xóa thành công!");
        } catch (error) {
            console.error("Error deleting data:", error);
            toast.error("Xóa kích cỡ thất bại!");
        }
    };

    const handleAdd = (values) => {
        Modal.confirm({
            title: "Xác nhận",
            icon: <EditOutlined />,
            content: "Bạn có chắc muốn thêm kích cỡ này?",
            okText: "Xác nhận",
            okType: "primary",
            cancelText: "Hủy",
            async onOk() {
                try {

                    const duplicate = sizeList.some(size => size.ten.toLowerCase() === values.ten.toLowerCase());
                    if (duplicate) {
                        toast.error("Tên kích cỡ đã tồn tại!");
                        return;
                    }
                    const response = await request.post("/size/create", values);
                    if (response.status === 200) {
                        toast.success("Thêm kích cỡ thành công!");
                        setIsModalAddOpen(false);
                        formAdd.resetFields();
                        loadData(currentPage, pageSize, searchValue);
                    }
                } catch (error) {
                    console.error("Error adding data:", error);
                    toast.error("Thêm kích cỡ thất bại!");
                }
            },
        });
    };

    const handleUpdate = (values) => {
        Modal.confirm({
            title: "Xác nhận",
            icon: <EditOutlined />,
            content: "Bạn có chắc muốn cập nhật kích cỡ này?",
            okText: "Xác nhận",
            okType: "primary",
            cancelText: "Hủy",
            async onOk() {
                try {
                    const duplicate = sizeList.some(size => size.ten.toLowerCase() === values.ten.toLowerCase());
                    if (duplicate) {
                        toast.error("Tên kích cỡ đã tồn tại!");
                        return;
                    }
                    const response = await request.put(`/size/update/${item.id}`, values);
                    if (response.status === 200) {
                        toast.success("Cập nhật kích cỡ thành công!");
                        setIsModalUpdateOpen(false);
                        formUpdate.resetFields();
                        loadData(currentPage, pageSize, searchValue);
                    }
                } catch (error) {
                    console.error("Error updating data:", error);
                    toast.error("Cập nhật kích cỡ thất bại!");
                }
            },
        });
    };

    const handleCancelAdd = () => {
        setIsModalAddOpen(false);
        formAdd.resetFields();
    };

    const handleCancelUpdate = () => {
        setIsModalUpdateOpen(false);
        formUpdate.resetFields();
    };

    const handleEdit = (record) => {
        setItem(record);
        setIsModalUpdateOpen(true);
        formUpdate.setFieldsValue({
            ten: record.ten,
        });
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    return (
        <div className="bg-white rounded-3 p-3">
            <ToastContainer />
            <h6 className="fw-semibold m-2">Danh sách kích cỡ</h6>
            <Row gutter={10} className="m-2">
                <Col span={13}>
                    <label className="mb-1">Kích cỡ</label>
                    <Input
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Tìm kiếm kích cỡ theo tên..."
                    />
                </Col>
                <Col span={6}></Col>
                <Col span={4}>
                    <div className="mb-1">‍</div>
                    <Button
                        type="primary"
                        onClick={() => setIsModalAddOpen(true)}
                        className=" w-100"
                        style={{ backgroundColor: '#5e35b1' }}
                    >
                        <PlusOutlined /> Thêm kích cỡ
                    </Button>
                </Col>
            </Row>
            <Table
                dataSource={sizeList}
                columns={[
                    {
                        title: "#",
                        dataIndex: "index",
                        key: "index",
                        className: "text-center",
                        render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
                    },
                    {
                        title: "Tên Kích Cỡ",
                        dataIndex: "ten",
                        key: "ten",
                        className: "text-center",
                    },
                    {
                        title: "Trạng Thái",
                        dataIndex: "trangThai",
                        key: "trangThai",
                        className: "text-center",
                        render: (text) => (
                            <Tag
                              style={{ width: '120px' }}
                              className="text-center"
                              color={
                                text === 'Đang hoạt động' ? '#2ed573' :
                                text === 'Ngừng hoạt động' ? '#f50' : '#636e72'
                              }
                            >
                              {text}
                            </Tag>
                          )
                    },
                    {
                        title: "Ngày tạo",
                        dataIndex: "ngayTao",
                        key: "ngayTao",
                        className: "text-center",
                        render: (text) => moment(text).format("DD-MM-YYYY"),
                    },
                    {
                        title: "Hành Động",
                        dataIndex: "id",
                        key: "action",
                        className: "text-center",
                        render: (text, record) => (
                            <Tooltip placement="top" title="Chỉnh sửa">
                                <Button style={{ color: '#5e35b1' }} type="text" onClick={() => handleEdit(record)}>
                                    <i className="fas fa-edit "><IconEdit /></i>
                                </Button>
                            </Tooltip>
                        ),
                    },
                ]}
                pagination={{
                    showSizeChanger: true,
                    current: currentPage,
                    pageSize: pageSize,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    showQuickJumper: true,
                    total: totalPages * pageSize,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
                className="mt-3"
            />

            <Modal
                title="Thêm kích cỡ"
                visible={isModalAddOpen}
                onCancel={handleCancelAdd}
                footer={[
                    <Button key="cancel" onClick={handleCancelAdd}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => formAdd.submit()}>
                        Thêm
                    </Button>,
                ]}
            >
                <Form layout="vertical" form={formAdd} onFinish={handleAdd}>
                    <Form.Item
                        label="Kích cỡ"
                        name="ten"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên kích cỡ!" },
                            { whitespace: true, message: "Không được chỉ là khoảng trắng!" },
                            {
                                pattern: /^[A-Za-zÀ-ỹ0-9\s'-]+$/,
                                message: "Tên kích cỡ chỉ được chứa các ký tự chữ cái, số và không được là khoảng trắng!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên kích cỡ..." />
                    </Form.Item>
                </Form>


            </Modal>

            <Modal
                title="Chỉnh sửa kích cỡ"
                visible={isModalUpdateOpen}
                onCancel={handleCancelUpdate}
                footer={[
                    <Button key="cancel" onClick={handleCancelUpdate}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => formUpdate.submit()}>
                        Cập nhật
                    </Button>,
                ]}
            >
                <Form layout="vertical" form={formUpdate} onFinish={handleUpdate}>
                    <Form.Item
                        label="Kích cỡ"
                        name="ten"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên kích cỡ!" },
                            { whitespace: true, message: "Không được chỉ là khoảng trắng!" },
                            {
                                pattern: /^[A-Za-zÀ-ỹ\s'-]+$/,
                                message: "Tên kích cỡ chỉ được chứa các ký tự chữ cái và không được là số!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên kích cỡ..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Size;
