import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Input, Radio, Row, Select, Table, Tooltip, Card } from "antd";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlusOutlined } from '@ant-design/icons';
import * as request from "views/utilities/httpRequest";
import { IconEdit } from "@tabler/icons-react";

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
    const [loading, setLoading] = useState(false);

    // Lấy danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await request.get("/category", {
                    params: {
                        name: searchCate ? `%${searchCate}%` : null,
                        sizePage: 1000000
                    }
                });
                setListCate(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Không thể tải danh sách danh mục");
            }
        };
        fetchCategories();
    }, [searchCate]);

    // Lấy danh sách sản phẩm theo bộ lọc
    useEffect(() => {
        loadData(currentPage, pageSize, searchValue, selectedCate, statusProduct);
    }, [currentPage, pageSize, searchValue, selectedCate, statusProduct]);

    // const loadData = async (page, size, searchValue, category, status) => {
    //     setLoading(true);
    //     try {
    //         const response = await request.get("/shirt", {
    //             params: {
    //                 code: searchValue ? `%${searchValue}%` : null,
    //                 name: searchValue ? `%${searchValue}%` : null,
    //                 page,
    //                 sizePage: size,
    //                 category: category,
    //                 status,
    //             },
    //         });
    //         setProductList(response.data);
    //         setTotalPages(response.totalPages);
    //         if (response.data.length === 0) {
    //             toast.info("Hiện tại đang không có danh mục này");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //         toast.error("Có lỗi xảy ra khi tải dữ liệu");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const loadData = async (page, size, searchValue, category, status) => {
        setLoading(true);
        try {
            const response = await request.get("/shirt", {
                params: {
                    code: searchValue ? `%${searchValue}%` : null,
                    name: searchValue ? `%${searchValue}%` : null,
                    page,
                    sizePage: size,
                    category: category,
                    status,
                },
            });

            // Kiểm tra trạng thái sản phẩm
            if (status === false && response.data.length > 0) {
                // Nếu trạng thái là Ngừng bán và có sản phẩm thì vẫn hiện danh sách
                setProductList(response.data);
            } else if (status === false && response.data.length === 0) {
                // Nếu trạng thái là Ngừng bán nhưng không có sản phẩm thì không hiện gì
                setProductList([]);
            } else {
                // Nếu không phải trạng thái Ngừng bán thì hiển thị danh sách sản phẩm
                setProductList(response.data);
            }

            setTotalPages(response.totalPages);
            if (response.data.length === 0) {
                toast.info("Hiện tại đang không có danh mục này");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Có lỗi xảy ra khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        setSelectedCate(value === 'All' ? null : value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setStatusProduct(event.target.value);
        setCurrentPage(1);
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
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            render: (text) => <span >{text}</span>
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text) => <span>{text}</span>
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',

            render: (quantity) => (
                <span>
                    {quantity ?? 0}
                </span>
            ),
            align: 'center',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            // render: (category) => category?.name || "Chưa có", // Hiển thị tên danh mục
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{
                    color: status ? '#52c41a' : '#ff4d4f',  // Xanh cho Đang bán, Đỏ cho Ngừng bán
                    fontWeight: '500',
                    padding: '4px 8px',
                    backgroundColor: status ? '#f6ffed' : '#fff1f0',
                    borderRadius: '4px'
                }}>
                    {status ? "Đang bán" : "Ngừng bán"}
                </span>
            ),
            align: 'center',
        },

        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (id) => (
                <Tooltip title="Chỉnh sửa">
                    <Link
                        style={{
                            color: '#5e35b1',
                            fontSize: '18px'
                        }}
                        to={`/products/${id}`}
                    >
                        <IconEdit />
                    </Link>
                </Tooltip>
            ),
            align: 'center',
            width: 150,
        },
    ];

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <Card className="mb-3">
                <h6 className="fw-bold mb-3">Danh sách sản phẩm</h6>
                <Row gutter={16} className="mb-3">
                    <Col span={20}>
                        <label className="mb-2 fw-medium">Tên sản phẩm</label>
                        <Input
                            onChange={handleSearch}
                            value={searchValue}
                            placeholder="Tìm kiếm sản phẩm theo tên..."
                            allowClear
                        />
                    </Col>
                    <Col span={4} className="d-flex align-items-end justify-content-end">
                        <Link to={"/products/add-shirt"}>
                            <Button
                                type="primary"
                                className="w-100"
                                style={{ backgroundColor: '#5e35b1' }}
                                icon={<PlusOutlined />}
                            >
                                Thêm sản phẩm
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Card>

            <Card className="mb-3">
                <Row gutter={16}>
                    <Col span={8}>
                        <div className="mb-2 fw-medium">Trạng thái</div>
                        <Radio.Group
                            value={statusProduct}
                            onChange={handleStatusChange}
                        >
                            <Radio value={null}>Tất cả</Radio>
                            <Radio value={true}>Đang bán</Radio>
                            <Radio value={false}>Ngừng bán</Radio>
                        </Radio.Group>
                    </Col>
                    <Col span={8}>
                        <label className="mb-2 fw-medium">Danh mục</label>
                        <Select
                            showSearch
                            onChange={handleCategoryChange}
                            placeholder="Chọn danh mục..."
                            optionFilterProp="children"
                            style={{ width: "100%" }}
                            onSearch={setSearchCate}
                            value={selectedCate}
                            allowClear
                        >
                            <Select.Option value="All">Tất cả danh mục</Select.Option>
                            {listCate.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
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
                    rowKey="id"
                    loading={loading}
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
                        showTotal: (total) => `Tổng ${total} sản phẩm`,
                    }}
                />
            </Card>
        </div>
    );
}

export default Product;