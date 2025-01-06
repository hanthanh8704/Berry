// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Button, Col, Input, Radio, Row, Select, Switch, Table, Tooltip, Card } from "antd";
// import { toast, ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { IconEdit } from "@tabler/icons-react";
// import debounce from "lodash/debounce";
// import * as request from "../utilities/httpRequest"; // Thay đổi đường dẫn tương ứng

// function Product() {
//     const [productList, setProductList] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const [listCate, setListCate] = useState([]);
//     const [listBrand, setListBrand] = useState([]);
//     const [selectedCate, setSelectedCate] = useState(null);
//     const [selectedBrand, setSelectedBrand] = useState(null);
//     const [searchValue, setSearchValue] = useState("");
//     const [statusProduct, setStatusProduct] = useState(null);
//     const [pageSize, setPageSize] = useState(5);
//     const [searchCate, setSearchCate] = useState('');
//     const [searchBrand, setSearchBrand] = useState('');

//     useEffect(() => {
//         request.get("/category", { params: { name: searchCate, status: false } })
//             .then((response) => {
//                 setListCate(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });

//         request.get("/brand", { params: { name: searchBrand, status: false } })
//             .then((response) => {
//                 setListBrand(response.data);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }, [searchCate, searchBrand]);

//     useEffect(() => {
//         const delayedSearch = debounce(() => {
//             loadData();
//         }, 300);

//         delayedSearch();

//         return () => {
//             delayedSearch.cancel();
//         };
//     }, [searchValue, currentPage, selectedCate, selectedBrand, pageSize, statusProduct]);

//     const loadData = () => {
//         request.get("/shirt", {
//             params: {
//                 name: searchValue,
//                 page: currentPage,
//                 sizePage: pageSize,
//                 category: selectedCate,
//                 brand: selectedBrand,
//                 status: statusProduct
//             },
//         }).then((response) => {
//             setProductList(response.data.content);
//             setTotalPages(response.data.totalPages);
//         }).catch((error) => {
//             console.log(error);
//         });
//     };

//     const handleChangeStatus = async (id) => {
//         await request.remove(`/shirt/${id}`)
//             .then(response => {
//                 toast.success("Đã cập nhật trạng thái!");
//                 loadData();
//             })
//             .catch(e => {
//                 console.log(e);
//             });
//     };

//     const columns = [
//         {
//             title: '#',
//             dataIndex: 'index',
//             key: 'index',
//             width: 50,
//             align: 'center',
//             render: (_, __, index) => index + 1,
//         },
//         {
//             title: 'Mã',
//             dataIndex: 'ma',
//             key: 'ma',
//         },
//         {
//             title: 'Tên',
//             dataIndex: 'ten',
//             key: 'ten',
//         },
//         {
//             title: 'Số lượng',
//             dataIndex: 'soLuong',
//             key: 'soLuong',
//             render: (x) => x == null ? 0 : x,
//             align: 'center',
//         },
//         {
//             title: 'Danh mục',
//             dataIndex: 'danhMuc',
//             key: 'danhMuc',
//         },
//         {
//             title: 'Thương hiệu',
//             dataIndex: 'thuongHieu',
//             key: 'thuongHieu',
//         },
//         {
//             title: 'Trạng thái',
//             dataIndex: 'status',
//             key: 'status',
//             render: (x, record) => (
//                 <Tooltip title={`${x ? "Ngừng bán" : "Đang bán"}`}>
//                     <Switch defaultChecked={!x} onChange={() => handleChangeStatus(record.id)} />
//                 </Tooltip>
//             ),
//             align: 'center',
//         },
//         {
//             title: 'Hành động',
//             dataIndex: 'id',
//             key: 'action',
//             render: (id) => (
//                 <Tooltip title="Chỉnh sửa">
//                     <Link to={`/products/${id}`} className="btn btn-sm btn-primary me-1">
//                         <IconEdit />
//                     </Link>
//                 </Tooltip>
//             ),
//             align: 'center',
//         },
//     ];

//     return (
//         <div style={{ background: '#fff', padding: '20px' }}>
//             <ToastContainer />
//             <Card className="mb-1 p-2">
//                 <h6 className="fw-bold mt-3">Danh sách sản phẩm</h6>
//                 <Row gutter={16} className="mb-3">
//                     <Col span={20}>
//                         <label className="mb-2">Tên sản phẩm</label>
//                         <Input onChange={(event) => setSearchValue(event.target.value)} placeholder="Tìm kiếm sản phẩm theo tên..." />
//                     </Col>
//                     <Col span={4} className="d-flex align-items-end justify-content-end">
//                         <Link to={"/products/add-shirt"}>
//                             <Button type="primary" className="bg-primary">
//                                 <i className="fas fa-plus-circle me-1"></i>Thêm sản phẩm
//                             </Button>
//                         </Link>
//                     </Col>
//                 </Row>
//             </Card>
//             <Card className="mb-2 p-1">
//                 <Row gutter={16}>
//                     <Col span={8}>
//                         <div className="mb-2">Trạng thái</div>
//                         <Radio.Group defaultValue={null} onChange={(event) => setStatusProduct(event.target.value)}>
//                             <Radio value={null}>Tất cả</Radio>
//                             <Radio value={false}>Đang bán</Radio>
//                             <Radio value={true}>Ngừng bán</Radio>
//                         </Radio.Group>
//                     </Col>
//                     <Col span={8}>
//                         <label className="mb-2">Danh mục</label>
//                         <Select
//                             showSearch
//                             onChange={setSelectedCate}
//                             placeholder="Chọn danh mục..."
//                             optionFilterProp="children"
//                             style={{ width: "100%" }}
//                             onSearch={setSearchCate}
//                         >
//                             <Select.Option value="">Chọn danh mục</Select.Option>
//                             {listCate.map((item) => (
//                                 <Select.Option key={item.ten} value={item.ten}>
//                                     {item.ten}
//                                 </Select.Option>
//                             ))}
//                         </Select>
//                     </Col>
//                     <Col span={8}>
//                         <label className="mb-2">Thương hiệu</label>
//                         <Select
//                             showSearch
//                             onChange={setSelectedBrand}
//                             placeholder="Chọn thương hiệu..."
//                             optionFilterProp="children"
//                             style={{ width: "100%" }}
//                             onSearch={setSearchBrand}
//                         >
//                             <Select.Option value="">Chọn thương hiệu</Select.Option>
//                             {listBrand.map((item) => (
//                                 <Select.Option key={item.ten} value={item.ten}>
//                                     {item.ten}
//                                 </Select.Option>
//                             ))}
//                         </Select>
//                     </Col>
//                 </Row>
//             </Card>
//             <Card>
//                 <Table
//                     dataSource={productList}
//                     columns={columns}
//                     className="custom-table"
//                     pagination={{
//                         showSizeChanger: true,
//                         current: currentPage,
//                         pageSize: pageSize,
//                         pageSizeOptions: [5, 10, 20, 50, 100],
//                         showQuickJumper: true,
//                         total: totalPages * pageSize,
//                         onChange: (page, pageSize) => {
//                             setCurrentPage(page);
//                             setPageSize(pageSize);
//                         },
//                     }}
//                 />
//             </Card>

//         </div>
//     );
// }

// export default Product;
