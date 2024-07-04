import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Input, Radio, Row, Select, Switch, Table, Tooltip, Card, Modal, Form } from "antd";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconEdit } from "@tabler/icons-react";
import * as request from "views/utilities/httpRequest";
import debounce from "lodash/debounce";

function Product() {
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listCate, setListCate] = useState([]);
    const [listBrand, setListBrand] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [statusProduct, setStatusProduct] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [searchCate, setSearchCate] = useState('');
    const [searchBrand, setSearchBrand] = useState('');
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [item, setItem] = useState(null);

    useEffect(() => {
        request.get("/category", { params: { name: searchCate, status: false } })
            .then((response) => {
                setListCate(response.data);
            }).catch((error) => { console.log(error); });
        request.get("/brand", { params: { name: searchBrand, status: false } })
            .then((response) => {
                setListBrand(response.data);
            }).catch((error) => { console.log(error); });
    }, [searchCate, searchBrand]);

    useEffect(() => {
        const delayedSearch = debounce(() => {
            loadData();
        }, 300);

        delayedSearch();

        return () => {
            delayedSearch.cancel();
        };
    }, [searchValue, currentPage, selectedCate, selectedBrand, pageSize, statusProduct]);

    const loadData = () => {
        request.get("/shirt", {
            params: { name: searchValue, page: currentPage, sizePage: pageSize, category: selectedCate, brand: selectedBrand, status: statusProduct },
        }).then((response) => {
            setProductList(response.data);
            setTotalPages(response.totalPages);
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleChangeStatus = async (id) => {
        await request.remove(`/shirt/${id}`).then(response => {
            toast.success("Đã cập nhật trạng thái!");
            loadData();
        }).catch(e => {
            console.log(e);
        })
    }

    const handleAdd = (values) => {
        Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có chắc muốn thêm sản phẩm này?",
            okText: "Xác nhận",
            okType: "primary",
            cancelText: "Hủy",
            async onOk() {
                try {
                    const response = await request.post("/shirt/create", values);
                    if (response.status === 200) {
                        toast.success("Thêm sản phẩm thành công!");
                        setIsModalAddOpen(false);
                        formAdd.resetFields();
                        loadData();
                    }
                } catch (error) {
                    console.error("Error adding data:", error);
                    toast.error("Thêm sản phẩm thất bại!");
                }
            },
        });
    };

    const handleUpdate = (values) => {
        Modal.confirm({
            title: "Xác nhận",
            content: "Bạn có chắc muốn cập nhật sản phẩm này?",
            okText: "Xác nhận",
            okType: "primary",
            cancelText: "Hủy",
            async onOk() {
                try {
                    const response = await request.put(`/shirt/update/${item.id}`, values);
                    if (response.status === 200) {
                        toast.success("Cập nhật sản phẩm thành công!");
                        setIsModalUpdateOpen(false);
                        formUpdate.resetFields();
                        loadData();
                    }
                } catch (error) {
                    console.error("Error updating data:", error);
                    toast.error("Cập nhật sản phẩm thất bại!");
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
            ma: record.ma,
            ten: record.ten,
            soLuong: record.soLuong,
            danhMuc: record.danhMuc,
            // Thêm các trường khác nếu cần
        });
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            align: 'center',
        },
        {
            title: 'Mã',
            dataIndex: 'ma',
            key: 'ma',
        },
        {
            title: 'Tên',
            dataIndex: 'ten',
            key: 'ten',
        },
        {
            title: 'Số lượng',
            dataIndex: 'soLuong',
            key: 'soLuong',
            render: (x) => x == null ? 0 : x,
            align: 'center',
        },
        {
            title: 'Danh mục',
            dataIndex: 'danhMuc',
            key: 'danhMuc',
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (x, record) => (
                <Tooltip title={x ? "Ngừng bán" : "Đang bán"}>
                    <Switch defaultChecked={!x} onChange={() => handleChangeStatus(record.id)} />
                </Tooltip>
            ),
            align: 'center',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (x, record) => (
                <Tooltip title="Chỉnh sửa">
                    <Button onClick={() => handleEdit(record)}>
                        <IconEdit />
                    </Button>
                </Tooltip>
            ),
            align: 'center',
        },
    ];

    return (
        <div style={{ background: '#fff', padding: '20px' }}>
            <Card className="mb-1 p-2">
                <h6 className="fw-bold mt-3">Danh sách sản phẩm</h6>
                <Row gutter={16} className="mb-3">
                    <Col span={20}>
                        <label className="mb-2">Tên sản phẩm</label>
                        <Input onChange={(event) => setSearchValue(event.target.value)} placeholder="Tìm kiếm sản phẩm theo tên..." />
                    </Col>
                    <Col span={4} className="d-flex align-items-end justify-content-end">
                        <Button type="primary" className="bg-primary" onClick={() => setIsModalAddOpen(true)}>
                            <IconEdit /> Thêm sản phẩm
                        </Button>
                    </Col>
                </Row>
            </Card>
            <Card className="mb-2 p-1">
                <Row gutter={16}>
                    <Col span={8}>
                        <div className="mb-2">Trạng thái</div>
                        <Radio.Group defaultValue={null} onChange={(event) => setStatusProduct(event.target.value)}>
                            <Radio value={null}>Tất cả</Radio>
                            <Radio value={false}>Đang bán</Radio>
                            <Radio value={true}>Ngừng bán</Radio>
                        </Radio.Group>
                    </Col>
                    <Col span={8}>
                        <label className="mb-2">Danh mục</label>
                        <Select
                            showSearch
                            onChange={setSelectedCate}
                            placeholder="Chọn danh mục..."
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            onSearch={setSearchCate}
                        >
                            <Select.Option value="">Chọn danh mục</Select.Option>
                            {listCate.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>

                </Row>
            </Card>
            <Card>
                <Table
                    dataSource={productList}
                    columns={columns}
                    className="custom-table"
                    pagination={{
                        showSizeChanger: true,
                        current: currentPage,
                        pageSize: pageSize,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        showQuickJumper: true,
                        total: totalPages * pageSize,
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <Modal
                title="Thêm sản phẩm"
                visible={isModalAddOpen}
                onCancel={handleCancelAdd}
                onOk={() => formAdd.submit()}
                okText="Thêm"
                cancelText="Hủy"
            >
                <Form form={formAdd} onFinish={handleAdd}>

                    <Form.Item name="ten" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                        <Input placeholder="Tên sản phẩm" />
                    </Form.Item>

                    <Form.Item name="danhMuc" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
                        <Select placeholder="Chọn danh mục">
                            {listCate.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Cập nhật sản phẩm"
                visible={isModalUpdateOpen}
                onCancel={handleCancelUpdate}
                onOk={() => formUpdate.submit()}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form form={formUpdate} onFinish={handleUpdate}>
                    <Form.Item name="ma" label="Mã sản phẩm" rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}>
                        <Input placeholder="Mã sản phẩm" />
                    </Form.Item>
                    <Form.Item name="ten" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
                        <Input placeholder="Tên sản phẩm" />
                    </Form.Item>
                    <Form.Item name="soLuong" label="Số lượng" rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}>
                        <Input type="number" placeholder="Số lượng" />
                    </Form.Item>
                    <Form.Item name="danhMuc" label="Danh mục" rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}>
                        <Select placeholder="Chọn danh mục">
                            {listCate.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.ten}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Product;
