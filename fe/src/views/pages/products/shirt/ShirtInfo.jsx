import { Breadcrumb, Button, Carousel, Col, Divider, Empty, Form, Input, InputNumber, Modal, Row, Select, Switch, Table, Tooltip } from "antd";
import { QRCode as QRCodeAntd } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import * as request from "views/utilities/httpRequest";
import UpdateShoe from "./UpdateShoe";
import UpdateShoeDetail from "./UpdateShoeDetail";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import { Option } from "antd/es/mentions";
import QRCode from 'qrcode-generator';
import download from 'downloadjs';
import JSZip from "jszip";

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
    const [listSole, setListSole] = useState([]);
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

    const downloadAllQRCode = () => {
        const zip = new JSZip();
        shoeDetailSelect.forEach((item, index) => {
            const qr = QRCode(0, 'H');
            qr.addData(item.code);
            qr.make();
            const canvas = document.createElement('canvas');
            canvas.width = qr.getModuleCount() * 10;
            canvas.height = qr.getModuleCount() * 10;
            const context = canvas.getContext('2d');
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#000000';
            qr.renderTo2dContext(context, 10);
            const folder = zip.folder(`qrcodes`);
            folder.file(`${item.code}${index + 1}.png`, canvas.toDataURL('image/png').split('base64,')[1], { base64: true });
        });
        zip.generateAsync({ type: 'blob' }).then((content) => {
            download(content, 'qrcodes.zip', 'application/zip');
        });
    };

    const handleWeightChange = (value, id) => {
        const x = listProductDetail.find((detail) => detail.id === id);
        const index = listUpdate.findIndex((item) => item.id === id);
        if (index !== -1) {
            listUpdate[index].weight = value;
        } else {
            listUpdate.push({ id: id, quantity: x.quantity, price: x.price, weight: value });
        }
        console.log(listUpdate);
    }

    const handleQuantityChange = (value, id) => {
        const x = listProductDetail.find((detail) => detail.id === id);
        const index = listUpdate.findIndex((item) => item.id === id);
        if (index !== -1) {
            listUpdate[index].quantity = value;
        } else {
            listUpdate.push({ id: id, quantity: value, price: x.price, weight: x.weight });
        }
        console.log(listUpdate);
    }

    const handlePriceChange = (value, id) => {
        const x = listProductDetail.find((detail) => detail.id === id);
        const index = listUpdate.findIndex((item) => item.id === id);
        if (index !== -1) {
            listUpdate[index].price = value;
        } else {
            listUpdate.push({ id: id, quantity: x.quantity, price: value, weight: x.weight });
        }
        console.log(listUpdate);
    }

    useEffect(() => {
        request.get('/size', { params: { name: searchSize } }).then(response => {
            setListSize(response.data.data);
        }).catch(e => {
            console.log(e);
        });
        request.get('/color', { params: { name: searchSize } }).then(response => {
            setListColor(response.data.data);
        }).catch(e => {
            console.log(e);
        });
        request.get('/marterial', { params: { name: searchSize } }).then(response => {
            setListSole(response.data.data);
        }).catch(e => {
            console.log(e);
        });
    }, [searchSize]);

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Tên',
            dataIndex: 'ten',
            key: 'ten',
            render: (x, record) => (
                <>
                    {x}
                    <br />
                    {record.discountValue !== null && <small className="fw-semibold">SALE <span className="text-danger">{record.discountPercent} %</span></small>}
                </>
            )
        },
        {
            title: 'Chất liệu ',
            dataIndex: 'marterial',
            key: 'marterial',
        },
        {
            title: 'Số lượng',
            dataIndex: 'soLuong',
            key: 'soLuong',
            render: (x, record) => (
                <>
                    {selectedRowKeys.includes(record.id) ? (
                        <InputNumber defaultValue={x} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""}
                            controls={false}
                            min={0}
                            onChange={(value) => handleQuantityChange(value, record.id)}
                        />
                    ) : (
                        <>{x}</>
                    )}
                </>
            )
        },
        {
            title: 'Đơn giá',
            dataIndex: 'giaBan',
            key: 'giaBan',
            render: (x, record) => (
                <>
                    {selectedRowKeys.includes(record.id) ? (
                        <InputNumber defaultValue={x} formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : ""}
                            controls={false}
                            min={0}
                            onChange={(value) => handlePriceChange(value, record.id)}
                        />
                    ) : (
                        <>
                            {record.discountValue == null ? <FormatCurrency value={x} /> : (
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
            title: (<i className="fas fa-image"></i>),
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: "100px" }} >
                    {images.split(',').map((image, index) => (
                        <img src={image} alt="images" style={{ width: "100px", height: "100px" }} className="object-fit-contain" />
                    ))}
                </Carousel>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'action',
            render: (x, record) => (
                <>
                    <UpdateShoeDetail props={record} onSuccess={() => loadShoeDetail()} />
                    <Tooltip placement="bottom" title="Xóa">
                        <Button type="text"><i className="fas fa-trash text-danger"></i></Button>
                    </Tooltip>
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
        await request.get(`/shirt/${id}`).then(response => {
            setProduct(response.data);
            setLoading(false);
        }).catch(e => {
            console.log(e);
        });
    }

    useEffect(() => {
        loadShoeDetail(id, currentPage, pageSize);
    }, [id, currentPage, pageSize, dataFilter]);

    const loadShoeDetail = (id, currentPage, pageSize) => {
        const params = {
            currentPage: currentPage,
            pageSize: pageSize,
            id: id
        };
        request.get(`/shirt-detail`, { params: { ...params, ...dataFilter } }).then(response => {
            setListProductDetail(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
        }).catch(e => {
            console.log(e);
        });
    }

    const handleFilter = (values) => {
        setDataFilter({ ...values });
    }

    return (
        <>
            <div className="d-flex justify-content-between">
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Product</Breadcrumb.Item>
                    <Breadcrumb.Item>Product Detail</Breadcrumb.Item>
                </Breadcrumb>
                <QRCodeAntd value={product.code} />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Title level={4} style={{ margin: 0 }}>
                    {product.name}
                </Title>
                <div>
                    <Button onClick={() => window.print()}>Print QR Code</Button>
                </div>
            </div>
            <Row gutter={16}>
                <Col span={18}>
                    <Divider orientation="left">Product Details</Divider>
                    <Form layout="inline" form={formFilter} onFinish={handleFilter}>
                        <Form.Item name="size">
                            <Select placeholder="Size" style={{ width: 120 }}>
                                {listSize.map((size) => (
                                    <Option key={size.id} value={size.id}>{size.ten}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="color">
                            <Select placeholder="Color" style={{ width: 120 }}>
                                {listColor.map((color) => (
                                    <Option key={color.id} value={color.id}>{color.ten}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="marterial">
                            <Select placeholder="Marterial" style={{ width: 120 }}>
                                {listSole.map((marterial) => (
                                    <Option key={marterial.id} value={sole.id}>{marterial.ten}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Filter
                            </Button>
                        </Form.Item>
                    </Form>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={listProductDetail.map((item, index) => ({
                            ...item,
                            index: (currentPage - 1) * pageSize + index + 1
                        }))}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalPages * pageSize,
                            onChange: (page, pageSize) => {
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            },
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '15'],
                            showQuickJumper: true
                        }}
                        loading={loading}
                    />
                </Col>
                <Col span={6}>
                    <Divider orientation="left">Actions</Divider>
                    <Button type="primary" onClick={downloadAllQRCode} disabled={selectedRowKeys.length === 0}>
                        Download QR Codes
                    </Button>
                </Col>
            </Row>
        </>
    );
}

export default ShirtInfo;