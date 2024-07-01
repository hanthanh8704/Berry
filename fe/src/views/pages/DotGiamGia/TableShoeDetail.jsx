import { Button, Carousel, Col, Form, Input, Row, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import FormatCurrency  from "views/utilities/FormatCurrency";
import * as request from "views/utilities/httpRequestApi";
import { listSanPhamCT } from '../api/ChiTietSanPhamApi/ChiTietSanPhamApi.js'

function TableShoeDetail({ idProduct, setSelectedProductDetail, setRowKeys }) {
    const [listProductDetail, setListProductDetail] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sanPhamCT, setSanPhamCT] = useState([]);
    const [formFilter] = Form.useForm();
    const [listSize, setListSize] = useState([]);
    const [searchSize, setSearchSize] = useState('');

    const [listColor, setListColor] = useState([]);
    const [listSole, setListSole] = useState([]);

    const [dataFilter, setDataFilter] = useState({});


    useEffect(() => {
        getAllSanPham();
      }, []);
    
      function getAllSanPham() {
        listSanPhamCT()
          .then((response) => {
            setSanPhamCT(response.data);
            setProductList(response.data); // Assuming `response.data` contains the array of products
          })
          .catch((error) => {
            console.error(error);
          });
      }

    // useEffect(() => {
    //     loadData(idProduct, dataFilter);
    // }, [idProduct, dataFilter, currentPage, pageSize])

    // useEffect(() => {
    //     setDataFilter(null);
    //     formFilter.resetFields();
    // }, [idProduct])

    // useEffect(() => {
    //     setSelectedRowKeys(setRowKeys);
    // }, [setRowKeys])
    // const loadData = (idProduct, dataFilter) => {
    //     request.get('/shoe-detail', {
    //         params: {
    //             shoe: idProduct,
    //             name: dataFilter?.name,
    //             size: dataFilter?.size,
    //             color: dataFilter?.color,
    //             sole: dataFilter?.sole,
    //             page: 1,
    //             sizePage: 1_000_000
    //         }
    //     }).then(response => {
    //         setListProductDetail(response.data);
    //         setTotalPages(response.totalPages);
    //     }).catch(e => {
    //         console.log(e);
    //     })
    // }

    // useEffect(() => {
    //     request.get('/size', { params: { name: searchSize } }).then(response => {
    //         setListSize(response.data);
    //     }).catch(e => {
    //         console.log(e);
    //     })
    //     request.get('/color', { params: { name: searchSize } }).then(response => {
    //         setListColor(response.data);
    //     }).catch(e => {
    //         console.log(e);
    //     })
    //     request.get('/sole', { params: { name: searchSize } }).then(response => {
    //         setListSole(response.data);
    //     }).catch(e => {
    //         console.log(e);
    //     })
    // }, [searchSize])

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
        },
        {
            title: "Tên",
            dataIndex: "ten",
            key: "ten",
            render: (x, record) => (
                <>
                    {x}
                    <br />
                    {record.discountValue !== null && <small className="fw-semibold">SALE <span className="text-danger">{record.discountPercent} %</span></small>}
                </>
            )
        },
        {
            title: "Số lượng",
            dataIndex: "soLuong",
            key: "soLuong",
            render: (x) => (x == null ? 0 : x),
        },
        {
            title: "Đơn giá",
            dataIndex: "giaBan",
            key: "giaBan",
            render: (x, record) => (
                <>
                    {record.discountPercent !== null ? (
                        <>
                            <span className="text-danger"><FormatCurrency value={record.discountValue} /></span> <br /> <span className="text-decoration-line-through text-secondary"><FormatCurrency value={record.price} /></span>
                        </>
                    ) : (
                        <span className="text-danger"><FormatCurrency value={record.price} /></span>
                    )}
                </>
            )
        },
    ];


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
        console.log(newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedProductDetail(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Table
                rowKey="id"
                // rowSelection={rowSelection}
                dataSource={listProductDetail}
                columns={columns}
                className="mt-3"
                pagination={{
                    showSizeChanger: true,
                    current: currentPage,
                    pageSize: pageSize,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    showQuickJumper: true,
                    total: listProductDetail.length,
                    onChange: (page, pageSize) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    },
                }}
            />
        </>
    );
}

export default TableShoeDetail;