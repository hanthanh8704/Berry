import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Input, Radio, Row, Select, Switch, Table, Tooltip, Card } from "antd";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { EditOutlined } from '@ant-design/icons';
import { IconEdit, IconTrash, IconPhoto } from "@tabler/icons-react";
import { PlusOutlined } from '@ant-design/icons';
import * as request from "views/utilities/httpRequest";
import { HelpOutline } from "@mui/icons-material";

function Product() {
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [listCate, setListCate] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [statusProduct, setStatusProduct] = useState(null);
    const [pageSize, setPageSize] = useState(5);
    const [searchCate, setSearchCate] = useState('');



    useEffect(() => {
        request.get("/category", { params: { ten: searchCate, status: false, sizePage: 1_000_000 } })
            .then((response) => {
                setListCate(response.data);
            }).catch((error) => { console.log(error); });
    }, [searchCate]);

    useEffect(() => {
        loadData(currentPage, pageSize, searchValue, selectedCate, statusProduct);
    }, [currentPage, pageSize, searchValue, selectedCate, statusProduct]);


    //Hàm Load dữ liệu
    const loadData = async (page, size, searchValue, danhMuc, status) => {
        try {
            const response = await request.get("/shirt", {
                params: {
                    ma: searchValue ? `%${searchValue}%` : null,
                    ten: searchValue ? `%${searchValue}%` : null,
                    page,
                    sizePage: size,
                    danhMuc: danhMuc !== 'All' ? danhMuc : null,
                    status,
                },
            });
            setProductList(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    //Hàm tìm kiếm
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        setCurrentPage(1);
        loadData(1, pageSize, value, selectedCate, statusProduct);
    };


    const handleCategoryChange = (value) => {
        setSelectedCate(value);
        setCurrentPage(1);
        loadData(1, pageSize, searchValue, value, statusProduct);
    };

    const handleChangeStatus = async (id) => {
        try {
            await request.remove(`/shirt/${id}`);
            toast.success("Đã cập nhật trạng thái!", {
                autoClose: 3000, // Close after 3 seconds
            });
            loadData(currentPage, pageSize, searchValue, selectedCate, statusProduct);
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            align: 'center',
            render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
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
                <Tooltip title={x ? "Ngừng bán" : "Đang bán"} color="#5e35b1">
                    <Switch
                        className="custom-switch"
                        defaultChecked={!x}
                        onChange={() => handleChangeStatus(record.id)}
                    />
                </Tooltip>
            ),
            align: 'center',
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (x) => (
                <Tooltip title="Chỉnh sửa">
                    <Link style={{ color: '#5e35b1' }} to={`/products/${x}`}>
                        <i className="fas fa-edit "><IconEdit /></i>
                    </Link>
                </Tooltip>
            ),
            align: 'center',
        },
    ];

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
            <ToastContainer autoClose={3000} /> {/* Set autoClose property */}
            <Card className="mb-1 p-2">
                <h6 className="fw-bold mt-3">Danh sách sản phẩm</h6>
                <Row gutter={16} className="mb-3">
                    <Col span={20}>
                        <label className="mb-2">Tên sản phẩm</label>
                        <Input onChange={(e) => setSearchValue(e.target.value)} value={searchValue} placeholder="Tìm kiếm sản phẩm theo tên..." />
                    </Col>
                    <Col span={4} className="d-flex align-items-end justify-content-end">
                        <Link to={"/products/add-shirt"}>
                            <Button type="primary" className=" w-100"
                                style={{ backgroundColor: '#5e35b1' }}>
                                <PlusOutlined /> Thêm sản phẩm
                            </Button>
                        </Link>
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
                            onChange={handleCategoryChange}
                            placeholder="Chọn danh mục..."
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            onSearch={setSearchCate}
                            value={selectedCate}
                        >
                            <Select.Option value="All">Chọn danh mục</Select.Option>
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
                />
            </Card>
        </div>
    );
}

export default Product;
