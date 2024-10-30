import { Breadcrumb, Button, Carousel, Col, Divider, Empty, Form, Input, InputNumber, Modal, Row, Select, Switch, Table, Tooltip } from "antd";
import { QRCode as QRCodeAntd } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import FormatDate from "views/utilities/FormatDate.jsx";
import request from "views/utilities/httpRequest.js";
import UpdateShirt from "./UpdateShirt";
import UpdateShirtDetail from "./UpdateShirtDetail";
import FormatCurrency from "views/utilities/FormatCurrency.jsx";
import Title from "antd/es/typography/Title";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Option } from "antd/es/mentions";
import { IconEdit, IconTrash, IconSettings } from "@tabler/icons-react";
import { IconLibraryPhoto, IconQrcode } from "@tabler/icons-react";
import QRCode from 'qrcode-generator';
import download from 'downloadjs';
import JSZip from "jszip";
import Category from "../attribute/Category";


function ShirtInfo() {
    const [formFilter] = Form.useForm();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [listProductDetail, setListProductDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [listUpdate, setListUpdate] = useState([]);
    const [listSize, setListSize] = useState([]);
    const [searchSize, setSearchSize] = useState('');
    const [listColor, setListColor] = useState([]);
    const [listMaterial, setListMaterial] = useState([]);
    const [listSleeve, setListSleeve] = useState([]);
    const [listCollar, setListCollar] = useState([]);
    const [listBrand, setListBrand] = useState([]);
    const [dataFilter, setDataFilter] = useState({});
    const [shoeDetailSelect, setShoeDetailSelect] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys, record) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setShoeDetailSelect(record);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    //QRCODE
    const downloadAllQRCode = () => {
        if (!shoeDetailSelect || shoeDetailSelect.length === 0) {
            console.error('shoeDetailSelect is empty or undefined');
            return;
        }

        const zip = new JSZip();

        shoeDetailSelect.forEach((item, index) => {
            const qr = QRCode(0, 'H');
            qr.addData(item.detailCode);
            qr.make();

            const canvas = document.createElement('canvas');
            canvas.width = qr.getModuleCount() * 10;
            canvas.height = qr.getModuleCount() * 10;

            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#000000';
            qr.renderTo2dContext(context, 10);

            try {
                const dataUrl = canvas.toDataURL('image/png');
                console.log('Data URL:', dataUrl); // Debug log

                if (dataUrl) {
                    const base64Data = dataUrl.split('base64,')[1];
                    console.log('Base64 Data:', base64Data); // Debug log

                    if (base64Data) {
                        const folder = zip.folder('qrcodes');
                        folder.file(`${item.detailCode}.png`, base64Data, { base64: true });
                    } else {
                        console.error(`Failed to process base64 data for item ${item.detailCode}`);
                    }
                } else {
                    console.error(`Failed to generate data URL for item ${item.detailCode}`);
                }
            } catch (error) {
                console.error(`Error generating QR code for item ${item.detailCode}:`, error);
            }
        });

        zip.generateAsync({ type: 'blob' }).then((content) => {
            download(content, 'qrcodes.zip', 'application/zip');
        }).catch((error) => {
            console.error('Error generating ZIP file:', error);
        });
    };
    // Hàm thay đổi cân nặng
    const handleWeightChange = (value, id) => {
        const x = listProductDetail.find((detail) => detail.id === id); // Tìm sản phẩm trong danh sách chi tiết
        const index = listUpdate.findIndex((item) => item.id === id); // Tìm chỉ mục trong danh sách cập nhật

        if (index !== -1) {
            // Nếu sản phẩm đã tồn tại trong danh sách cập nhật, cập nhật cân nặng
            listUpdate[index].weight = value;
        } else {
            // Nếu chưa tồn tại, thêm mới sản phẩm vào danh sách cập nhật
            listUpdate.push({ id: id, weight: value, price: x.price, quantity: 0 }); // Số lượng có thể là 0 nếu không thay đổi
        }
        console.log(listUpdate);
    };

    //Hàm thay đổi só lượng
    const handleQuantityChange = (value, id) => {
        const x = listProductDetail.find((detail) => detail.id === id);
        const index = listUpdate.findIndex((item) => item.id === id);
        if (index !== -1) {
            listUpdate[index].quantity = value;
        } else {
            listUpdate.push({ id: id, quantity: value, price: x.price });
        }
        console.log(listUpdate);
    }
    const handlePriceChange = (value, id) => {
        const x = listProductDetail.find((detail) => detail.id === id);
        const index = listUpdate.findIndex((item) => item.id === id);
        if (index !== -1) {
            listUpdate[index].price = value;
        } else {
            listUpdate.push({ id: id, quantity: x.quantity, price: value });
        }
        console.log(listUpdate);
    }

    useEffect(() => {
        request.get('/size', { params: { name: searchSize } }).then(response => {
            setListSize(response.data.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/color', { params: { name: searchSize } }).then(response => {
            setListColor(response.data.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/material', { params: { name: searchSize } }).then(response => {
            setListMaterial(response.data.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/collar', { params: { name: searchSize } }).then(response => {
            setListCollar(response.data.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/brand', { params: { name: searchSize } }).then(response => {
            setListBrand(response.data.data);
        }).catch(e => {
            console.log(e);
        })
        request.get('/sleeve', { params: { name: searchSize } }).then(response => {
            setListSleeve(response.data.data);
        }).catch(e => {
            console.log(e);
        })
    }, [searchSize])

    const validateInput = (value) => {
        // Hàm validate để không nhập khoảng trắng và chỉ nhập số
        if (/\s/.test(value)) {
            // Kiểm tra nếu có khoảng trắng
            return false;
        }
        return true;
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            align: 'center'
        },

        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            width: 130,

            // render: (x, record) => (
            //     <>
            //         {x}
            //         <br />
            //         {record.discountPercentage !== null && <small className="fw-semibold">SALE <span className="text-danger">{record.discountPercentage} %</span></small>}
            //     </>
            // )
        },
        {
            title: 'Chất liệu',
            dataIndex: 'material',
            key: 'material',
        },
        {
            title: 'Thương hiệu',
            dataIndex: 'brand',
            key: 'brand',
            width: 115,
        },
        {
            title: 'Tay áo',
            dataIndex: 'sleeve',
            key: 'sleeve',
            width: 110,
        },
        {
            title: 'Cổ áo',
            dataIndex: 'collar',
            key: 'collar',
            width: 119,
        },
        {
            title: 'Cân nặng',
            dataIndex: 'weight',
            key: 'weight',
            width: 100,
            render: (x, record) => (
                <>
                    {selectedRowKeys.includes(record.id) ? (
                        <InputNumber
                            defaultValue={x}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => (value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : "")}
                            controls={false}
                            min={0}
                            onChange={(value) => handleWeightChange(value, record.id)} // Hàm xử lý thay đổi cân nặng
                            onBlur={() => {
                                if (isNaN(x)) {
                                    handleWeightChange(0, record.id); // Reset to 0 nếu giá trị không phải số
                                }
                            }}
                        />
                    ) : (
                        <>{x}</>
                    )}
                </>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (x, record) => (
                <>
                    {selectedRowKeys.includes(record.id) ? (
                        <InputNumber
                            defaultValue={x}
                            formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => (value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : "")}
                            controls={false}
                            min={0}
                            onChange={(value) => handleQuantityChange(value, record.id)}
                            onBlur={() => {
                                if (isNaN(x)) {
                                    handleQuantityChange(0, record.id); // Reset to 0 if non-numeric value entered
                                }
                            }}
                        />
                    ) : (
                        <>{x}</>
                    )}
                </>
            )
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (x, record) => (
                <>
                    {selectedRowKeys.includes(record.id) ? (
                        <InputNumber
                            defaultValue={x}
                            formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => (value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : "")}
                            controls={false}
                            min={0}
                            onChange={(value) => handlePriceChange(value, record.id)}
                            onBlur={() => {
                                if (isNaN(x)) {
                                    handlePriceChange(0, record.id); // Reset to 0 if non-numeric value entered
                                }
                            }}
                        />
                    ) : (
                        <>
                            {record.discountValue == null ? (
                                <FormatCurrency value={x} />
                            ) : (
                                <>
                                    <span className="text-danger"><FormatCurrency value={record.discountValue} /></span> <span className="text-decoration-line-through text-secondary"><FormatCurrency value={record.price} /></span>
                                </>
                            )}
                        </>
                    )}
                </>
            )
        },
        {
            title: (<IconLibraryPhoto />),
            dataIndex: 'images',
            key: 'images',
            render: (images) => {
                if (!images) {
                    console.error('Images data is null or undefined');
                    return null; // Hoặc một thành phần khác để hiển thị khi không có hình ảnh
                }
                return (
                    <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: "100px" }} >
                        {images.split(',').map((image, index) => (
                            <img key={index} src={image} alt="images" style={{ width: "100px", height: "100px" }} className="object-fit-contain" />
                        ))}
                    </Carousel>
                );
            }
        }
        ,
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            width: 120,
            render: (x, record) => (
                <>
                    <UpdateShirtDetail props={record} onSuccess={() => loadShoeDetail(id, currentPage, pageSize)} />
                    {/* <Tooltip placement="bottom" title="Xóa">
                        <Button type="text"><i className="fas fa-trash text-danger"><IconTrash /></i></Button>
                    </Tooltip> */}
                </>
            )
        },
    ];
    useEffect(() => {
        const timeout = setTimeout(() => {
            loadData(id);
        }, 800);
        return () => clearTimeout(timeout);
    }, []);

    const loadData = async (id) => {
        const response = await request.get(`/shirt/` + id,).then(response => {
            // if (response.status === 200) {
            setProduct(response.data);
            console.log(response.data);
            console.log(product.category.name);
            setLoading(false);
            // }
        }).catch(e => {
            // toast.error(e.response.data);
            console.log(e);
        })
    }
    useEffect(() => {
        loadShoeDetail(id, currentPage, pageSize);
    }, [id, currentPage, pageSize, dataFilter])


    //Hàm load CTSP
    const loadShoeDetail = (id, currentPage, pageSize) => {
        request.get('/shirt-detail', {
            params: {
                name: dataFilter.name,
                size: dataFilter.size,
                color: dataFilter.color,
                material: dataFilter.material,
                sleeve: dataFilter.sleeve,
                collar: dataFilter.collar,
                brand: dataFilter.brand,

                product: id,
                page: currentPage,
                sizePage: pageSize,
            }
        }).then(response => {

            console.log(id);
            console.log(response.data);
            setListProductDetail(response.data.data);
            setTotalPages(response.data.totalPages);
        })
    }

    //Hàm update nhanh CTSP 
    const handleUpdateFast = () => {
        Modal.confirm({
            title: "Xác nhận",
            maskClosable: true,
            content: `Xác nhận cập nhật ${selectedRowKeys.length} sản phẩm ?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: () => {
                request.put('/shirt-detail/update-fast', listUpdate).then(response => {
                    toast.success('Cập nhật thành công!', { autoClose: 3000, closeOnClick: true });
                    loadShoeDetail(id, currentPage, pageSize);
                    setSelectedRowKeys([]);
                }).catch(e => {
                    console.log(e);
                })
            },
        });
    }


    return (
        <>

            <div className="bg-white rounded-3 p-1">
                <Breadcrumb className="mt-1 m-2"
                    items={[{ href: "/" }, { href: "/admin/products", title: "Danh sách sản phẩm" }, { title: `${product.name}` },]}
                />
                {/* Thông tin chung sản phẩm */}
                <Row gutter={24} >
                    <Col xl={24} className="d-flex align-items-center py-1 m-1" >
                        <div className="flex-grow-1">
                            <Title level={4} className="m-2">Thông tin sản phẩm</Title>
                        </div>
                        <div className="me-4">
                            <UpdateShirt props={product} onSuccess={() => { loadData(id); loadShoeDetail(id, currentPage, pageSize) }} />
                        </div>
                    </Col>
                    <Col xl={8}>
                        <ul className="list-unstyled">
                            <li className="my-2 ms-3">
                                Danh mục: <span className="float-end fw-semibold">Shirt</span>
                            </li>

                        </ul>
                    </Col>
                    <Col xl={8}>
                        <ul className="list-unstyled me-3" >
                            <li>
                                Người tạo: <span className="float-end fw-semibold">{product.createdBy ? product.createdBy : ' Thành Đạt'}</span>
                            </li>
                            <li>
                                Người chỉnh sửa: <span className="float-end fw-semibold">{product.createdBy ? product.createdBy : 'Thành Đạt'}</span>
                            </li>
                        </ul>
                    </Col>
                    <Col xl={8}>
                        <ul className="list-unstyled me-3">
                            <li>
                                Ngày tạo: <span className="float-end fw-semibold "><FormatDate date={product.ngayTao ? product.ngayTao : new Date()} /></span>
                            </li>
                            <li>
                                Ngày cập nhật cuối: <span className="float-end fw-semibold"><FormatDate date={product.ngaySua ? product.ngaySua : new Date()} /></span>
                            </li>
                        </ul>
                    </Col>


                    <Divider />
                </Row>
                {/* Thông tin chi tiết */}
                <div className="d-flex m-3" style={{ backgroundColor: "white" }}>
                    <div className="flex-grow-1">
                        <Title level={5}>Chi tiết sản phẩm</Title>
                    </div>
                    {selectedRowKeys.length > 0 && (
                        <>
                            <div className="me-2">
                                <Button type="primary" onClick={() => downloadAllQRCode()}><IconQrcode /> Tải QR</Button>
                            </div>
                            <div className="">
                                <Button type="primary" onClick={() => handleUpdateFast()} className="bg-primary"><IconEdit /> Cập nhật {selectedRowKeys.length} sản phẩm</Button>
                            </div>
                        </>
                    )}
                </div>
                <Form className="m-2" layout='vertical' onFinish={(data) => setDataFilter(data)} form={formFilter} style={{ backgroundColor: "white" }}>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item label="Kích cỡ" name={"size"}>
                                <Select showSearch placeholder="Chọn kích cỡ..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn kích cỡ</Option>
                                    {listSize.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Màu sắc" name={"color"}>
                                <Select showSearch placeholder="Chọn màu sắc..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn màu sắc</Option>
                                    {listColor.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Chất liệu" name={"material"}>
                                <Select showSearch placeholder="Chọn chất liệu..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn chất liệu</Option>
                                    {listMaterial.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Thương hiệu" name={"brand"}>
                                <Select showSearch placeholder="Chọn thương hiệu..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn thương hiệu</Option>
                                    {listBrand.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Tay áo" name={"sleeve"}>
                                <Select showSearch placeholder="Chọn tay áo..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn tay áo</Option>
                                    {listSleeve.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Cổ áo" name={"collar"}>
                                <Select showSearch placeholder="Chọn cổ áo..." optionFilterProp="children" style={{ width: "100%" }} onSearch={setSearchSize}>
                                    <Option value="">Chọn cổ áo</Option>
                                    {listCollar.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="text-center">
                        <Button className='me-1 bg-secondary' onClick={() => { formFilter.resetFields() }} type='primary' icon={<i class="fa-solid fa-rotate-left"></i>}>Làm mới</Button>
                        <Button htmlType='submit' className='text-white' onClick={() => { formFilter.getFieldValue }} style={{ backgroundColor: '#5e35b1' }} type='primary' icon={<i className='fas fa-search'></i>}>Tìm kiếm</Button>
                    </div>
                </Form>
                <Table dataSource={listProductDetail} columns={columns} className="mt-3"
                    rowKey={"id"}
                    rowSelection={rowSelection}
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
                    }} />

            </div>
        </>
    );
}

export default ShirtInfo;
